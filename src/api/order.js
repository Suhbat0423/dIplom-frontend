import { apiRequest } from "@/api/client";
import { API_ROUTES } from "@/api/config";

export const createOrder = (token, payload) => {
  return apiRequest(API_ROUTES.order.list, {
    method: "POST",
    token,
    body: payload,
  });
};

export const getOrders = (token) => {
  return apiRequest(API_ROUTES.order.list, { token });
};

export const getMyOrders = (token) => {
  return apiRequest(API_ROUTES.order.my, { token });
};

export const getOrderById = (token, orderId) => {
  return apiRequest(API_ROUTES.order.detail(orderId), { token });
};

export const getStoreOrders = (token, storeId) => {
  return apiRequest(API_ROUTES.order.byStore(storeId), { token });
};

export const updateOrderStatus = (token, orderId, payload) => {
  return apiRequest(API_ROUTES.order.status(orderId), {
    method: "PUT",
    token,
    body: payload,
  });
};
