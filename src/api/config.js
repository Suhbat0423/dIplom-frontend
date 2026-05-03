export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

export const API_ROUTES = {
  store: {
    list: "/stores",
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
  payment: {
    list: "/payments",
    byOrder: (orderId) => `/payments/order/${orderId}`,
    confirm: (paymentId) => `/payments/${paymentId}/confirm`,
    fail: (paymentId) => `/payments/${paymentId}/fail`,
    refund: (paymentId) => `/payments/${paymentId}/refund`,
  },
};
