(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime/runtime-types.d.ts" />
/// <reference path="../../../shared/runtime/dev-globals.d.ts" />
/// <reference path="../../../shared/runtime/dev-protocol.d.ts" />
/// <reference path="../../../shared/runtime/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateB.type === 'total') {
        // A total update replaces the entire chunk, so it supersedes any prior update.
        return updateB;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/src/pages/products/index.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__N_SSG",
    ()=>__N_SSG,
    "default",
    ()=>Products
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/compiler-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const btn = (extra = {})=>({
        padding: '8px 16px',
        borderRadius: 8,
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 500,
        fontSize: '0.85rem',
        ...extra
    });
const input = {
    padding: '9px 14px',
    borderRadius: 8,
    border: '1px solid #e0e0e0',
    background: '#fff',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.88rem',
    outline: 'none',
    color: '#333'
};
var __N_SSG = true;
function Products(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(78);
    if ($[0] !== "d9fdc9bb14688caf98e3e3e8f3682b164f6ac544692c05a08b3fe8f916b25d43") {
        for(let $i = 0; $i < 78; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "d9fdc9bb14688caf98e3e3e8f3682b164f6ac544692c05a08b3fe8f916b25d43";
    }
    const { products, categories, brands } = t0;
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [cat, setCat] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [brand, setBrand] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [list, setList] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(products);
    const [showModal, setShowModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = {
            title: "",
            price: "",
            category: "",
            brand: ""
        };
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(t1);
    const [toast, setToast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    let t2;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = ({
            "Products[showToast]": (msg)=>{
                setToast(msg);
                setTimeout({
                    "Products[showToast > setTimeout()]": ()=>setToast("")
                }["Products[showToast > setTimeout()]"], 2500);
            }
        })["Products[showToast]"];
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    const showToast = t2;
    let handleAdd;
    let t3;
    let t4;
    let t5;
    let t6;
    let t7;
    let t8;
    if ($[3] !== brand || $[4] !== brands || $[5] !== cat || $[6] !== categories || $[7] !== form || $[8] !== list || $[9] !== search || $[10] !== toast) {
        let t9;
        if ($[18] !== brand || $[19] !== cat || $[20] !== search) {
            t9 = ({
                "Products[list.filter()]": (p)=>p.title.toLowerCase().includes(search.toLowerCase()) && (cat ? p.category === cat : true) && (brand ? p.brand === brand : true)
            })["Products[list.filter()]"];
            $[18] = brand;
            $[19] = cat;
            $[20] = search;
            $[21] = t9;
        } else {
            t9 = $[21];
        }
        const filtered = list.filter(t9);
        let t10;
        if ($[22] === Symbol.for("react.memo_cache_sentinel")) {
            t10 = ({
                "Products[handleDelete]": async (id)=>{
                    if (!confirm("Delete this product?")) {
                        return;
                    }
                    await fetch(`https://dummyjson.com/products/${id}`, {
                        method: "DELETE"
                    });
                    setList({
                        "Products[handleDelete > setList()]": (prev)=>prev.filter({
                                "Products[handleDelete > setList() > prev.filter()]": (p_0)=>p_0.id !== id
                            }["Products[handleDelete > setList() > prev.filter()]"])
                    }["Products[handleDelete > setList()]"]);
                    showToast("Deleted successfully!");
                }
            })["Products[handleDelete]"];
            $[22] = t10;
        } else {
            t10 = $[22];
        }
        const handleDelete = t10;
        let t11;
        if ($[23] !== form) {
            t11 = ({
                "Products[handleAdd]": async ()=>{
                    if (!form.title) {
                        return;
                    }
                    const res = await fetch("https://dummyjson.com/products/add", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            ...form,
                            price: parseFloat(form.price) || 0
                        })
                    });
                    const newP = await res.json();
                    setList({
                        "Products[handleAdd > setList()]": (prev_0)=>[
                                {
                                    ...newP,
                                    thumbnail: "https://dummyjson.com/icon/dummyjson/128"
                                },
                                ...prev_0
                            ]
                    }["Products[handleAdd > setList()]"]);
                    setShowModal(false);
                    setForm({
                        title: "",
                        price: "",
                        category: "",
                        brand: ""
                    });
                    showToast("Product added!");
                }
            })["Products[handleAdd]"];
            $[23] = form;
            $[24] = t11;
        } else {
            t11 = $[24];
        }
        handleAdd = t11;
        let t12;
        let t13;
        if ($[25] === Symbol.for("react.memo_cache_sentinel")) {
            t5 = {
                maxWidth: 1100,
                margin: "0 auto",
                padding: "32px 24px"
            };
            t12 = {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24
            };
            t13 = {
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "#222"
            };
            $[25] = t12;
            $[26] = t13;
            $[27] = t5;
        } else {
            t12 = $[25];
            t13 = $[26];
            t5 = $[27];
        }
        let t14;
        if ($[28] === Symbol.for("react.memo_cache_sentinel")) {
            t14 = {
                color: "#aaa",
                fontWeight: 400,
                fontSize: "1rem"
            };
            $[28] = t14;
        } else {
            t14 = $[28];
        }
        const t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
            style: t13,
            children: [
                "Products ",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: t14,
                    children: [
                        "(",
                        filtered.length,
                        ")"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/products/index.js",
                    lineNumber: 217,
                    columnNumber: 42
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/products/index.js",
            lineNumber: 217,
            columnNumber: 17
        }, this);
        let t16;
        if ($[29] === Symbol.for("react.memo_cache_sentinel")) {
            t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: {
                    "Products[<button>.onClick]": ()=>setShowModal(true)
                }["Products[<button>.onClick]"],
                style: btn({
                    background: "#4f6ef7",
                    color: "#fff"
                }),
                children: "+ Add Product"
            }, void 0, false, {
                fileName: "[project]/src/pages/products/index.js",
                lineNumber: 220,
                columnNumber: 13
            }, this);
            $[29] = t16;
        } else {
            t16 = $[29];
        }
        if ($[30] !== t15) {
            t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t12,
                children: [
                    t15,
                    t16
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/products/index.js",
                lineNumber: 231,
                columnNumber: 12
            }, this);
            $[30] = t15;
            $[31] = t6;
        } else {
            t6 = $[31];
        }
        if ($[32] !== toast) {
            t7 = toast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: "#e8f5e9",
                    border: "1px solid #a5d6a7",
                    color: "#2e7d32",
                    padding: "10px 16px",
                    borderRadius: 8,
                    marginBottom: 16,
                    fontSize: "0.88rem"
                },
                children: toast
            }, void 0, false, {
                fileName: "[project]/src/pages/products/index.js",
                lineNumber: 238,
                columnNumber: 21
            }, this);
            $[32] = toast;
            $[33] = t7;
        } else {
            t7 = $[33];
        }
        let t17;
        let t18;
        if ($[34] === Symbol.for("react.memo_cache_sentinel")) {
            t17 = {
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginBottom: 24
            };
            t18 = {
                ...input,
                flex: 1,
                minWidth: 160
            };
            $[34] = t17;
            $[35] = t18;
        } else {
            t17 = $[34];
            t18 = $[35];
        }
        let t19;
        if ($[36] === Symbol.for("react.memo_cache_sentinel")) {
            t19 = ({
                "Products[<input>.onChange]": (e)=>setSearch(e.target.value)
            })["Products[<input>.onChange]"];
            $[36] = t19;
        } else {
            t19 = $[36];
        }
        let t20;
        if ($[37] !== search) {
            t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                style: t18,
                placeholder: "Search...",
                value: search,
                onChange: t19
            }, void 0, false, {
                fileName: "[project]/src/pages/products/index.js",
                lineNumber: 283,
                columnNumber: 13
            }, this);
            $[37] = search;
            $[38] = t20;
        } else {
            t20 = $[38];
        }
        let t21;
        let t22;
        if ($[39] === Symbol.for("react.memo_cache_sentinel")) {
            t21 = ({
                "Products[<select>.onChange]": (e_0)=>setCat(e_0.target.value)
            })["Products[<select>.onChange]"];
            t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                value: "",
                children: "All Categories"
            }, void 0, false, {
                fileName: "[project]/src/pages/products/index.js",
                lineNumber: 295,
                columnNumber: 13
            }, this);
            $[39] = t21;
            $[40] = t22;
        } else {
            t21 = $[39];
            t22 = $[40];
        }
        let t23;
        if ($[41] !== categories) {
            t23 = categories.map(_ProductsCategoriesMap);
            $[41] = categories;
            $[42] = t23;
        } else {
            t23 = $[42];
        }
        let t24;
        if ($[43] !== cat || $[44] !== t23) {
            t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                style: input,
                value: cat,
                onChange: t21,
                children: [
                    t22,
                    t23
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/products/index.js",
                lineNumber: 312,
                columnNumber: 13
            }, this);
            $[43] = cat;
            $[44] = t23;
            $[45] = t24;
        } else {
            t24 = $[45];
        }
        let t25;
        let t26;
        if ($[46] === Symbol.for("react.memo_cache_sentinel")) {
            t25 = ({
                "Products[<select>.onChange]": (e_1)=>setBrand(e_1.target.value)
            })["Products[<select>.onChange]"];
            t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                value: "",
                children: "All Brands"
            }, void 0, false, {
                fileName: "[project]/src/pages/products/index.js",
                lineNumber: 325,
                columnNumber: 13
            }, this);
            $[46] = t25;
            $[47] = t26;
        } else {
            t25 = $[46];
            t26 = $[47];
        }
        let t27;
        if ($[48] !== brands) {
            t27 = brands.map(_ProductsBrandsMap);
            $[48] = brands;
            $[49] = t27;
        } else {
            t27 = $[49];
        }
        let t28;
        if ($[50] !== brand || $[51] !== t27) {
            t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                style: input,
                value: brand,
                onChange: t25,
                children: [
                    t26,
                    t27
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/products/index.js",
                lineNumber: 342,
                columnNumber: 13
            }, this);
            $[50] = brand;
            $[51] = t27;
            $[52] = t28;
        } else {
            t28 = $[52];
        }
        let t29;
        if ($[53] !== brand || $[54] !== cat || $[55] !== search) {
            t29 = (search || cat || brand) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: {
                    "Products[<button>.onClick]": ()=>{
                        setSearch("");
                        setCat("");
                        setBrand("");
                    }
                }["Products[<button>.onClick]"],
                style: btn({
                    background: "#f0f0f0",
                    color: "#666"
                }),
                children: "Clear"
            }, void 0, false, {
                fileName: "[project]/src/pages/products/index.js",
                lineNumber: 351,
                columnNumber: 41
            }, this);
            $[53] = brand;
            $[54] = cat;
            $[55] = search;
            $[56] = t29;
        } else {
            t29 = $[56];
        }
        if ($[57] !== t20 || $[58] !== t24 || $[59] !== t28 || $[60] !== t29) {
            t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t17,
                children: [
                    t20,
                    t24,
                    t28,
                    t29
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/products/index.js",
                lineNumber: 369,
                columnNumber: 12
            }, this);
            $[57] = t20;
            $[58] = t24;
            $[59] = t28;
            $[60] = t29;
            $[61] = t8;
        } else {
            t8 = $[61];
        }
        if ($[62] === Symbol.for("react.memo_cache_sentinel")) {
            t3 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
                gap: 16
            };
            $[62] = t3;
        } else {
            t3 = $[62];
        }
        let t30;
        if ($[63] === Symbol.for("react.memo_cache_sentinel")) {
            t30 = ({
                "Products[filtered.map()]": (p_1)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: "#fff",
                            borderRadius: 12,
                            border: "1px solid #e8e8e8",
                            overflow: "hidden"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                href: `/products/${p_1.id}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: p_1.thumbnail,
                                    alt: p_1.title,
                                    width: 300,
                                    height: 160,
                                    style: {
                                        width: "100%",
                                        height: 160,
                                        objectFit: "cover",
                                        display: "block"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/products/index.js",
                                    lineNumber: 396,
                                    columnNumber: 47
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/pages/products/index.js",
                                lineNumber: 396,
                                columnNumber: 12
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "12px 14px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: "0.7rem",
                                            color: "#4f6ef7",
                                            fontWeight: 600,
                                            textTransform: "uppercase",
                                            marginBottom: 4
                                        },
                                        children: p_1.category
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products/index.js",
                                        lineNumber: 403,
                                        columnNumber: 14
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/products/${p_1.id}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                fontWeight: 600,
                                                fontSize: "0.88rem",
                                                marginBottom: 2,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap"
                                            },
                                            children: p_1.title
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products/index.js",
                                            lineNumber: 409,
                                            columnNumber: 69
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products/index.js",
                                        lineNumber: 409,
                                        columnNumber: 34
                                    }, this),
                                    p_1.brand && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: "0.78rem",
                                            color: "#999",
                                            marginBottom: 8
                                        },
                                        children: p_1.brand
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products/index.js",
                                        lineNumber: 416,
                                        columnNumber: 54
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontWeight: 700,
                                                    color: "#4f6ef7"
                                                },
                                                children: [
                                                    "$",
                                                    p_1.price
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/products/index.js",
                                                lineNumber: 424,
                                                columnNumber: 16
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: {
                                                    "Products[filtered.map() > <button>.onClick]": ()=>handleDelete(p_1.id)
                                                }["Products[filtered.map() > <button>.onClick]"],
                                                style: btn({
                                                    background: "#fff0f0",
                                                    color: "#e53935",
                                                    border: "1px solid #ffcdd2",
                                                    padding: "5px 10px"
                                                }),
                                                children: "Delete"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products/index.js",
                                                lineNumber: 427,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/products/index.js",
                                        lineNumber: 420,
                                        columnNumber: 32
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/products/index.js",
                                lineNumber: 401,
                                columnNumber: 25
                            }, this)
                        ]
                    }, p_1.id, true, {
                        fileName: "[project]/src/pages/products/index.js",
                        lineNumber: 391,
                        columnNumber: 44
                    }, this)
            })["Products[filtered.map()]"];
            $[63] = t30;
        } else {
            t30 = $[63];
        }
        t4 = filtered.map(t30);
        $[3] = brand;
        $[4] = brands;
        $[5] = cat;
        $[6] = categories;
        $[7] = form;
        $[8] = list;
        $[9] = search;
        $[10] = toast;
        $[11] = handleAdd;
        $[12] = t3;
        $[13] = t4;
        $[14] = t5;
        $[15] = t6;
        $[16] = t7;
        $[17] = t8;
    } else {
        handleAdd = $[11];
        t3 = $[12];
        t4 = $[13];
        t5 = $[14];
        t6 = $[15];
        t7 = $[16];
        t8 = $[17];
    }
    let t9;
    if ($[64] !== t3 || $[65] !== t4) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t3,
            children: t4
        }, void 0, false, {
            fileName: "[project]/src/pages/products/index.js",
            lineNumber: 467,
            columnNumber: 10
        }, this);
        $[64] = t3;
        $[65] = t4;
        $[66] = t9;
    } else {
        t9 = $[66];
    }
    let t10;
    if ($[67] !== form || $[68] !== handleAdd || $[69] !== showModal) {
        t10 = showModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            onClick: {
                "Products[<div>.onClick]": ()=>setShowModal(false)
            }["Products[<div>.onClick]"],
            style: {
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 999
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onClick: _ProductsDivOnClick,
                style: {
                    background: "#fff",
                    borderRadius: 16,
                    padding: 28,
                    width: "100%",
                    maxWidth: 420,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        style: {
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            marginBottom: 4
                        },
                        children: "Add New Product"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/products/index.js",
                        lineNumber: 495,
                        columnNumber: 10
                    }, this),
                    [
                        "title",
                        "price",
                        "category",
                        "brand"
                    ].map({
                        "Products[(anonymous)()]": (field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                placeholder: field.charAt(0).toUpperCase() + field.slice(1),
                                type: field === "price" ? "number" : "text",
                                value: form[field],
                                onChange: {
                                    "Products[(anonymous)() > <input>.onChange]": (e_3)=>setForm({
                                            ...form,
                                            [field]: e_3.target.value
                                        })
                                }["Products[(anonymous)() > <input>.onChange]"],
                                style: {
                                    ...input,
                                    width: "100%"
                                }
                            }, field, false, {
                                fileName: "[project]/src/pages/products/index.js",
                                lineNumber: 500,
                                columnNumber: 47
                            }, this)
                    }["Products[(anonymous)()]"]),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            gap: 8,
                            justifyContent: "flex-end",
                            marginTop: 4
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: {
                                    "Products[<button>.onClick]": ()=>setShowModal(false)
                                }["Products[<button>.onClick]"],
                                style: btn({
                                    background: "#f5f5f5",
                                    color: "#666"
                                }),
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/products/index.js",
                                lineNumber: 514,
                                columnNumber: 12
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleAdd,
                                style: btn({
                                    background: "#4f6ef7",
                                    color: "#fff"
                                }),
                                children: "Add"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/products/index.js",
                                lineNumber: 519,
                                columnNumber: 30
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/products/index.js",
                        lineNumber: 509,
                        columnNumber: 39
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/products/index.js",
                lineNumber: 486,
                columnNumber: 8
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/pages/products/index.js",
            lineNumber: 476,
            columnNumber: 24
        }, this);
        $[67] = form;
        $[68] = handleAdd;
        $[69] = showModal;
        $[70] = t10;
    } else {
        t10 = $[70];
    }
    let t11;
    if ($[71] !== t10 || $[72] !== t5 || $[73] !== t6 || $[74] !== t7 || $[75] !== t8 || $[76] !== t9) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t5,
            children: [
                t6,
                t7,
                t8,
                t9,
                t10
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/products/index.js",
            lineNumber: 532,
            columnNumber: 11
        }, this);
        $[71] = t10;
        $[72] = t5;
        $[73] = t6;
        $[74] = t7;
        $[75] = t8;
        $[76] = t9;
        $[77] = t11;
    } else {
        t11 = $[77];
    }
    return t11;
}
_s(Products, "Qr2vX4C7yP8Arx/vpfwQeRXfCAw=");
_c = Products;
function _ProductsDivOnClick(e_2) {
    return e_2.stopPropagation();
}
function _ProductsBrandsMap(b) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
        value: b,
        children: b
    }, b, false, {
        fileName: "[project]/src/pages/products/index.js",
        lineNumber: 549,
        columnNumber: 10
    }, this);
}
function _ProductsCategoriesMap(c) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
        value: c,
        children: c
    }, c, false, {
        fileName: "[project]/src/pages/products/index.js",
        lineNumber: 552,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "Products");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/products/index.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/products";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/products/index.js [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if ("TURBOPACK compile-time truthy", 1) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/products/index.js\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/products/index.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__04sbvjn._.js.map