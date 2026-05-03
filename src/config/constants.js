export const STORAGE_KEYS = {
  AUTH_SESSION: "auth.session",
  USER_TOKEN: "auth.user.token",
  SHOP_TOKEN: "auth.shop.token",
  TOKEN: "token",
  USER: "user",
  STORE: "store",
};

export const AUTH_ROLES = {
  USER: "user",
  SHOP: "shop",
};

export const PRODUCT_SIZES = ["XS", "S", "SM", "M", "MD", "L", "LG", "XL", "XXL"];

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

export const PAYMENT_STATUSES = ["unpaid", "paid", "failed", "refunded"];
