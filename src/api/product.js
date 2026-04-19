import { apiRequest } from "@/api/client";
import { API_ROUTES } from "@/api/config";

export const createProduct = async (token, productData) => {
  return apiRequest("product", API_ROUTES.product.create, {
    method: "POST",
    token,
    body: productData,
  });
};

export const getProducts = async (token, storeId) => {
  const query = storeId ? `?storeId=${encodeURIComponent(storeId)}` : "";

  return apiRequest("product", `${API_ROUTES.product.list}${query}`, {
    token,
  });
};

export const getProductById = async (token, productId) => {
  return apiRequest("product", API_ROUTES.product.detail(productId), {
    token,
  });
};

export const updateProduct = async (token, productId, productData) => {
  return apiRequest("product", API_ROUTES.product.detail(productId), {
    method: "PUT",
    token,
    body: productData,
  });
};

export const deleteProduct = async (token, productId) => {
  return apiRequest("product", API_ROUTES.product.detail(productId), {
    method: "DELETE",
    token,
  });
};

export const getProductsByStore = async (storeId, token) => {
  return apiRequest("product", API_ROUTES.product.byStore(storeId), {
    token,
  });
};
