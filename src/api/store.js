import { apiRequest } from "@/api/client";
import { API_ROUTES } from "@/api/config";

export const loginStore = (email, password) => {
  return apiRequest("store", API_ROUTES.store.login, {
    method: "POST",
    body: { email, password },
  });
};

export const registerStore = (name, email, password) => {
  return apiRequest("store", API_ROUTES.store.register, {
    method: "POST",
    body: { name, email, password },
  });
};

export const getStoreInfo = (storeId, token) => {
  return apiRequest("store", API_ROUTES.store.detail(storeId), { token });
};
