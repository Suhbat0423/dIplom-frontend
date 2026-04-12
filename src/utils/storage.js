// localStorage utilities - Safe for SSR
export const setStorageItem = (key, value) => {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        key,
        typeof value === "string" ? value : JSON.stringify(value),
      );
    }
  } catch (error) {
    console.error(`Error setting localStorage item ${key}:`, error);
  }
};

export const getStorageItem = (key) => {
  try {
    if (typeof window === "undefined") {
      return null;
    }
    const item = window.localStorage.getItem(key);
    return item
      ? item.startsWith("{") || item.startsWith("[")
        ? JSON.parse(item)
        : item
      : null;
  } catch (error) {
    console.error(`Error getting localStorage item ${key}:`, error);
    return null;
  }
};

export const removeStorageItem = (key) => {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
  } catch (error) {
    console.error(`Error removing localStorage item ${key}:`, error);
  }
};
