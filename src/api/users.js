import { apiRequest } from "@/api/client";
import { API_ROUTES } from "@/api/config";

export const getUsers = () => {
  return apiRequest("user", API_ROUTES.user.list);
};
