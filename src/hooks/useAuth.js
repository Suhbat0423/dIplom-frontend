import { useCallback, useSyncExternalStore } from "react";
import { AUTH_ROLES } from "@/config/constants";
import {
  clearAuthStorage,
  createAuthSession,
  getStoredAuthSession,
  persistAuthSession,
} from "@/utils/auth";

const AUTH_STORAGE_EVENT = "auth-storage";
let cachedSession = null;

const isSameSession = (left, right) => {
  if (left === right) return true;
  if (!left || !right) return false;

  return (
    left.token === right.token &&
    left.role === right.role &&
    left.storeId === right.storeId &&
    left.subjectId === right.subjectId &&
    left.expiresAt === right.expiresAt
  );
};

const getSessionSnapshot = () => {
  const nextSession = getStoredAuthSession();

  if (isSameSession(cachedSession, nextSession)) {
    return cachedSession;
  }

  cachedSession = nextSession;
  return cachedSession;
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
  const session = useSyncExternalStore(
    subscribeToAuthStorage,
    getSessionSnapshot,
    getServerSnapshot,
  );

  const login = useCallback(({ token, expectedRole, data }) => {
    const nextSession = createAuthSession({ token, expectedRole, data });

    persistAuthSession(nextSession);
    cachedSession = nextSession;
    emitAuthStorageChange();

    return nextSession;
  }, []);

  const logout = useCallback((role = null) => {
    clearAuthStorage(role);
    cachedSession = null;
    emitAuthStorageChange();
  }, []);

  const token = session?.token || null;
  const role = session?.role || null;
  const user = session?.user || null;
  const store = session?.store || null;
  const storeId = session?.storeId || null;
  const isAuthenticated = Boolean(token);

  return {
    session,
    token,
    role,
    user,
    store,
    storeId,
    loading: false,
    login,
    logout,
    isAuthenticated,
    isUser: role === AUTH_ROLES.USER,
    isShop: role === AUTH_ROLES.SHOP,
  };
};
