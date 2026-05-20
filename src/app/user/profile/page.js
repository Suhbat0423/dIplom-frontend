"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyOrders } from "@/api";
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
  getOrderList,
  getStatusClass,
} from "@/utils/orderDisplay";
import { getLoginPathForRole } from "@/utils/auth";

const getUserDisplayName = (user, tokenPayload) => {
  return (
    user?.username ||
    user?.name ||
    user?.fullName ||
    tokenPayload?.username ||
    tokenPayload?.name ||
    "Customer"
  );
};

const getUserEmail = (user, tokenPayload) => {
  return user?.email || tokenPayload?.email || "No email provided";
};

const flattenOrderItems = (orders) => {
  return orders.flatMap((order) =>
    getOrderItems(order).map((item) => ({
      orderId: order?._id || order?.id,
      orderNumber: order?.orderNumber,
      orderStatus: order?.status || "pending",
      paymentStatus: order?.paymentStatus || "unpaid",
      createdAt: order?.createdAt,
      quantity: Number(item?.quantity || 1),
      price: Number(item?.price || item?.product?.price || 0),
      subtotal: getItemSubtotal(item),
      name: getItemName(item),
      image: getItemImage(item),
      size: item?.size || "",
    })),
  );
};

const UserProfilePage = () => {
  const router = useRouter();
  const auth = useRequireAuth({ requiredRole: AUTH_ROLES.USER });
  const { token, session, loading: authLoading, isAuthorized, logout } = auth;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadOrders = async () => {
      if (authLoading) return;

      if (!token) {
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      const result = await getMyOrders(token);

      if (ignore) return;

      if (!result.success) {
        if (result.status === 401 || result.status === 403) {
          logout(AUTH_ROLES.USER);
          router.replace(getLoginPathForRole(AUTH_ROLES.USER, "/user/profile"));
          return;
        }

        setError(result.message || "Failed to load your profile.");
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
  }, [authLoading, logout, router, token]);

  const orderedItems = useMemo(() => flattenOrderItems(orders), [orders]);
  const user = session?.user || null;
  const tokenPayload = session?.tokenPayload || null;
  const userName = getUserDisplayName(user, tokenPayload);
  const userEmail = getUserEmail(user, tokenPayload);

  const handleLogout = () => {
    logout(AUTH_ROLES.USER);
    router.replace("/user");
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

  return (
    <main className="mt-14 min-h-screen bg-zinc-50 px-5 py-8 text-zinc-950 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Profile</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight">{userName}</h1>
              <p className="mt-2 text-sm text-zinc-500">{userEmail}</p>

              <div className="mt-6 space-y-3 border-t border-zinc-200 pt-5 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-zinc-500">Account type</span>
                  <span className="font-semibold text-zinc-950">Customer</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-zinc-500">Orders placed</span>
                  <span className="font-semibold text-zinc-950">{orders.length}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-zinc-500">Items ordered</span>
                  <span className="font-semibold text-zinc-950">{orderedItems.length}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-800 transition hover:border-zinc-950"
              >
                Logout
              </button>
            </div>
          </aside>

          <div className="space-y-6">
            <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-end justify-between gap-4 border-b border-zinc-200 pb-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Orders</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">My orders</h2>
                </div>
                <Link href="/orders" className="text-sm font-semibold text-zinc-500 hover:text-zinc-950">
                  View all
                </Link>
              </div>

              {error && (
                <div className="mt-6">
                  <NoticeBanner tone="error">{error}</NoticeBanner>
                </div>
              )}

              {loading ? (
                <div className="mt-6">
                  <LoadingPanel message="Loading orders..." />
                </div>
              ) : orders.length === 0 ? (
                <div className="mt-6">
                  <PanelState
                    title="No orders yet"
                    description="You have not placed any orders yet."
                    actionHref="/shops"
                    actionLabel="Start shopping"
                  />
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {orders.map((order) => {
                    const orderId = order?._id || order?.id;
                    const items = getOrderItems(order);

                    return (
                      <Link
                        key={orderId}
                        href={`/orders/${orderId}`}
                        className="block rounded-lg border border-zinc-200 p-4 transition hover:border-zinc-950"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <p className="text-lg font-semibold tracking-tight">
                              {order.orderNumber || orderId}
                            </p>
                            <p className="mt-1 text-sm text-zinc-500">
                              {formatDate(order.createdAt)} · {items.length} items
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(order.status)}`}>
                              {order.status || "pending"}
                            </span>
                            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(order.paymentStatus)}`}>
                              {order.paymentStatus || "unpaid"}
                            </span>
                            <span className="text-sm font-semibold">{formatCurrency(order.total)}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="border-b border-zinc-200 pb-5">
                <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Items</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Ordered products</h2>
              </div>

              {loading ? (
                <div className="mt-6">
                  <LoadingPanel message="Loading ordered items..." />
                </div>
              ) : orderedItems.length === 0 ? (
                <div className="mt-6">
                  <PanelState
                    title="No ordered items yet"
                    description="Ordered items will appear here after your first purchase."
                    actionHref="/shops"
                    actionLabel="Explore products"
                  />
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {orderedItems.map((item, index) => (
                    <article
                      key={`${item.orderId}-${item.name}-${item.size || "no-size"}-${index}`}
                      className="grid gap-4 rounded-lg border border-zinc-200 p-4 sm:grid-cols-[84px_minmax(0,1fr)]"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-lg bg-zinc-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="84px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <h3 className="font-semibold tracking-tight">{item.name}</h3>
                            <p className="mt-1 text-sm text-zinc-500">
                              {item.orderNumber || item.orderId} · {formatDate(item.createdAt)}
                            </p>
                            <p className="mt-2 text-sm text-zinc-600">
                              Qty {item.quantity} · {formatCurrency(item.price)}
                              {item.size ? ` · Size ${String(item.size).toUpperCase()}` : ""}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2 lg:justify-end">
                            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(item.orderStatus)}`}>
                              {item.orderStatus}
                            </span>
                            <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-700">
                              {item.paymentStatus}
                            </span>
                            <span className="text-sm font-semibold">{formatCurrency(item.subtotal)}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
};

export default UserProfilePage;
