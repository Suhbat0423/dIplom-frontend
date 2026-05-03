import { AUTH_ROLES, STORAGE_KEYS } from "@/config/constants";
import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from "@/utils/storage";

const JWT_PARTS = 3;

const ROLE_ALIASES = {
  user: AUTH_ROLES.USER,
  buyer: AUTH_ROLES.USER,
  customer: AUTH_ROLES.USER,
  shopper: AUTH_ROLES.USER,
  client: AUTH_ROLES.USER,
  normal_user: AUTH_ROLES.USER,
  normal: AUTH_ROLES.USER,
  shop: AUTH_ROLES.SHOP,
  store: AUTH_ROLES.SHOP,
  seller: AUTH_ROLES.SHOP,
  vendor: AUTH_ROLES.SHOP,
  merchant: AUTH_ROLES.SHOP,
  owner: AUTH_ROLES.SHOP,
  admin: AUTH_ROLES.SHOP,
  store_owner: AUTH_ROLES.SHOP,
  shop_owner: AUTH_ROLES.SHOP,
};

const decodeBase64Url = (value) => {
  if (!value || typeof window === "undefined") return null;

  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

  try {
    return window.atob(padded);
  } catch {
    return null;
  }
};

export const decodeJwtPayload = (token) => {
  if (typeof token !== "string") return null;

  const parts = token.split(".");

  if (parts.length !== JWT_PARTS) {
    return null;
  }

  const payload = decodeBase64Url(parts[1]);

  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(payload);
  } catch {
    return null;
  }
};

export const normalizeAuthRole = (value) => {
  if (!value || typeof value !== "string") return null;

  const normalized = value.trim().toLowerCase().replace(/[\s-]+/g, "_");

  return ROLE_ALIASES[normalized] || null;
};

const getRoleFromPayload = (payload) => {
  return normalizeAuthRole(
    payload?.role ||
      payload?.userRole ||
      payload?.user_type ||
      payload?.accountType ||
      payload?.account_type ||
      payload?.type,
  );
};

const getRoleFromResponse = (data) => {
  return normalizeAuthRole(
    data?.role ||
      data?.user?.role ||
      data?.customer?.role ||
      data?.buyer?.role ||
      data?.store?.role ||
      data?.shop?.role ||
      data?.account?.role,
  );
};

const getStoreEntity = (data) => {
  return data?.store || data?.shop || data?.account || null;
};

const getUserEntity = (data) => {
  return data?.user || data?.customer || data?.buyer || data?.account || null;
};

export const getStoreId = (store) => {
  return store?._id || store?.id || store?.storeId || null;
};

const getSubjectId = ({ payload, role, user, store }) => {
  if (role === AUTH_ROLES.SHOP) {
    return getStoreId(store) || payload?.storeId || payload?.sub || null;
  }

  return user?._id || user?.id || payload?.userId || payload?.sub || null;
};

const getSessionExpiry = (payload) => {
  return Number.isFinite(payload?.exp) ? Number(payload.exp) * 1000 : null;
};

export const isSessionExpired = (session) => {
  return Boolean(session?.expiresAt && session.expiresAt <= Date.now());
};

const buildSessionObject = ({
  token,
  role,
  tokenPayload,
  user = null,
  store = null,
}) => {
  const shopStoreId =
    role === AUTH_ROLES.SHOP
      ? getStoreId(store) || tokenPayload?.storeId || tokenPayload?.sub || null
      : null;

  return {
    token,
    role,
    tokenPayload,
    expiresAt: getSessionExpiry(tokenPayload),
    user,
    store,
    storeId: shopStoreId,
    subjectId: getSubjectId({ payload: tokenPayload, role, user, store }),
  };
};

export const createAuthSession = ({ token, expectedRole, data }) => {
  if (!token || typeof token !== "string") {
    throw new Error("Missing authentication token.");
  }

  const tokenPayload = decodeJwtPayload(token);
  const normalizedExpectedRole = normalizeAuthRole(expectedRole);
  const responseRole = getRoleFromResponse(data);
  const tokenRole = getRoleFromPayload(tokenPayload);

  if (responseRole && tokenRole && responseRole !== tokenRole) {
    throw new Error("Authentication role mismatch. Please sign in again.");
  }

  const role = responseRole || tokenRole || normalizedExpectedRole;

  if (!role) {
    throw new Error("Unable to determine account role.");
  }

  if (normalizedExpectedRole && role !== normalizedExpectedRole) {
    throw new Error("This account cannot sign in from this portal.");
  }

  const user = role === AUTH_ROLES.USER ? getUserEntity(data) : null;
  const store = role === AUTH_ROLES.SHOP ? getStoreEntity(data) : null;
  const session = buildSessionObject({
    token,
    role,
    tokenPayload,
    user,
    store,
  });

  if (isSessionExpired(session)) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  return session;
};

