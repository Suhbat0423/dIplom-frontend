import { useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "@/config/constants";
import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from "@/utils/storage";

const AUTH_STORAGE_EVENT = "auth-storage";

const getTokenSnapshot = () => {
  return getStorageItem(STORAGE_KEYS.TOKEN) || null;
};

const getServerSnapshot = () => null;

const subscribeToAuthStorage = (callback) => {
  window.addEventListener("storage", callback);
  window.addEventListener(AUTH_STORAGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(AUTH_STORAGE_EVENT, callback);
  };
};

const emitAuthStorageChange = () => {
  window.dispatchEvent(new Event(AUTH_STORAGE_EVENT));
};

export const useAuth = () => {
  const token = useSyncExternalStore(
    subscribeToAuthStorage,
    getTokenSnapshot,
    getServerSnapshot,
  );

  const login = (authToken) => {
    if (typeof window !== "undefined") {
      setStorageItem(STORAGE_KEYS.TOKEN, authToken);
      emitAuthStorageChange();
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      removeStorageItem(STORAGE_KEYS.TOKEN);
      emitAuthStorageChange();
    }
  };

  const isAuthenticated = !!token;

  return { token, loading: false, login, logout, isAuthenticated };
};
