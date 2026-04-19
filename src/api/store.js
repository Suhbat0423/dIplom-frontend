import { apiRequest } from "@/api/client";
import { API_ROUTES } from "@/api/config";

const STORE_LIST_URL =
  process.env.STORE_LIST_URL || "http://0.0.0.0:3003/stores";

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

export const getStoreById = (storeId) => {
  return apiRequest("store", API_ROUTES.store.detail(storeId));
};

export const updateStore = (storeId, token, storeData) => {
  return apiRequest("store", API_ROUTES.store.detail(storeId), {
    method: "PUT",
    token,
    body: storeData,
  });
};

export const getStores = async () => {
  try {
    const response = await fetch(STORE_LIST_URL, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        message: data?.message || "Failed to fetch stores",
        data,
      };
    }

    return { success: true, status: response.status, data };
  } catch (error) {
    return {
      success: false,
      message: error?.message || "Failed to fetch stores",
      data: [],
    };
  }
};
