import { apiRequest } from "@/api/client";
import { API_ROUTES } from "@/api/config";

export const getCart = (token) => {
  return apiRequest("cart", API_ROUTES.cart.detail, { token });
};

export const addCartItem = (token, item) => {
  return apiRequest("cart", API_ROUTES.cart.items, {
    method: "POST",
    token,
    body: item,
  });
};

export const updateCartItem = (token, itemId, quantity) => {
  return apiRequest("cart", API_ROUTES.cart.item(itemId), {
    method: "PUT",
    token,
    body: { quantity },
  });
};

export const deleteCartItem = (token, itemId) => {
  return apiRequest("cart", API_ROUTES.cart.item(itemId), {
    method: "DELETE",
    token,
  });
};

export const clearCart = (token) => {
  return apiRequest("cart", API_ROUTES.cart.detail, {
    method: "DELETE",
    token,
  });
};
