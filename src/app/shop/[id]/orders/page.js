"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getStoreOrders, updateOrderStatus } from "@/api";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/config/constants";
import { useAuth } from "@/hooks/useAuth";
import {
  formatCurrency,
  formatDate,
  getItemCount,
  getOrderId,
  getOrderItems,
  getOrderList,
  getStatusClass,
} from "@/utils/orderDisplay";

const StoreOrdersPage = () => {
  const { id: storeId } = useParams();
  const { token, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadOrders = async () => {
      if (authLoading) return;

      await Promise.resolve();
      if (ignore) return;

      if (!token) {
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await getStoreOrders(token, storeId);

      if (ignore) return;

      if (!result.success) {
        setMessage(result.message || "Failed to load store orders.");
        setOrders([]);
        setLoading(false);
        return;
      }

      setOrders(getOrderList(result.data));
      setLoading(false);
    };

    loadOrders();

    return () => {
      ignore = true;
    };
  }, [authLoading, storeId, token]);

  const handleStatusChange = async (order, field, value) => {
    const orderId = getOrderId(order);
    const payload =
      field === "paymentStatus"
        ? { status: order.status || "pending", paymentStatus: value }
        : { status: value };

    setPendingId(`${orderId}-${field}`);
    setMessage("");

    const result = await updateOrderStatus(token, orderId, payload);

    if (!result.success) {
      setMessage(result.message || "Failed to update order status.");
      setPendingId("");
      return;
    }

    setOrders((current) =>
      current.map((item) => (getOrderId(item) === orderId ? result.data : item)),
    );
    setPendingId("");
    setMessage("Order updated.");
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">
            Store orders
          </p>
          <h1 className="mt-2 text-4xl font-bold text-zinc-900">Orders</h1>
        </div>
      </div>

      {message && (
        <div
          className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
            message.includes("Failed")
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <table className="w-full">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">
                Order
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">
                Items
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">
                Total
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">
                Payment
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="border-b border-zinc-200">
                <td colSpan="5" className="px-6 py-8 text-center text-zinc-500">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr className="border-b border-zinc-200">
                <td colSpan="5" className="px-6 py-8 text-center text-zinc-500">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const orderId = getOrderId(order);
                const items = getOrderItems(order);
                const relevantItems = items.filter((item) => item.storeId === storeId);
                const shownItems = relevantItems.length > 0 ? relevantItems : items;
                const names = shownItems.slice(0, 3).map((item) => {
                  const size = item.size ? ` (${String(item.size).toUpperCase()})` : "";
                  return `${item.name}${size}`;
                });

                return (
                  <tr key={orderId} className="border-b border-zinc-200 align-top hover:bg-zinc-50">
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={`/orders/${orderId}`}
                        className="font-semibold text-zinc-950 underline underline-offset-4"
                      >
                        {order.orderNumber || orderId}
                      </Link>
                      <p className="mt-1 text-zinc-500">
                        {order.customerUsername || order.userId || "Customer"}
                      </p>
                      <p className="mt-1 text-zinc-500">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-700">
                      <p>{getItemCount(shownItems)} items</p>
                      <p className="mt-1 max-w-xs text-zinc-500">
                        {names.join(", ")}
                        {shownItems.length > 3 ? ` +${shownItems.length - 3} more` : ""}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-zinc-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={order.status || "pending"}
                        disabled={pendingId === `${orderId}-status`}
                        onChange={(event) => handleStatusChange(order, "status", event.target.value)}
                        className={`h-10 rounded-lg border px-3 text-sm font-semibold outline-none ${getStatusClass(order.status)}`}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={order.paymentStatus || "unpaid"}
                        disabled={pendingId === `${orderId}-paymentStatus`}
                        onChange={(event) =>
                          handleStatusChange(order, "paymentStatus", event.target.value)
                        }
                        className={`h-10 rounded-lg border px-3 text-sm font-semibold outline-none ${getStatusClass(order.paymentStatus)}`}
                      >
                        {PAYMENT_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreOrdersPage;
