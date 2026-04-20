"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getMyOrders } from "@/api";
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

const MyOrdersPage = () => {
  const { token, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      const result = await getMyOrders(token);

      if (ignore) return;

      if (!result.success) {
        setError(result.message || "Failed to load orders.");
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
  }, [authLoading, token]);

  if (!authLoading && !token) {
    return (
      <main className="mt-14 min-h-screen bg-zinc-50 px-5 py-12 text-zinc-950 sm:px-8 lg:px-10">
        <section className="mx-auto max-w-3xl rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-4xl font-semibold tracking-tight">Sign in to view orders</h1>
          <Link
            href="/user?next=/orders"
            className="mt-6 inline-flex rounded-lg bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Sign in
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mt-14 min-h-screen bg-zinc-50 px-5 py-8 text-zinc-950 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="border-b border-zinc-200 pb-6">
          <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Orders</p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight md:text-6xl">
            My orders
          </h1>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-8 text-sm text-zinc-500 shadow-sm">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight">No orders yet</h2>
            <p className="mt-2 text-sm text-zinc-500">Your placed orders will appear here.</p>
            <Link
              href="/shops"
              className="mt-6 inline-flex rounded-lg bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {orders.map((order) => {
              const orderId = getOrderId(order);
              const items = getOrderItems(order);
              const names = items.slice(0, 3).map((item) => item.name).join(", ");

              return (
                <Link
                  key={orderId}
                  href={`/orders/${orderId}`}
                  className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-950"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-lg font-semibold tracking-tight">
                        {order.orderNumber || orderId}
                      </p>
                      <p className="mt-1 text-sm text-zinc-500">
                        {formatDate(order.createdAt)} · {getItemCount(items)} items
                      </p>
                      <p className="mt-2 text-sm text-zinc-600">
                        {names || "Order items"}
                        {items.length > 3 ? ` +${items.length - 3} more` : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(order.status)}`}>
                        {order.status || "pending"}
                      </span>
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(order.paymentStatus)}`}>
                        {order.paymentStatus || "unpaid"}
                      </span>
                      <span className="text-lg font-semibold">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default MyOrdersPage;
