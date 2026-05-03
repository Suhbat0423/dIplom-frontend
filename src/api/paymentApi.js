import { apiRequest } from "@/api/client";
import { API_ROUTES } from "@/api/config";

const buildError = (message, status, data) => {
  const error = new Error(message || "Payment request failed.");

  error.status = status;
  error.data = data;

  return error;
};

const requestPayment = async (path, { method = "GET", token, body } = {}) => {
  const result = await apiRequest(path, { method, token, body });

  if (!result.success) {
    throw buildError(
      result.message || "Payment request failed.",
      result.status,
      result.data,
    );
  }

  return result.data;
};

export const getPaymentFromResponse = (payload) => {
  if (!payload) return null;
  if (payload.payment && typeof payload.payment === "object") return payload.payment;
  if (payload.data && typeof payload.data === "object") {
    if (payload.data.payment && typeof payload.data.payment === "object") {
      return payload.data.payment;
    }

    return payload.data;
  }

  return typeof payload === "object" ? payload : null;
};

export const getPaymentStatus = (payment) => {
  return payment?.status || payment?.paymentStatus || "pending";
};

export const getPaymentId = (payment) => {
  return payment?._id || payment?.id || null;
};

export const createPayment = (orderId, token) => {
  return requestPayment(API_ROUTES.payment.list, {
    method: "POST",
    token,
    body: {
      orderId,
      method: "card",
      currency: "MNT",
      provider: "manual",
    },
  });
};

export const getPaymentByOrder = (orderId, token) => {
  return requestPayment(API_ROUTES.payment.byOrder(orderId), {
    token,
  });
};

export const confirmPayment = (paymentId, token) => {
  return requestPayment(API_ROUTES.payment.confirm(paymentId), {
    method: "POST",
    token,
  });
};

export const failPayment = (paymentId, token) => {
  return requestPayment(API_ROUTES.payment.fail(paymentId), {
    method: "POST",
    token,
  });
};
