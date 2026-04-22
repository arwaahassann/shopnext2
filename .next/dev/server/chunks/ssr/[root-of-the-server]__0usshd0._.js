module.exports = [
"[project]/src/styles/Products.module.css [ssr] (css module)", ((__turbopack_context__) => {

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
"[project]/src/pages/products/index.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>Products,
    "getStaticProps",
    ()=>getStaticProps
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$react__$5b$external$5d$__$28$next$2d$auth$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$next$2d$auth$29$__ = __turbopack_context__.i("[externals]/next-auth/react [external] (next-auth/react, esm_import, [project]/node_modules/next-auth)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/Products.module.css [ssr] (css module)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$react__$5b$external$5d$__$28$next$2d$auth$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$next$2d$auth$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$react__$5b$external$5d$__$28$next$2d$auth$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$next$2d$auth$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
async function getStaticProps() {
    try {
        const res = await fetch('https://dummyjson.com/products?limit=100&select=id,title,price,thumbnail,category,brand');
        const data = await res.json();
        const categories = [
            ...new Set(data.products.map((p)=>p.category))
        ];
        const brands = [
            ...new Set(data.products.map((p)=>p.brand).filter(Boolean))
        ];
        return {
            props: {
                initialProducts: data.products,
                categories,
                brands
            },
            revalidate: 30
        };
    } catch  {
        return {
            props: {
                initialProducts: [],
                categories: [],
                brands: []
            },
            revalidate: 30
        };
    }
}
function Products({ initialProducts, categories, brands }) {
    const { data: session } = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$react__$5b$external$5d$__$28$next$2d$auth$2f$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$next$2d$auth$29$__["useSession"])();
    const isAuth = !!session;
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [cat, setCat] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [brand, setBrand] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [showAdd, setShowAdd] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        title: '',
        price: '',
        category: '',
        brand: '',
        description: '',
        thumbnail: ''
    });
    const [msg, setMsg] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [useDB, setUseDB] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const flash = (text)=>{
        setMsg(text);
        setTimeout(()=>setMsg(''), 2500);
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        fetch('/api/products').then((r)=>r.json()).then((data)=>{
            if (Array.isArray(data) && data.length > 0) {
                setProducts(data);
                setUseDB(true);
            } else setProducts(initialProducts);
        }).catch(()=>setProducts(initialProducts));
    }, [
        initialProducts
    ]);
    const allFiltered = products.filter((p)=>(p.title || '').toLowerCase().includes(search.toLowerCase()) && (cat ? p.category === cat : true) && (brand ? p.brand === brand : true));
    const filtered = isAuth ? allFiltered : allFiltered.slice(0, 4);
    const handleAdd = async ()=>{
        if (!form.title) return;
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...form,
                price: parseFloat(form.price) || 0
            })
        });
        const newP = await res.json();
        setProducts((prev)=>[
                newP,
                ...prev
            ]);
        setShowAdd(false);
        setForm({
            title: '',
            price: '',
            category: '',
            brand: '',
            description: '',
            thumbnail: ''
        });
        flash('Product added!');
    };
    const handleDelete = async (id)=>{
        if (!confirm('Delete this product?')) return;
        await fetch(`/api/products/${id}`, {
            method: 'DELETE'
        });
        setProducts((prev)=>prev.filter((p)=>(p._id || p.id) !== id));
        flash('Product deleted.');
    };
    const getId = (p)=>p._id || p.id;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].container,
        children: [
            !isAuth && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].guestBanner,
                children: [
                    "Showing 4 of ",
                    allFiltered.length,
                    " products.",
                    ' ',
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/dashboard/login",
                        children: "Sign in"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/products/index.js",
                        lineNumber: 80,
                        columnNumber: 11
                    }, this),
                    " to view all & manage products."
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/products/index.js",
                lineNumber: 78,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].topBar,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                children: [
                                    "Products ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        children: filtered.length
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products/index.js",
                                        lineNumber: 86,
                                        columnNumber: 24
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/products/index.js",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].source,
                                children: useDB ? 'MongoDB · ISR 30s' : 'DummyJSON fallback'
                            }, void 0, false, {
                                fileName: "[project]/src/pages/products/index.js",
                                lineNumber: 87,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/products/index.js",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this),
                    isAuth && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].addBtn,
                        onClick: ()=>setShowAdd(true),
                        children: "+ Add"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/products/index.js",
                        lineNumber: 90,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/products/index.js",
                lineNumber: 84,
                columnNumber: 7
            }, this),
            msg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].msg,
                children: msg
            }, void 0, false, {
                fileName: "[project]/src/pages/products/index.js",
                lineNumber: 94,
                columnNumber: 15
            }, this),
            isAuth && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].filters,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].input,
                        placeholder: "Search...",
                        value: search,
                        onChange: (e)=>setSearch(e.target.value)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/products/index.js",
                        lineNumber: 98,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].select,
                        value: cat,
                        onChange: (e)=>setCat(e.target.value),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "All Categories"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/products/index.js",
                                lineNumber: 100,
                                columnNumber: 13
                            }, this),
                            categories.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                    value: c,
                                    children: c
                                }, c, false, {
                                    fileName: "[project]/src/pages/products/index.js",
                                    lineNumber: 101,
                                    columnNumber: 36
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/products/index.js",
                        lineNumber: 99,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].select,
                        value: brand,
                        onChange: (e)=>setBrand(e.target.value),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "All Brands"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/products/index.js",
                                lineNumber: 104,
                                columnNumber: 13
                            }, this),
                            brands.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                    value: b,
                                    children: b
                                }, b, false, {
                                    fileName: "[project]/src/pages/products/index.js",
                                    lineNumber: 105,
                                    columnNumber: 32
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/products/index.js",
                        lineNumber: 103,
                        columnNumber: 11
                    }, this),
                    (search || cat || brand) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].clearBtn,
                        onClick: ()=>{
                            setSearch('');
                            setCat('');
                            setBrand('');
                        },
                        children: "Clear"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/products/index.js",
                        lineNumber: 108,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/products/index.js",
                lineNumber: 97,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].grid,
                children: filtered.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].card,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: `/products/${getId(p)}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    src: p.thumbnail || 'https://dummyjson.com/icon/dummyjson/128',
                                    alt: p.title,
                                    width: 200,
                                    height: 130,
                                    style: {
                                        width: '100%',
                                        height: '130px',
                                        objectFit: 'cover'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/products/index.js",
                                    lineNumber: 117,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/pages/products/index.js",
                                lineNumber: 116,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].cardBody,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].cat,
                                        children: p.category
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products/index.js",
                                        lineNumber: 121,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/products/${getId(p)}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].name,
                                            children: p.title
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products/index.js",
                                            lineNumber: 122,
                                            columnNumber: 52
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products/index.js",
                                        lineNumber: 122,
                                        columnNumber: 15
                                    }, this),
                                    p.brand && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].brand,
                                        children: p.brand
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products/index.js",
                                        lineNumber: 123,
                                        columnNumber: 27
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].cardFooter,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].price,
                                                children: [
                                                    "$",
                                                    p.price
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/products/index.js",
                                                lineNumber: 125,
                                                columnNumber: 17
                                            }, this),
                                            isAuth && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].delBtn,
                                                onClick: ()=>handleDelete(getId(p)),
                                                children: "Delete"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products/index.js",
                                                lineNumber: 127,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/products/index.js",
                                        lineNumber: 124,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/products/index.js",
                                lineNumber: 120,
                                columnNumber: 13
                            }, this)
                        ]
                    }, getId(p), true, {
                        fileName: "[project]/src/pages/products/index.js",
                        lineNumber: 115,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/pages/products/index.js",
                lineNumber: 113,
                columnNumber: 7
            }, this),
            !isAuth && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].lockedBanner,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        children: [
                            "🔒 ",
                            allFiltered.length - 4,
                            " more products hidden"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/products/index.js",
                        lineNumber: 137,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/dashboard/login",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].signInBtn,
                        children: "Sign in to unlock all"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/products/index.js",
                        lineNumber: 138,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/products/index.js",
                lineNumber: 136,
                columnNumber: 9
            }, this),
            showAdd && isAuth && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].overlay,
                onClick: ()=>setShowAdd(false),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].modal,
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                            children: "Add Product"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/products/index.js",
                            lineNumber: 145,
                            columnNumber: 13
                        }, this),
                        [
                            'title',
                            'price',
                            'category',
                            'brand',
                            'description',
                            'thumbnail'
                        ].map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].modalInput,
                                placeholder: f.charAt(0).toUpperCase() + f.slice(1),
                                type: f === 'price' ? 'number' : 'text',
                                value: form[f],
                                onChange: (e)=>setForm({
                                        ...form,
                                        [f]: e.target.value
                                    })
                            }, f, false, {
                                fileName: "[project]/src/pages/products/index.js",
                                lineNumber: 147,
                                columnNumber: 15
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].modalBtns,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].cancelBtn,
                                    onClick: ()=>setShowAdd(false),
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/products/index.js",
                                    lineNumber: 152,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Products$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].addBtn,
                                    onClick: handleAdd,
                                    children: "Add"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/products/index.js",
                                    lineNumber: 153,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/products/index.js",
                            lineNumber: 151,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/products/index.js",
                    lineNumber: 144,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/pages/products/index.js",
                lineNumber: 143,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/products/index.js",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0usshd0._.js.map