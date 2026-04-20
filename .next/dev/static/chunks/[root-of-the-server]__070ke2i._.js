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
"[project]/src/pages/products/[id].js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__N_SSG",
    ()=>__N_SSG,
    "default",
    ()=>ProductDetail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/compiler-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #e0e0e0',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.9rem',
    outline: 'none',
    color: '#333',
    background: '#fafafa'
};
var __N_SSG = true;
function ProductDetail(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(64);
    if ($[0] !== "40a26cfffa435ba3bc7739e7d300df1c9e866558c749f96ed47a04d2d20dbcc9") {
        for(let $i = 0; $i < 64; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "40a26cfffa435ba3bc7739e7d300df1c9e866558c749f96ed47a04d2d20dbcc9";
    }
    const { product } = t0;
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [editing, setEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t1;
    if ($[1] !== product.description || $[2] !== product.price || $[3] !== product.title) {
        t1 = {
            title: product.title,
            price: product.price,
            description: product.description
        };
        $[1] = product.description;
        $[2] = product.price;
        $[3] = product.title;
        $[4] = t1;
    } else {
        t1 = $[4];
    }
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(t1);
    const [toast, setToast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    let t2;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = ({
            "ProductDetail[showToast]": (msg)=>{
                setToast(msg);
                setTimeout({
                    "ProductDetail[showToast > setTimeout()]": ()=>setToast("")
                }["ProductDetail[showToast > setTimeout()]"], 2500);
            }
        })["ProductDetail[showToast]"];
        $[5] = t2;
    } else {
        t2 = $[5];
    }
    const showToast = t2;
    let t3;
    if ($[6] !== form || $[7] !== product.id) {
        t3 = ({
            "ProductDetail[handleUpdate]": async ()=>{
                await fetch(`https://dummyjson.com/products/${product.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...form,
                        price: parseFloat(form.price)
                    })
                });
                setEditing(false);
                showToast("Product updated!");
            }
        })["ProductDetail[handleUpdate]"];
        $[6] = form;
        $[7] = product.id;
        $[8] = t3;
    } else {
        t3 = $[8];
    }
    const handleUpdate = t3;
    let t4;
    if ($[9] !== product.id || $[10] !== router) {
        t4 = ({
            "ProductDetail[handleDelete]": async ()=>{
                if (!confirm("Delete this product?")) {
                    return;
                }
                await fetch(`https://dummyjson.com/products/${product.id}`, {
                    method: "DELETE"
                });
                router.push("/products");
            }
        })["ProductDetail[handleDelete]"];
        $[9] = product.id;
        $[10] = router;
        $[11] = t4;
    } else {
        t4 = $[11];
    }
    const handleDelete = t4;
    let t5;
    if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = {
            maxWidth: 900,
            margin: "0 auto",
            padding: "32px 24px"
        };
        $[12] = t5;
    } else {
        t5 = $[12];
    }
    let t6;
    if ($[13] !== router) {
        t6 = ({
            "ProductDetail[<button>.onClick]": ()=>router.push("/products")
        })["ProductDetail[<button>.onClick]"];
        $[13] = router;
        $[14] = t6;
    } else {
        t6 = $[14];
    }
    let t7;
    if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = {
            background: "none",
            border: "1px solid #e0e0e0",
            borderRadius: 8,
            padding: "8px 16px",
            cursor: "pointer",
            fontFamily: "Poppins, sans-serif",
            fontSize: "0.85rem",
            color: "#666",
            marginBottom: 24
        };
        $[15] = t7;
    } else {
        t7 = $[15];
    }
    let t8;
    if ($[16] !== t6) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: t6,
            style: t7,
            children: "← Back"
        }, void 0, false, {
            fileName: "[project]/src/pages/products/[id].js",
            lineNumber: 171,
            columnNumber: 10
        }, this);
        $[16] = t6;
        $[17] = t8;
    } else {
        t8 = $[17];
    }
    let t9;
    if ($[18] !== toast) {
        t9 = toast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                background: "#e8f5e9",
                border: "1px solid #a5d6a7",
                color: "#2e7d32",
                padding: "10px 16px",
                borderRadius: 8,
                marginBottom: 20,
                fontSize: "0.88rem"
            },
            children: toast
        }, void 0, false, {
            fileName: "[project]/src/pages/products/[id].js",
            lineNumber: 179,
            columnNumber: 19
        }, this);
        $[18] = toast;
        $[19] = t9;
    } else {
        t9 = $[19];
    }
    let t10;
    if ($[20] === Symbol.for("react.memo_cache_sentinel")) {
        t10 = {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #e8e8e8",
            padding: 32
        };
        $[20] = t10;
    } else {
        t10 = $[20];
    }
    let t11;
    if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
        t11 = {
            width: "100%",
            height: 340,
            objectFit: "contain",
            borderRadius: 12,
            background: "#f5f7fa"
        };
        $[21] = t11;
    } else {
        t11 = $[21];
    }
    let t12;
    if ($[22] !== product.thumbnail || $[23] !== product.title) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            src: product.thumbnail,
            alt: product.title,
            width: 400,
            height: 340,
            style: t11
        }, void 0, false, {
            fileName: "[project]/src/pages/products/[id].js",
            lineNumber: 223,
            columnNumber: 11
        }, this);
        $[22] = product.thumbnail;
        $[23] = product.title;
        $[24] = t12;
    } else {
        t12 = $[24];
    }
    let t13;
    if ($[25] === Symbol.for("react.memo_cache_sentinel")) {
        t13 = {
            display: "flex",
            gap: 12,
            marginTop: 16
        };
        $[25] = t13;
    } else {
        t13 = $[25];
    }
    let t14;
    if ($[26] !== product.rating) {
        t14 = [
            "\u2B50 Rating",
            product.rating
        ];
        $[26] = product.rating;
        $[27] = t14;
    } else {
        t14 = $[27];
    }
    let t15;
    if ($[28] !== product.stock) {
        t15 = [
            "\uD83D\uDCE6 Stock",
            product.stock
        ];
        $[28] = product.stock;
        $[29] = t15;
    } else {
        t15 = $[29];
    }
    const t16 = `${product.discountPercentage}%`;
    let t17;
    if ($[30] !== t16) {
        t17 = [
            "\uD83C\uDFF7\uFE0F Discount",
            t16
        ];
        $[30] = t16;
        $[31] = t17;
    } else {
        t17 = $[31];
    }
    let t18;
    if ($[32] !== t14 || $[33] !== t15 || $[34] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t13,
            children: [
                t14,
                t15,
                t17
            ].map(_ProductDetailAnonymous)
        }, void 0, false, {
            fileName: "[project]/src/pages/products/[id].js",
            lineNumber: 268,
            columnNumber: 11
        }, this);
        $[32] = t14;
        $[33] = t15;
        $[34] = t17;
        $[35] = t18;
    } else {
        t18 = $[35];
    }
    let t19;
    if ($[36] !== t12 || $[37] !== t18) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t12,
                t18
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/products/[id].js",
            lineNumber: 278,
            columnNumber: 11
        }, this);
        $[36] = t12;
        $[37] = t18;
        $[38] = t19;
    } else {
        t19 = $[38];
    }
    let t20;
    let t21;
    let t22;
    if ($[39] === Symbol.for("react.memo_cache_sentinel")) {
        t20 = {
            display: "flex",
            flexDirection: "column",
            gap: 12
        };
        t21 = {
            display: "flex",
            gap: 8,
            flexWrap: "wrap"
        };
        t22 = {
            background: "#eef0ff",
            color: "#4f6ef7",
            borderRadius: 999,
            padding: "3px 12px",
            fontSize: "0.75rem",
            fontWeight: 600
        };
        $[39] = t20;
        $[40] = t21;
        $[41] = t22;
    } else {
        t20 = $[39];
        t21 = $[40];
        t22 = $[41];
    }
    let t23;
    if ($[42] !== product.category) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            style: t22,
            children: product.category
        }, void 0, false, {
            fileName: "[project]/src/pages/products/[id].js",
            lineNumber: 317,
            columnNumber: 11
        }, this);
        $[42] = product.category;
        $[43] = t23;
    } else {
        t23 = $[43];
    }
    let t24;
    if ($[44] !== product.brand) {
        t24 = product.brand && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            style: {
                background: "#f5f5f5",
                color: "#666",
                borderRadius: 999,
                padding: "3px 12px",
                fontSize: "0.75rem",
                fontWeight: 600
            },
            children: product.brand
        }, void 0, false, {
            fileName: "[project]/src/pages/products/[id].js",
            lineNumber: 325,
            columnNumber: 28
        }, this);
        $[44] = product.brand;
        $[45] = t24;
    } else {
        t24 = $[45];
    }
    let t25;
    if ($[46] !== t23 || $[47] !== t24) {
        t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t21,
            children: [
                t23,
                t24
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/products/[id].js",
            lineNumber: 340,
            columnNumber: 11
        }, this);
        $[46] = t23;
        $[47] = t24;
        $[48] = t25;
    } else {
        t25 = $[48];
    }
    let t26;
    if ($[49] !== editing || $[50] !== form || $[51] !== handleDelete || $[52] !== handleUpdate) {
        t26 = editing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    style: {
                        fontSize: "0.78rem",
                        color: "#999",
                        fontWeight: 600
                    },
                    children: "Title"
                }, void 0, false, {
                    fileName: "[project]/src/pages/products/[id].js",
                    lineNumber: 349,
                    columnNumber: 23
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    style: inputStyle,
                    value: form.title,
                    onChange: {
                        "ProductDetail[<input>.onChange]": (e)=>setForm({
                                ...form,
                                title: e.target.value
                            })
                    }["ProductDetail[<input>.onChange]"]
                }, void 0, false, {
                    fileName: "[project]/src/pages/products/[id].js",
                    lineNumber: 353,
                    columnNumber: 23
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    style: {
                        fontSize: "0.78rem",
                        color: "#999",
                        fontWeight: 600
                    },
                    children: "Price ($)"
                }, void 0, false, {
                    fileName: "[project]/src/pages/products/[id].js",
                    lineNumber: 358,
                    columnNumber: 47
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    style: inputStyle,
                    type: "number",
                    value: form.price,
                    onChange: {
                        "ProductDetail[<input>.onChange]": (e_0)=>setForm({
                                ...form,
                                price: e_0.target.value
                            })
                    }["ProductDetail[<input>.onChange]"]
                }, void 0, false, {
                    fileName: "[project]/src/pages/products/[id].js",
                    lineNumber: 362,
                    columnNumber: 27
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    style: {
                        fontSize: "0.78rem",
                        color: "#999",
                        fontWeight: 600
                    },
                    children: "Description"
                }, void 0, false, {
                    fileName: "[project]/src/pages/products/[id].js",
                    lineNumber: 367,
                    columnNumber: 47
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                    style: {
                        ...inputStyle,
                        minHeight: 90,
                        resize: "vertical"
                    },
                    value: form.description,
                    onChange: {
                        "ProductDetail[<textarea>.onChange]": (e_1)=>setForm({
                                ...form,
                                description: e_1.target.value
                            })
                    }["ProductDetail[<textarea>.onChange]"]
                }, void 0, false, {
                    fileName: "[project]/src/pages/products/[id].js",
                    lineNumber: 371,
                    columnNumber: 29
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        gap: 8,
                        marginTop: 4
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleUpdate,
                            style: {
                                flex: 1,
                                padding: "10px",
                                borderRadius: 8,
                                border: "none",
                                background: "#4f6ef7",
                                color: "#fff",
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "Poppins, sans-serif"
                            },
                            children: "Save"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/products/[id].js",
                            lineNumber: 384,
                            columnNumber: 10
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: {
                                "ProductDetail[<button>.onClick]": ()=>setEditing(false)
                            }["ProductDetail[<button>.onClick]"],
                            style: {
                                flex: 1,
                                padding: "10px",
                                borderRadius: 8,
                                border: "1px solid #e0e0e0",
                                background: "#fff",
                                color: "#666",
                                cursor: "pointer",
                                fontFamily: "Poppins, sans-serif"
                            },
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/products/[id].js",
                            lineNumber: 394,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/products/[id].js",
                    lineNumber: 380,
                    columnNumber: 50
                }, this)
            ]
        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    style: {
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        lineHeight: 1.3,
                        color: "#222"
                    },
                    children: form.title
                }, void 0, false, {
                    fileName: "[project]/src/pages/products/[id].js",
                    lineNumber: 405,
                    columnNumber: 41
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        fontSize: "1.8rem",
                        fontWeight: 700,
                        color: "#4f6ef7"
                    },
                    children: [
                        "$",
                        form.price
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/products/[id].js",
                    lineNumber: 410,
                    columnNumber: 27
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        color: "#777",
                        fontSize: "0.9rem",
                        lineHeight: 1.7
                    },
                    children: form.description
                }, void 0, false, {
                    fileName: "[project]/src/pages/products/[id].js",
                    lineNumber: 414,
                    columnNumber: 27
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        gap: 10,
                        marginTop: "auto",
                        paddingTop: 12
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: {
                                "ProductDetail[<button>.onClick]": ()=>setEditing(true)
                            }["ProductDetail[<button>.onClick]"],
                            style: {
                                flex: 1,
                                padding: "11px",
                                borderRadius: 8,
                                border: "none",
                                background: "#4f6ef7",
                                color: "#fff",
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "Poppins, sans-serif"
                            },
                            children: "Edit"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/products/[id].js",
                            lineNumber: 423,
                            columnNumber: 10
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleDelete,
                            style: {
                                flex: 1,
                                padding: "11px",
                                borderRadius: 8,
                                border: "1px solid #ffcdd2",
                                background: "#fff0f0",
                                color: "#e53935",
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "Poppins, sans-serif"
                            },
                            children: "Delete"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/products/[id].js",
                            lineNumber: 435,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/products/[id].js",
                    lineNumber: 418,
                    columnNumber: 32
                }, this)
            ]
        }, void 0, true);
        $[49] = editing;
        $[50] = form;
        $[51] = handleDelete;
        $[52] = handleUpdate;
        $[53] = t26;
    } else {
        t26 = $[53];
    }
    let t27;
    if ($[54] !== t25 || $[55] !== t26) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t20,
            children: [
                t25,
                t26
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/products/[id].js",
            lineNumber: 456,
            columnNumber: 11
        }, this);
        $[54] = t25;
        $[55] = t26;
        $[56] = t27;
    } else {
        t27 = $[56];
    }
    let t28;
    if ($[57] !== t19 || $[58] !== t27) {
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t10,
            children: [
                t19,
                t27
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/products/[id].js",
            lineNumber: 465,
            columnNumber: 11
        }, this);
        $[57] = t19;
        $[58] = t27;
        $[59] = t28;
    } else {
        t28 = $[59];
    }
    let t29;
    if ($[60] !== t28 || $[61] !== t8 || $[62] !== t9) {
        t29 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t5,
            children: [
                t8,
                t9,
                t28
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/products/[id].js",
            lineNumber: 474,
            columnNumber: 11
        }, this);
        $[60] = t28;
        $[61] = t8;
        $[62] = t9;
        $[63] = t29;
    } else {
        t29 = $[63];
    }
    return t29;
}
_s(ProductDetail, "VU8J4y+fQSm9+50byidgdm0bn+0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ProductDetail;
function _ProductDetailAnonymous(t0) {
    const [label, val] = t0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            flex: 1,
            background: "#f5f7fa",
            borderRadius: 10,
            padding: "10px 8px",
            textAlign: "center"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    fontSize: "0.72rem",
                    color: "#999",
                    marginBottom: 2
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/src/pages/products/[id].js",
                lineNumber: 492,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    fontWeight: 700,
                    fontSize: "0.9rem"
                },
                children: val
            }, void 0, false, {
                fileName: "[project]/src/pages/products/[id].js",
                lineNumber: 496,
                columnNumber: 19
            }, this)
        ]
    }, label, true, {
        fileName: "[project]/src/pages/products/[id].js",
        lineNumber: 486,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "ProductDetail");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/products/[id].js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/products/[id]";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/products/[id].js [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/products/[id].js\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/products/[id].js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__070ke2i._.js.map