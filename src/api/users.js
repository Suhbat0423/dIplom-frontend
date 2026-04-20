import { apiRequest } from "@/api/client";
import { API_ROUTES } from "@/api/config";

export const getUsers = () => {
  return apiRequest("user", API_ROUTES.user.list);
};

export const loginUser = (email, password) => {
  return apiRequest("user", API_ROUTES.user.login, {
    method: "POST",
    body: { email, password },
  });
};

export const registerUser = (username, email, password) => {
  return apiRequest("user", API_ROUTES.user.register, {
    method: "POST",
    body: { username, email, password, role: "buyer" },
  });
};
