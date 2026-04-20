module.exports = [
"[project]/src/styles/News.module.css [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "card": "News-module__RrVBwa__card",
  "cardBody": "News-module__RrVBwa__cardBody",
  "container": "News-module__RrVBwa__container",
  "grid": "News-module__RrVBwa__grid",
  "meta": "News-module__RrVBwa__meta",
  "slideIn": "News-module__RrVBwa__slideIn",
  "tag": "News-module__RrVBwa__tag",
  "tags": "News-module__RrVBwa__tags",
  "title": "News-module__RrVBwa__title",
  "toast": "News-module__RrVBwa__toast",
});
}),
"[project]/src/pages/news/index.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>News,
    "getServerSideProps",
    ()=>getServerSideProps
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$News$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/News.module.css [ssr] (css module)");
;
;
;
const TOASTS = [
    "🔥 Breaking: New products just dropped!",
    "📦 Free shipping on orders over $50",
    "⚡ Flash sale: 20% off electronics today",
    "🎉 500 new users joined this week!"
];
async function getServerSideProps() {
    const res = await fetch("https://dummyjson.com/posts?limit=12");
    const data = await res.json();
    const toast = TOASTS[Math.floor(Math.random() * TOASTS.length)];
    return {
        props: {
            posts: data.posts,
            toast
        }
    };
}
function News({ posts, toast }) {
    const [showToast, setShowToast] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const t = setTimeout(()=>setShowToast(true), 100);
        const hide = setTimeout(()=>setShowToast(false), 4100);
        return ()=>{
            clearTimeout(t);
            clearTimeout(hide);
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$News$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].container,
        children: [
            showToast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$News$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].toast,
                children: toast
            }, void 0, false, {
                fileName: "[project]/src/pages/news/index.js",
                lineNumber: 32,
                columnNumber: 21
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$News$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].title,
                children: [
                    "News ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        children: "SSR · fresh on every request"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/news/index.js",
                        lineNumber: 34,
                        columnNumber: 14
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/news/index.js",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$News$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].grid,
                children: posts.map((post)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$News$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].card,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$News$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].cardBody,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$News$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tags,
                                    children: post.tags?.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$News$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tag,
                                            children: t
                                        }, t, false, {
                                            fileName: "[project]/src/pages/news/index.js",
                                            lineNumber: 42,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/news/index.js",
                                    lineNumber: 40,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                    children: post.title
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/news/index.js",
                                    lineNumber: 47,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    children: [
                                        post.body?.slice(0, 120),
                                        "..."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/news/index.js",
                                    lineNumber: 48,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$News$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].meta,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            children: [
                                                "👍 ",
                                                post.reactions?.likes
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/news/index.js",
                                            lineNumber: 50,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            children: [
                                                "👀 ",
                                                post.views,
                                                " views"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/news/index.js",
                                            lineNumber: 51,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/news/index.js",
                                    lineNumber: 49,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/news/index.js",
                            lineNumber: 39,
                            columnNumber: 13
                        }, this)
                    }, post.id, false, {
                        fileName: "[project]/src/pages/news/index.js",
                        lineNumber: 38,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/pages/news/index.js",
                lineNumber: 36,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/news/index.js",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0.z.-nu._.js.map