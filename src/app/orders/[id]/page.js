"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrderById } from "@/api";
import PaymentSection from "@/components/payment/PaymentSection";
import { LoadingPanel, NoticeBanner, PanelState } from "@/components/ui/PageState";
import { AUTH_ROLES } from "@/config/constants";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {
  formatCurrency,
  formatDate,
  getItemImage,
  getItemName,
  getItemSubtotal,
  getOrderItems,
  getStatusClass,
} from "@/utils/orderDisplay";

const OrderDetailPage = () => {
  const { id } = useParams();
  const auth = useRequireAuth({ requiredRole: AUTH_ROLES.USER });
  const { token, loading: authLoading, isAuthorized, logout } = auth;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadOrder = async () => {
      if (authLoading) return;

      await Promise.resolve();
      if (ignore) return;

      if (!token) {
        setOrder(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await getOrderById(token, id);

      if (ignore) return;

      if (!result.success) {
        if (result.status === 401 || result.status === 403) {
          logout();
          return;
        }

        setError(result.message || "Failed to load order.");
        setOrder(null);
        setLoading(false);
        return;
      }

      setOrder(result.data);
      setLoading(false);
    };

    loadOrder();

    return () => {
      ignore = true;
    };
  }, [authLoading, id, logout, token]);

  const refreshOrder = async () => {
    if (!token || !id) return;

    setLoading(true);
    const result = await getOrderById(token, id);

    if (!result.success) {
      setError(result.message || "Failed to load order.");
      setLoading(false);
      return;
    }

    setOrder(result.data);
    setError("");
    setLoading(false);
  };

  if (authLoading || !isAuthorized) {
    return (
      <main className="mt-14 min-h-screen bg-zinc-50 px-5 py-12 text-zinc-950 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <LoadingPanel message="Checking your session..." />
        </div>
      </main>
    );
  }

  const items = getOrderItems(order);
  const address = order?.shippingAddress || {};

  return (
    <main className="mt-14 min-h-screen bg-zinc-50 px-5 py-8 text-zinc-950 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <Link href="/orders" className="text-sm font-semibold text-zinc-500 hover:text-zinc-950">
          Back to orders
        </Link>

        {error && (
          <div className="mt-6">
            <NoticeBanner tone="error">
            {error}
            </NoticeBanner>
          </div>
        )}

        {loading ? (
          <div className="mt-8">
            <LoadingPanel message="Loading order..." />
          </div>
        ) : !order ? (
          <div className="mt-8">
            <PanelState title="Order not found" description="This order could not be loaded." />
          </div>
        ) : (
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <section className="space-y-6">
              <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Order</p>
                    <h1 className="mt-2 text-4xl font-semibold tracking-tight">
                      {order.orderNumber || id}
                    </h1>
                    <p className="mt-2 text-sm text-zinc-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold tracking-tight">Items</h2>
                <div className="mt-5 space-y-4">
                  {items.map((item) => (
                    <article
                      key={item._id || `${item.productId}-${item.size || ""}`}
                      className="grid gap-4 border-b border-zinc-100 pb-4 last:border-0 last:pb-0 sm:grid-cols-[88px_minmax(0,1fr)]"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-lg bg-zinc-100">
                        <Image
                          src={getItemImage(item)}
                          alt={getItemName(item)}
                          fill
                          sizes="88px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex min-w-0 justify-between gap-4">
                        <div>
                          <h3 className="font-semibold tracking-tight">{getItemName(item)}</h3>
                          <p className="mt-1 text-sm text-zinc-500">
                            Qty {item.quantity} · {formatCurrency(item.price)}
                          </p>
                          {item.size && (
                            <p className="mt-1 text-sm font-medium text-zinc-700">
                              Size: {String(item.size).toUpperCase()}
                            </p>
                          )}
                        </div>
                        <p className="shrink-0 text-sm font-semibold">
                          {formatCurrency(getItemSubtotal(item))}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <PaymentSection orderId={id} token={token} onStatusChange={refreshOrder} />

              <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold tracking-tight">Shipping</h2>
                <div className="mt-4 space-y-1 text-sm text-zinc-600">
                  <p className="font-semibold text-zinc-950">{address.fullName}</p>
                  <p>{address.phone}</p>
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>
                    {[address.district, address.city, address.postalCode]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold tracking-tight">Summary</h2>
                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="font-semibold">{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Delivery fee</span>
                    <span className="font-semibold">{formatCurrency(order.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Tax</span>
                    <span className="font-semibold">{formatCurrency(order.tax)}</span>
                  </div>
                </div>
                <div className="mt-6 flex justify-between border-t border-zinc-200 pt-5">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-semibold">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
};

export default OrderDetailPage;