const clearLegacyToken = () => {
  removeStorageItem(STORAGE_KEYS.TOKEN);
};

export const clearAuthStorage = (role = null) => {
  const normalizedRole = normalizeAuthRole(role);
  const currentSession = getStorageItem(STORAGE_KEYS.AUTH_SESSION);
  const currentRole = normalizeAuthRole(currentSession?.role);

  clearLegacyToken();

  if (!normalizedRole) {
    removeStorageItem(STORAGE_KEYS.AUTH_SESSION);
    removeStorageItem(STORAGE_KEYS.USER_TOKEN);
    removeStorageItem(STORAGE_KEYS.SHOP_TOKEN);
    removeStorageItem(STORAGE_KEYS.USER);
    removeStorageItem(STORAGE_KEYS.STORE);
    return;
  }

  if (!currentRole || currentRole === normalizedRole) {
    removeStorageItem(STORAGE_KEYS.AUTH_SESSION);
  }

  if (normalizedRole === AUTH_ROLES.USER) {
    removeStorageItem(STORAGE_KEYS.USER_TOKEN);
    removeStorageItem(STORAGE_KEYS.USER);
    return;
  }

  removeStorageItem(STORAGE_KEYS.SHOP_TOKEN);
  removeStorageItem(STORAGE_KEYS.STORE);
};

export const persistAuthSession = (session) => {
  clearAuthStorage();

  setStorageItem(STORAGE_KEYS.AUTH_SESSION, session);

  if (session.role === AUTH_ROLES.USER) {
    setStorageItem(STORAGE_KEYS.USER_TOKEN, session.token);

    if (session.user) {
      setStorageItem(STORAGE_KEYS.USER, session.user);
    }

    return;
  }

  setStorageItem(STORAGE_KEYS.SHOP_TOKEN, session.token);

  if (session.store) {
    setStorageItem(STORAGE_KEYS.STORE, session.store);
  }
};

const getFallbackStoredSession = () => {
  const userToken = getStorageItem(STORAGE_KEYS.USER_TOKEN);

  if (userToken) {
    return buildSessionObject({
      token: userToken,
      role: AUTH_ROLES.USER,
      tokenPayload: decodeJwtPayload(userToken),
      user: getStorageItem(STORAGE_KEYS.USER),
    });
  }

  const shopToken = getStorageItem(STORAGE_KEYS.SHOP_TOKEN);

  if (shopToken) {
    return buildSessionObject({
      token: shopToken,
      role: AUTH_ROLES.SHOP,
      tokenPayload: decodeJwtPayload(shopToken),
      store: getStorageItem(STORAGE_KEYS.STORE),
    });
  }

  clearLegacyToken();
  return null;
};

export const getStoredAuthSession = () => {
  const storedSession = getStorageItem(STORAGE_KEYS.AUTH_SESSION) || getFallbackStoredSession();

  if (!storedSession?.token) {
    clearAuthStorage();
    return null;
  }

  const role =
    normalizeAuthRole(storedSession.role) ||
    getRoleFromPayload(storedSession.tokenPayload) ||
    (storedSession.store || storedSession.storeId ? AUTH_ROLES.SHOP : AUTH_ROLES.USER);

  if (!role) {
    clearAuthStorage();
    return null;
  }

  const session = buildSessionObject({
    token: storedSession.token,
    role,
    tokenPayload: storedSession.tokenPayload || decodeJwtPayload(storedSession.token),
    user: storedSession.user || null,
    store: storedSession.store || null,
  });

  if (isSessionExpired(session)) {
    clearAuthStorage();
    return null;
  }

  return session;
};

export const getDefaultRedirectForRole = (session) => {
  if (session?.role === AUTH_ROLES.SHOP) {
    return "/shop/dashboard";
  }

  return "/user/profile";
};

export const getShopDashboardPath = (session) => {
  if (session?.role !== AUTH_ROLES.SHOP) {
    return "";
  }

  const resolvedStoreId = session.storeId || session.subjectId || null;

  if (!resolvedStoreId) {
    return "";
  }

  return `/shop/${resolvedStoreId}`;
};

export const getUserProfilePath = () => "/user/profile";

export const sanitizeNextPath = (value) => {
  if (!value || typeof value !== "string") return "";
  if (!value.startsWith("/")) return "";
  if (value.startsWith("//")) return "";

  return value;
};

export const getLoginPathForRole = (role, nextPath = "") => {
  const basePath = role === AUTH_ROLES.SHOP ? "/shop" : "/user";
  const safeNextPath = sanitizeNextPath(nextPath);

  if (!safeNextPath) {
    return basePath;
  }

  return `${basePath}?next=${encodeURIComponent(safeNextPath)}`;
};

export const getPostLoginRedirect = (session, nextPath = "") => {
  const safeNextPath = sanitizeNextPath(nextPath);

  return safeNextPath || getDefaultRedirectForRole(session);
};
