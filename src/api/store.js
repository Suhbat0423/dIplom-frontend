import { apiRequest } from "@/api/client";
import { API_ROUTES } from "@/api/config";

export const getStoreList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.stores)) return data.stores;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.stores)) return data.data.stores;
  if (Array.isArray(data?.data?.items)) return data.data.items;
  return [];
};

export const loginStore = (email, password) => {
  return apiRequest(API_ROUTES.store.login, {
    method: "POST",
    body: { email, password },
  });
};

export const registerStore = (name, email, password) => {
  return apiRequest(API_ROUTES.store.register, {
    method: "POST",
    body: { name, email, password },
  });
};

export const getStoreInfo = (storeId, token) => {
  return apiRequest(API_ROUTES.store.detail(storeId), { token });
};

export const getStoreById = (storeId) => {
  return apiRequest(API_ROUTES.store.detail(storeId));
};

export const updateStore = (storeId, token, storeData) => {
  return apiRequest(API_ROUTES.store.detail(storeId), {
    method: "PUT",
    token,
    body: storeData,
  });
};

export const requestStoreVerification = (storeId, token) => {
  return apiRequest(API_ROUTES.store.requestVerification(storeId), {
    method: "POST",
    token,
  });
};

export const getStores = () => {
  return apiRequest(API_ROUTES.store.list);
};
