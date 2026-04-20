export const API_BASE_URLS = {
  user: process.env.NEXT_PUBLIC_USER_API_URL || "http://localhost:3001",
  product: process.env.NEXT_PUBLIC_PRODUCT_API_URL || "http://localhost:3002",
  store: process.env.NEXT_PUBLIC_STORE_API_URL || "http://localhost:3003",
  cart: process.env.NEXT_PUBLIC_CART_API_URL || "http://localhost:3004",
  order: process.env.NEXT_PUBLIC_ORDER_API_URL || "http://localhost:3005",
};

export const API_ROUTES = {
  store: {
    login: "/stores/auth/login",
    register: "/stores/auth/register",
    detail: (storeId) => `/stores/${storeId}`,
    requestVerification: (storeId) => `/stores/${storeId}/verification`,
  },
  user: {
    list: "/users",
    login: "/auth/login",
    register: "/auth/register",
  },
  product: {
    list: "/products",
    create: "/products",
    byStore: (storeId) => `/products/store/${storeId}`,
    detail: (productId) => `/products/${productId}`,
  },
  cart: {
    detail: "/cart",
    items: "/cart/items",
    item: (itemId) => `/cart/items/${itemId}`,
  },
  order: {
    list: "/orders",
    my: "/orders/my",
    detail: (orderId) => `/orders/${orderId}`,
    byStore: (storeId) => `/orders/store/${storeId}`,
    status: (orderId) => `/orders/${orderId}/status`,
  },
};
