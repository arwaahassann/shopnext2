self.__BUILD_MANIFEST = {
  "/": [
    "static/chunks/pages/index.js"
  ],
  "/news": [
    "static/chunks/pages/news.js"
  ],
  "/products": [
    "static/chunks/pages/products.js"
  ],
  "/products/[id]": [
    "static/chunks/pages/products/[id].js"
  ],
  "__rewrites": {
    "afterFiles": [],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/",
    "/404",
    "/_app",
    "/_error",
    "/news",
    "/products",
    "/products/[id]"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()