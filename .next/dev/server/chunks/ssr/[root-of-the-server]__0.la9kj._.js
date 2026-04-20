module.exports = [
"[project]/src/pages/products/[id].js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductDetail,
    "getStaticPaths",
    ()=>getStaticPaths,
    "getStaticProps",
    ()=>getStaticProps
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [ssr] (ecmascript)");
;
;
;
;
async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking'
    };
}
async function getStaticProps({ params }) {
    try {
        const res = await fetch(`https://dummyjson.com/products/${params.id}`);
        if (!res.ok) return {
            notFound: true
        };
        const product = await res.json();
        return {
            props: {
                product
            }
        };
    } catch  {
        return {
            notFound: true
        };
    }
}
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
function ProductDetail({ product }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [editing, setEditing] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        title: product.title,
        price: product.price,
        description: product.description
    });
    const [toast, setToast] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const showToast = (msg)=>{
        setToast(msg);
        setTimeout(()=>setToast(''), 2500);
    };
    const handleUpdate = async ()=>{
        await fetch(`https://dummyjson.com/products/${product.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...form,
                price: parseFloat(form.price)
            })
        });
        setEditing(false);
        showToast('Product updated!');
    };
    const handleDelete = async ()=>{
        if (!confirm('Delete this product?')) return;
        await fetch(`https://dummyjson.com/products/${product.id}`, {
            method: 'DELETE'
        });
        router.push('/products');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            maxWidth: 900,
            margin: '0 auto',
            padding: '32px 24px'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                onClick: ()=>router.push('/products'),
                style: {
                    background: 'none',
                    border: '1px solid #e0e0e0',
                    borderRadius: 8,
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '0.85rem',
                    color: '#666',
                    marginBottom: 24
                },
                children: "← Back"
            }, void 0, false, {
                fileName: "[project]/src/pages/products/[id].js",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            toast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    background: '#e8f5e9',
                    border: '1px solid #a5d6a7',
                    color: '#2e7d32',
                    padding: '10px 16px',
                    borderRadius: 8,
                    marginBottom: 20,
                    fontSize: '0.88rem'
                },
                children: toast
            }, void 0, false, {
                fileName: "[project]/src/pages/products/[id].js",
                lineNumber: 67,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 32,
                    background: '#fff',
                    borderRadius: 16,
                    border: '1px solid #e8e8e8',
                    padding: 32
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                src: product.thumbnail,
                                alt: product.title,
                                width: 400,
                                height: 340,
                                style: {
                                    width: '100%',
                                    height: 340,
                                    objectFit: 'contain',
                                    borderRadius: 12,
                                    background: '#f5f7fa'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/pages/products/[id].js",
                                lineNumber: 75,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: 12,
                                    marginTop: 16
                                },
                                children: [
                                    [
                                        '⭐ Rating',
                                        product.rating
                                    ],
                                    [
                                        '📦 Stock',
                                        product.stock
                                    ],
                                    [
                                        '🏷️ Discount',
                                        `${product.discountPercentage}%`
                                    ]
                                ].map(([label, val])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1,
                                            background: '#f5f7fa',
                                            borderRadius: 10,
                                            padding: '10px 8px',
                                            textAlign: 'center'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: '0.72rem',
                                                    color: '#999',
                                                    marginBottom: 2
                                                },
                                                children: label
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products/[id].js",
                                                lineNumber: 80,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontWeight: 700,
                                                    fontSize: '0.9rem'
                                                },
                                                children: val
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products/[id].js",
                                                lineNumber: 81,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, label, true, {
                                        fileName: "[project]/src/pages/products/[id].js",
                                        lineNumber: 79,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/products/[id].js",
                                lineNumber: 77,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/products/[id].js",
                        lineNumber: 74,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: 8,
                                    flexWrap: 'wrap'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        style: {
                                            background: '#eef0ff',
                                            color: '#4f6ef7',
                                            borderRadius: 999,
                                            padding: '3px 12px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600
                                        },
                                        children: product.category
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products/[id].js",
                                        lineNumber: 90,
                                        columnNumber: 13
                                    }, this),
                                    product.brand && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        style: {
                                            background: '#f5f5f5',
                                            color: '#666',
                                            borderRadius: 999,
                                            padding: '3px 12px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600
                                        },
                                        children: product.brand
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products/[id].js",
                                        lineNumber: 91,
                                        columnNumber: 31
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/products/[id].js",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this),
                            editing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        style: {
                                            fontSize: '0.78rem',
                                            color: '#999',
                                            fontWeight: 600
                                        },
                                        children: "Title"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products/[id].js",
                                        lineNumber: 96,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        style: inputStyle,
                                        value: form.title,
                                        onChange: (e)=>setForm({
                                                ...form,
                                                title: e.target.value
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products/[id].js",
                                        lineNumber: 97,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        style: {
                                            fontSize: '0.78rem',
                                            color: '#999',
                                            fontWeight: 600
                                        },
                                        children: "Price ($)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products/[id].js",
                                        lineNumber: 98,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        style: inputStyle,
                                        type: "number",
                                        value: form.price,
                                        onChange: (e)=>setForm({
                                                ...form,
                                                price: e.target.value
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products/[id].js",
                                        lineNumber: 99,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        style: {
                                            fontSize: '0.78rem',
                                            color: '#999',
                                            fontWeight: 600
                                        },
                                        children: "Description"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products/[id].js",
                                        lineNumber: 100,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                        style: {
                                            ...inputStyle,
                                            minHeight: 90,
                                            resize: 'vertical'
                                        },
                                        value: form.description,
                                        onChange: (e)=>setForm({
                                                ...form,
                                                description: e.target.value
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products/[id].js",
                                        lineNumber: 101,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            gap: 8,
                                            marginTop: 4
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: handleUpdate,
                                                style: {
                                                    flex: 1,
                                                    padding: '10px',
                                                    borderRadius: 8,
                                                    border: 'none',
                                                    background: '#4f6ef7',
                                                    color: '#fff',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    fontFamily: 'Poppins, sans-serif'
                                                },
                                                children: "Save"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products/[id].js",
                                                lineNumber: 103,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setEditing(false),
                                                style: {
                                                    flex: 1,
                                                    padding: '10px',
                                                    borderRadius: 8,
                                                    border: '1px solid #e0e0e0',
                                                    background: '#fff',
                                                    color: '#666',
                                                    cursor: 'pointer',
                                                    fontFamily: 'Poppins, sans-serif'
                                                },
                                                children: "Cancel"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products/[id].js",
                                                lineNumber: 104,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/products/[id].js",
                                        lineNumber: 102,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                        style: {
                                            fontSize: '1.5rem',
                                            fontWeight: 700,
                                            lineHeight: 1.3,
                                            color: '#222'
                                        },
                                        children: form.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products/[id].js",
                                        lineNumber: 109,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: '1.8rem',
                                            fontWeight: 700,
                                            color: '#4f6ef7'
                                        },
                                        children: [
                                            "$",
                                            form.price
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/products/[id].js",
                                        lineNumber: 110,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: '#777',
                                            fontSize: '0.9rem',
                                            lineHeight: 1.7
                                        },
                                        children: form.description
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products/[id].js",
                                        lineNumber: 111,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            gap: 10,
                                            marginTop: 'auto',
                                            paddingTop: 12
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setEditing(true),
                                                style: {
                                                    flex: 1,
                                                    padding: '11px',
                                                    borderRadius: 8,
                                                    border: 'none',
                                                    background: '#4f6ef7',
                                                    color: '#fff',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    fontFamily: 'Poppins, sans-serif'
                                                },
                                                children: "Edit"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products/[id].js",
                                                lineNumber: 113,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: handleDelete,
                                                style: {
                                                    flex: 1,
                                                    padding: '11px',
                                                    borderRadius: 8,
                                                    border: '1px solid #ffcdd2',
                                                    background: '#fff0f0',
                                                    color: '#e53935',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    fontFamily: 'Poppins, sans-serif'
                                                },
                                                children: "Delete"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products/[id].js",
                                                lineNumber: 114,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/products/[id].js",
                                        lineNumber: 112,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/products/[id].js",
                        lineNumber: 88,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/products/[id].js",
                lineNumber: 72,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/products/[id].js",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0.la9kj._.js.map