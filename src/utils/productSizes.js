import { PRODUCT_SIZES } from "@/config/constants";

export const normalizeProductSize = (size) => String(size || "").trim().toUpperCase();

export const isSupportedProductSize = (size) => {
  return PRODUCT_SIZES.includes(normalizeProductSize(size));
};

export const normalizeProductSizes = (sizes) => {
  if (!Array.isArray(sizes)) return [];

  return Array.from(
    new Set(
      sizes
        .map(normalizeProductSize)
        .filter((size) => PRODUCT_SIZES.includes(size)),
    ),
  );
};

export const toggleProductSize = (sizes, size) => {
  const normalizedSize = normalizeProductSize(size);
  const currentSizes = normalizeProductSizes(sizes);

  if (!PRODUCT_SIZES.includes(normalizedSize)) {
    return currentSizes;
  }

  if (currentSizes.includes(normalizedSize)) {
    return currentSizes.filter((item) => item !== normalizedSize);
  }

  return [...currentSizes, normalizedSize];
};

export const normalizeSizeStock = (sizeStock, sizes = []) => {
  const selectedSizes = normalizeProductSizes(sizes);
  const source = sizeStock || {};

  return selectedSizes.reduce((stockMap, size) => {
    const rawValue = source[size] ?? source[size.toLowerCase()] ?? 0;
    const nextValue = Number(rawValue);

    return {
      ...stockMap,
      [size]: Number.isFinite(nextValue) && nextValue > 0 ? Math.floor(nextValue) : 0,
    };
  }, {});
};

export const getProductSizeStock = (product) => {
  const sizes = normalizeProductSizes(product?.sizes);
  const rawSizeStock =
    product?.sizeStock ||
    product?.sizeStocks ||
    product?.stockBySize ||
    product?.metadata?.sizeStock ||
    {};

  return normalizeSizeStock(rawSizeStock, sizes);
};

export const getTotalSizeStock = (sizeStock) => {
  return Object.values(sizeStock || {}).reduce(
    (sum, quantity) => sum + Math.max(0, Number(quantity || 0)),
    0,
  );
};
