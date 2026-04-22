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
"[project]/src/styles/Products.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "addBtn": "Products-module__6JFh0G__addBtn",
  "brand": "Products-module__6JFh0G__brand",
  "cancelBtn": "Products-module__6JFh0G__cancelBtn",
  "card": "Products-module__6JFh0G__card",
  "cardBody": "Products-module__6JFh0G__cardBody",
  "cardFooter": "Products-module__6JFh0G__cardFooter",
  "cat": "Products-module__6JFh0G__cat",
  "clearBtn": "Products-module__6JFh0G__clearBtn",
  "container": "Products-module__6JFh0G__container",
  "delBtn": "Products-module__6JFh0G__delBtn",
  "filters": "Products-module__6JFh0G__filters",
  "grid": "Products-module__6JFh0G__grid",
  "guestBanner": "Products-module__6JFh0G__guestBanner",
  "input": "Products-module__6JFh0G__input",
  "lockedBanner": "Products-module__6JFh0G__lockedBanner",
  "modal": "Products-module__6JFh0G__modal",
  "modalBtns": "Products-module__6JFh0G__modalBtns",
  "modalInput": "Products-module__6JFh0G__modalInput",
  "msg": "Products-module__6JFh0G__msg",
  "name": "Products-module__6JFh0G__name",
  "overlay": "Products-module__6JFh0G__overlay",
  "price": "Products-module__6JFh0G__price",
  "select": "Products-module__6JFh0G__select",
  "signInBtn": "Products-module__6JFh0G__signInBtn",
  "source": "Products-module__6JFh0G__source",
  "topBar": "Products-module__6JFh0G__topBar",
});
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/Products.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
var __N_SSG = true;
function Products(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(74);
    if ($[0] !== "6cf399da0ec889e99e2f84bc043d67c87aebe86203bd9fee58b2f9ba4d831cc8") {
        for(let $i = 0; $i < 74; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "6cf399da0ec889e99e2f84bc043d67c87aebe86203bd9fee58b2f9ba4d831cc8";
    }
    const { initialProducts, categories, brands } = t0;
    const { data: session } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useSession"])();
    const isAuth = !!session;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = [];
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(t1);
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [cat, setCat] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [brand, setBrand] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [showAdd, setShowAdd] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t2;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = {
            title: "",
            price: "",
            category: "",
            brand: "",
            description: "",
            thumbnail: ""
        };
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(t2);
    const [msg, setMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [useDB, setUseDB] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t3;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = ({
            "Products[flash]": (text)=>{
                setMsg(text);
                setTimeout({
                    "Products[flash > setTimeout()]": ()=>setMsg("")
                }["Products[flash > setTimeout()]"], 2500);
            }
        })["Products[flash]"];
        $[3] = t3;
    } else {
        t3 = $[3];
    }
    const flash = t3;
    let t4;
    let t5;
    if ($[4] !== initialProducts) {
        t4 = ({
            "Products[useEffect()]": ()=>{
                fetch("/api/products").then(_ProductsUseEffectAnonymous).then({
                    "Products[useEffect() > (anonymous)()]": (data)=>{
                        if (Array.isArray(data) && data.length > 0) {
                            setProducts(data);
                            setUseDB(true);
                        } else {
                            setProducts(initialProducts);
                        }
                    }
                }["Products[useEffect() > (anonymous)()]"]).catch({
                    "Products[useEffect() > (anonymous)()]": ()=>setProducts(initialProducts)
                }["Products[useEffect() > (anonymous)()]"]);
            }
        })["Products[useEffect()]"];
        t5 = [
            initialProducts
        ];
        $[4] = initialProducts;
        $[5] = t4;
        $[6] = t5;
    } else {
        t4 = $[5];
        t5 = $[6];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])(t4, t5);
    let allFiltered;
    let handleAdd;
    let t10;
    let t11;
    let t12;
    let t6;
    let t7;
    let t8;
    let t9;
    if ($[7] !== brand || $[8] !== brands || $[9] !== cat || $[10] !== categories || $[11] !== form || $[12] !== isAuth || $[13] !== msg || $[14] !== products || $[15] !== search || $[16] !== useDB) {
        let t13;
        if ($[26] !== brand || $[27] !== cat || $[28] !== search) {
            t13 = ({
                "Products[products.filter()]": (p)=>(p.title || "").toLowerCase().includes(search.toLowerCase()) && (cat ? p.category === cat : true) && (brand ? p.brand === brand : true)
            })["Products[products.filter()]"];
            $[26] = brand;
            $[27] = cat;
            $[28] = search;
            $[29] = t13;
        } else {
            t13 = $[29];
        }
        allFiltered = products.filter(t13);
        const filtered = isAuth ? allFiltered : allFiltered.slice(0, 4);
        let t14;
        if ($[30] !== form) {
            t14 = ({
                "Products[handleAdd]": async ()=>{
                    if (!form.title) {
                        return;
                    }
                    const res = await fetch("/api/products", {
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
                    setProducts({
                        "Products[handleAdd > setProducts()]": (prev)=>[
                                newP,
                                ...prev
                            ]
                    }["Products[handleAdd > setProducts()]"]);
                    setShowAdd(false);
                    setForm({
                        title: "",
                        price: "",
                        category: "",
                        brand: "",
                        description: "",
                        thumbnail: ""
                    });
                    flash("Product added!");
                }
            })["Products[handleAdd]"];
            $[30] = form;
            $[31] = t14;
        } else {
            t14 = $[31];
        }
        handleAdd = t14;
        let t15;
        if ($[32] === Symbol.for("react.memo_cache_sentinel")) {
            t15 = ({
                "Products[handleDelete]": async (id)=>{
                    if (!confirm("Delete this product?")) {
                        return;
                    }
                    await fetch(`/api/products/${id}`, {
                        method: "DELETE"
                    });
                    setProducts({
                        "Products[handleDelete > setProducts()]": (prev_0)=>prev_0.filter({
                                "Products[handleDelete > setProducts() > prev_0.filter()]": (p_0)=>(p_0._id || p_0.id) !== id
                            }["Products[handleDelete > setProducts() > prev_0.filter()]"])
                    }["Products[handleDelete > setProducts()]"]);
                    flash("Product deleted.");
                }
            })["Products[handleDelete]"];
            $[32] = t15;
        } else {
            t15 = $[32];
        }
        const handleDelete = t15;
        const getId = _ProductsGetId;
        t8 = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container;
        t9 = !isAuth && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].guestBanner,
            children: [
                "Showing 4 of ",
                allFiltered.length,
                " products.",
                " ",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/dashboard/login",
                    children: "Sign in"
                }, void 0, false, {
                    fileName: "[project]/src/pages/products/index.js",
                    lineNumber: 209,
                    columnNumber: 105
                }, this),
                " to view all & manage products."
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/products/index.js",
            lineNumber: 209,
            columnNumber: 21
        }, this);
        const t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
            children: [
                "Products ",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: filtered.length
                }, void 0, false, {
                    fileName: "[project]/src/pages/products/index.js",
                    lineNumber: 210,
                    columnNumber: 30
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/products/index.js",
            lineNumber: 210,
            columnNumber: 17
        }, this);
        const t17 = useDB ? "MongoDB \xB7 ISR 30s" : "DummyJSON fallback";
        let t18;
        if ($[33] !== t17) {
            t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].source,
                children: t17
            }, void 0, false, {
                fileName: "[project]/src/pages/products/index.js",
                lineNumber: 214,
                columnNumber: 13
            }, this);
            $[33] = t17;
            $[34] = t18;
        } else {
            t18 = $[34];
        }
        let t19;
        if ($[35] !== t16 || $[36] !== t18) {
            t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    t16,
                    t18
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/products/index.js",
                lineNumber: 222,
                columnNumber: 13
            }, this);
            $[35] = t16;
            $[36] = t18;
            $[37] = t19;
        } else {
            t19 = $[37];
        }
        let t20;
        if ($[38] !== isAuth) {
            t20 = isAuth && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].addBtn,
                onClick: {
                    "Products[<button>.onClick]": ()=>setShowAdd(true)
                }["Products[<button>.onClick]"],
                children: "+ Add"
            }, void 0, false, {
                fileName: "[project]/src/pages/products/index.js",
                lineNumber: 231,
                columnNumber: 23
            }, this);
            $[38] = isAuth;
            $[39] = t20;
        } else {
            t20 = $[39];
        }
        if ($[40] !== t19 || $[41] !== t20) {
            t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].topBar,
                children: [
                    t19,
                    t20
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/products/index.js",
                lineNumber: 240,
                columnNumber: 13
            }, this);
            $[40] = t19;
            $[41] = t20;
            $[42] = t10;
        } else {
            t10 = $[42];
        }
        if ($[43] !== msg) {
            t11 = msg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].msg,
                children: msg
            }, void 0, false, {
                fileName: "[project]/src/pages/products/index.js",
                lineNumber: 248,
                columnNumber: 20
            }, this);
            $[43] = msg;
            $[44] = t11;
        } else {
            t11 = $[44];
        }
        if ($[45] !== brand || $[46] !== brands || $[47] !== cat || $[48] !== categories || $[49] !== isAuth || $[50] !== search) {
            t12 = isAuth && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].filters,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].input,
                        placeholder: "Search...",
                        value: search,
                        onChange: {
                            "Products[<input>.onChange]": (e)=>setSearch(e.target.value)
                        }["Products[<input>.onChange]"]
                    }, void 0, false, {
                        fileName: "[project]/src/pages/products/index.js",
                        lineNumber: 255,
                        columnNumber: 55
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].select,
                        value: cat,
                        onChange: {
                            "Products[<select>.onChange]": (e_0)=>setCat(e_0.target.value)
                        }["Products[<select>.onChange]"],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "All Categories"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/products/index.js",
                                lineNumber: 259,
                                columnNumber: 43
                            }, this),
                            categories.map(_ProductsCategoriesMap)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/products/index.js",
                        lineNumber: 257,
                        columnNumber: 44
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].select,
                        value: brand,
                        onChange: {
                            "Products[<select>.onChange]": (e_1)=>setBrand(e_1.target.value)
                        }["Products[<select>.onChange]"],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "All Brands"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/products/index.js",
                                lineNumber: 261,
                                columnNumber: 43
                            }, this),
                            brands.map(_ProductsBrandsMap)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/products/index.js",
                        lineNumber: 259,
                        columnNumber: 132
                    }, this),
                    (search || cat || brand) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].clearBtn,
                        onClick: {
                            "Products[<button>.onClick]": ()=>{
                                setSearch("");
                                setCat("");
                                setBrand("");
                            }
                        }["Products[<button>.onClick]"],
                        children: "Clear"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/products/index.js",
                        lineNumber: 261,
                        columnNumber: 149
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/products/index.js",
                lineNumber: 255,
                columnNumber: 23
            }, this);
            $[45] = brand;
            $[46] = brands;
            $[47] = cat;
            $[48] = categories;
            $[49] = isAuth;
            $[50] = search;
            $[51] = t12;
        } else {
            t12 = $[51];
        }
        t6 = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].grid;
        let t21;
        if ($[52] !== isAuth) {
            t21 = ({
                "Products[filtered.map()]": (p_2)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].card,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                href: `/products/${getId(p_2)}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: p_2.thumbnail || "https://dummyjson.com/icon/dummyjson/128",
                                    alt: p_2.title,
                                    width: 200,
                                    height: 130,
                                    style: {
                                        width: "100%",
                                        height: "130px",
                                        objectFit: "cover"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/products/index.js",
                                    lineNumber: 282,
                                    columnNumber: 129
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/pages/products/index.js",
                                lineNumber: 282,
                                columnNumber: 90
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardBody,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cat,
                                        children: p_2.category
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products/index.js",
                                        lineNumber: 286,
                                        columnNumber: 58
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/products/${getId(p_2)}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].name,
                                            children: p_2.title
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products/index.js",
                                            lineNumber: 286,
                                            columnNumber: 147
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products/index.js",
                                        lineNumber: 286,
                                        columnNumber: 108
                                    }, this),
                                    p_2.brand && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].brand,
                                        children: p_2.brand
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products/index.js",
                                        lineNumber: 286,
                                        columnNumber: 210
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardFooter,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].price,
                                                children: [
                                                    "$",
                                                    p_2.price
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/products/index.js",
                                                lineNumber: 286,
                                                columnNumber: 289
                                            }, this),
                                            isAuth && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].delBtn,
                                                onClick: {
                                                    "Products[filtered.map() > <button>.onClick]": ()=>handleDelete(getId(p_2))
                                                }["Products[filtered.map() > <button>.onClick]"],
                                                children: "Delete"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products/index.js",
                                                lineNumber: 286,
                                                columnNumber: 350
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/products/index.js",
                                        lineNumber: 286,
                                        columnNumber: 254
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/products/index.js",
                                lineNumber: 286,
                                columnNumber: 25
                            }, this)
                        ]
                    }, getId(p_2), true, {
                        fileName: "[project]/src/pages/products/index.js",
                        lineNumber: 282,
                        columnNumber: 44
                    }, this)
            })["Products[filtered.map()]"];
            $[52] = isAuth;
            $[53] = t21;
        } else {
            t21 = $[53];
        }
        t7 = filtered.map(t21);
        $[7] = brand;
        $[8] = brands;
        $[9] = cat;
        $[10] = categories;
        $[11] = form;
        $[12] = isAuth;
        $[13] = msg;
        $[14] = products;
        $[15] = search;
        $[16] = useDB;
        $[17] = allFiltered;
        $[18] = handleAdd;
        $[19] = t10;
        $[20] = t11;
        $[21] = t12;
        $[22] = t6;
        $[23] = t7;
        $[24] = t8;
        $[25] = t9;
    } else {
        allFiltered = $[17];
        handleAdd = $[18];
        t10 = $[19];
        t11 = $[20];
        t12 = $[21];
        t6 = $[22];
        t7 = $[23];
        t8 = $[24];
        t9 = $[25];
    }
    let t13;
    if ($[54] !== t6 || $[55] !== t7) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t6,
            children: t7
        }, void 0, false, {
            fileName: "[project]/src/pages/products/index.js",
            lineNumber: 328,
            columnNumber: 11
        }, this);
        $[54] = t6;
        $[55] = t7;
        $[56] = t13;
    } else {
        t13 = $[56];
    }
    let t14;
    if ($[57] !== allFiltered || $[58] !== isAuth) {
        t14 = !isAuth && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].lockedBanner,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: [
                        "🔒 ",
                        allFiltered.length - 4,
                        " more products hidden"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/products/index.js",
                    lineNumber: 337,
                    columnNumber: 59
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/dashboard/login",
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].signInBtn,
                    children: "Sign in to unlock all"
                }, void 0, false, {
                    fileName: "[project]/src/pages/products/index.js",
                    lineNumber: 337,
                    columnNumber: 114
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/products/index.js",
            lineNumber: 337,
            columnNumber: 22
        }, this);
        $[57] = allFiltered;
        $[58] = isAuth;
        $[59] = t14;
    } else {
        t14 = $[59];
    }
    let t15;
    if ($[60] !== form || $[61] !== handleAdd || $[62] !== isAuth || $[63] !== showAdd) {
        t15 = showAdd && isAuth && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].overlay,
            onClick: {
                "Products[<div>.onClick]": ()=>setShowAdd(false)
            }["Products[<div>.onClick]"],
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].modal,
                onClick: _ProductsDivOnClick,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: "Add Product"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/products/index.js",
                        lineNumber: 348,
                        columnNumber: 95
                    }, this),
                    [
                        "title",
                        "price",
                        "category",
                        "brand",
                        "description",
                        "thumbnail"
                    ].map({
                        "Products[(anonymous)()]": (f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].modalInput,
                                placeholder: f.charAt(0).toUpperCase() + f.slice(1),
                                type: f === "price" ? "number" : "text",
                                value: form[f],
                                onChange: {
                                    "Products[(anonymous)() > <input>.onChange]": (e_3)=>setForm({
                                            ...form,
                                            [f]: e_3.target.value
                                        })
                                }["Products[(anonymous)() > <input>.onChange]"]
                            }, f, false, {
                                fileName: "[project]/src/pages/products/index.js",
                                lineNumber: 349,
                                columnNumber: 43
                            }, this)
                    }["Products[(anonymous)()]"]),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].modalBtns,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cancelBtn,
                                onClick: {
                                    "Products[<button>.onClick]": ()=>setShowAdd(false)
                                }["Products[<button>.onClick]"],
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/products/index.js",
                                lineNumber: 355,
                                columnNumber: 73
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].addBtn,
                                onClick: handleAdd,
                                children: "Add"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/products/index.js",
                                lineNumber: 357,
                                columnNumber: 59
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/products/index.js",
                        lineNumber: 355,
                        columnNumber: 39
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/products/index.js",
                lineNumber: 348,
                columnNumber: 35
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/pages/products/index.js",
            lineNumber: 346,
            columnNumber: 32
        }, this);
        $[60] = form;
        $[61] = handleAdd;
        $[62] = isAuth;
        $[63] = showAdd;
        $[64] = t15;
    } else {
        t15 = $[64];
    }
    let t16;
    if ($[65] !== t10 || $[66] !== t11 || $[67] !== t12 || $[68] !== t13 || $[69] !== t14 || $[70] !== t15 || $[71] !== t8 || $[72] !== t9) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t8,
            children: [
                t9,
                t10,
                t11,
                t12,
                t13,
                t14,
                t15
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/products/index.js",
            lineNumber: 368,
            columnNumber: 11
        }, this);
        $[65] = t10;
        $[66] = t11;
        $[67] = t12;
        $[68] = t13;
        $[69] = t14;
        $[70] = t15;
        $[71] = t8;
        $[72] = t9;
        $[73] = t16;
    } else {
        t16 = $[73];
    }
    return t16;
}
_s(Products, "zKC5VcoBhs6qMqSSzLqgWBrHRCU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useSession"]
    ];
});
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
        lineNumber: 387,
        columnNumber: 10
    }, this);
}
function _ProductsCategoriesMap(c) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
        value: c,
        children: c
    }, c, false, {
        fileName: "[project]/src/pages/products/index.js",
        lineNumber: 390,
        columnNumber: 10
    }, this);
}
function _ProductsGetId(p_1) {
    return p_1._id || p_1.id;
}
function _ProductsUseEffectAnonymous(r) {
    return r.json();
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

//# sourceMappingURL=%5Broot-of-the-server%5D__09n.3wq._.js.map