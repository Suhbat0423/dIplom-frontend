const allowedImageHosts = new Set(["images.unsplash.com"]);

export const isAllowedImageSrc = (src) => {
  if (!src || typeof src !== "string") return false;
  if (src.startsWith("/")) return true;

  try {
    const url = new URL(src);
    return url.protocol === "https:" && allowedImageHosts.has(url.hostname);
  } catch {
    return false;
  }
};

export const getSafeImageSrc = (src, fallback) => {
  return isAllowedImageSrc(src) ? src : fallback;
};
