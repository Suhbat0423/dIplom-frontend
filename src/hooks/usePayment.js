"use client";

import { useEffect, useState } from "react";
import {
  confirmPayment,
  createPayment,
  failPayment,
  getPaymentByOrder,
  getPaymentFromResponse,
  getPaymentId,
} from "@/api/paymentApi";

export const usePayment = (orderId, token) => {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(Boolean(orderId && token));
  const [refreshing, setRefreshing] = useState(false);
  const [action, setAction] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadPayment = async () => {
      if (!orderId || !token) {
        setPayment(null);
        setLoading(false);
        setRefreshing(false);
        setError("");
        setSuccessMessage("");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const result = await getPaymentByOrder(orderId, token);

        if (ignore) return;

        setPayment(getPaymentFromResponse(result));
      } catch (requestError) {
        if (ignore) return;

        if (requestError.status === 404) {
          setPayment(null);
          setError("");
        } else {
          setPayment(null);
          setError(requestError.message || "Failed to load payment.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };

    loadPayment();

    return () => {
      ignore = true;
    };
  }, [orderId, token]);

  const refreshPayment = async () => {
    if (!orderId || !token) return null;

    setRefreshing(true);
    setError("");
    setSuccessMessage("");

    try {
      const result = await getPaymentByOrder(orderId, token);
      const nextPayment = getPaymentFromResponse(result);

      setPayment(nextPayment);
      return nextPayment;
    } catch (requestError) {
      if (requestError.status === 404) {
        setPayment(null);
        return null;
      }

      setError(requestError.message || "Failed to refresh payment.");
      throw requestError;
    } finally {
      setRefreshing(false);
    }
  };

  const runAction = async (nextAction, request) => {
    if (!token) return null;

    setAction(nextAction);
    setError("");
    setSuccessMessage("");

    try {
      const result = await request();
      const nextPayment = getPaymentFromResponse(result);

      if (nextPayment) {
        setPayment(nextPayment);
      } else {
        await refreshPayment();
      }

      return nextPayment;
    } catch (requestError) {
      setError(requestError.message || "Payment action failed.");
      throw requestError;
    } finally {
      setAction("");
    }
  };

  const create = async () => {
    const nextPayment = await runAction("create", () => createPayment(orderId, token));
    setSuccessMessage("Payment request created.");
    return nextPayment;
  };

  const confirm = async () => {
    const paymentId = getPaymentId(payment);

    if (!paymentId) {
      const requestError = new Error("Payment is not available to confirm.");
      setError(requestError.message);
      throw requestError;
    }

    const nextPayment = await runAction("confirm", () => confirmPayment(paymentId, token));
    setSuccessMessage("Payment confirmed.");
    return nextPayment;
  };

  const fail = async () => {
    const paymentId = getPaymentId(payment);

    if (!paymentId) {
      const requestError = new Error("Payment is not available to fail.");
      setError(requestError.message);
      throw requestError;
    }

    const nextPayment = await runAction("fail", () => failPayment(paymentId, token));
    setSuccessMessage("Payment marked as failed.");
    return nextPayment;
  };

  return {
    payment,
    loading,
    refreshing,
    action,
    error,
    successMessage,
    create,
    confirm,
    fail,
    refreshPayment,
  };
};
