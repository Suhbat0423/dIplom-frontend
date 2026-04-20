const fallbackImage =
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80";

export const DELIVERY_FEE = 5000;
export const TAX = 0;

export const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
};

export const formatDate = (value) => {
  if (!value) return "Unknown date";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

export const getItemName = (item) => {
  return item?.name || item?.product?.name || "Product";
};

export const getItemImage = (item) => {
  const image = item?.imageUrl || item?.image || item?.product?.imageUrl;

  if (image?.startsWith("http") || image?.startsWith("/")) {
    return image;
  }

  return fallbackImage;
};

export const getOrderId = (order) => {
  return order?._id || order?.id;
};

export const getOrderItems = (order) => {
  if (Array.isArray(order?.items)) return order.items;
  if (Array.isArray(order?.order?.items)) return order.order.items;
  return [];
};

export const getOrderList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export const getCartItems = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.cart?.items)) return data.cart.items;
  if (Array.isArray(data?.data?.items)) return data.data.items;
  return [];
};

export const getItemSubtotal = (item) => {
  return Number(item?.subtotal ?? Number(item?.price || item?.product?.price || 0) * Number(item?.quantity || 1));
};

export const getItemsSubtotal = (items) => {
  return items.reduce((sum, item) => sum + getItemSubtotal(item), 0);
};

export const getItemCount = (items) => {
  return items.reduce((sum, item) => sum + Number(item?.quantity || 1), 0);
};

export const getStatusClass = (status) => {
  if (["paid", "confirmed", "processing", "shipped", "delivered"].includes(status)) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (["cancelled", "refunded", "failed"].includes(status)) {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
};

export const hasMissingRequiredSize = (items) => {
  return items.some((item) => Array.isArray(item?.sizes) && item.sizes.length > 0 && !item.size);
};
