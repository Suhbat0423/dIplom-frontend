export const API_BASE_URLS = {
  user: process.env.NEXT_PUBLIC_USER_API_URL || "http://localhost:3001",
  product: process.env.NEXT_PUBLIC_PRODUCT_API_URL || "http://localhost:3002",
  store: process.env.NEXT_PUBLIC_STORE_API_URL || "http://localhost:3003",
};

export const API_ROUTES = {
  store: {
    login: "/stores/auth/login",
    register: "/stores/auth/register",
    detail: (storeId) => `/stores/${storeId}`,
  },
  user: {
    list: "/users",
    login: "/users/auth/login",
    register: "/users/auth/register",
  },
  product: {
    list: "/products",
    create: "/products/create",
    detail: (productId) => `/products/${productId}`,
  },
};
