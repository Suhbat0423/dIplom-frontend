"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { getProductsByStore, getStoreInfo, getStoreOrders } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import { getProductList } from "@/api/product";
import {
  formatCurrency,
  formatDate,
  getItemCount,
  getOrderId,
  getOrderItems,
  getOrderList,
  getStatusClass,
} from "@/utils/orderDisplay";
import { getProductSizeStock, getTotalSizeStock } from "@/utils/productSizes";

const getProductStock = (product) => {
  const sizeStock = getProductSizeStock(product);

  if (Object.keys(sizeStock).length > 0) {
    return getTotalSizeStock(sizeStock);
  }

  return Math.max(0, Number(product?.stock || 0));
};

const getOrderRevenue = (order) => {
  return Number(order?.total || 0);
};

const getCustomerLabel = (order) => {
  return order?.customerUsername || order?.customerName || order?.userId || "Customer";
};

const getRecentItemsLabel = (order) => {
  const items = getOrderItems(order);
  const preview = items
    .slice(0, 2)
    .map((item) => item?.name || item?.product?.name || "Product")
    .join(", ");

  if (!preview) {
    return "No items";
  }

  return items.length > 2 ? `${preview} +${items.length - 2} more` : preview;
};

const DashboardPage = () => {
  const { id: storeId } = useParams();
  const { token, loading: authLoading } = useAuth();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadDashboard = async () => {
      if (authLoading) {
        return;
      }

      if (!token || !storeId) {
        setStore(null);
        setProducts([]);
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      const [storeResult, productsResult, ordersResult] = await Promise.all([
        getStoreInfo(storeId, token),
        getProductsByStore(storeId, token),
        getStoreOrders(token, storeId),
      ]);

      if (ignore) {
        return;
      }

      if (!storeResult.success || !productsResult.success || !ordersResult.success) {
        setError(
          storeResult.message ||
            productsResult.message ||
            ordersResult.message ||
            "Failed to load dashboard data.",
        );
      }

      setStore(storeResult.success ? storeResult.data : null);
      setProducts(getProductList(productsResult.data));
      setOrders(getOrderList(ordersResult.data));
      setLoading(false);
    };

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, [authLoading, storeId, token]);

  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + getOrderRevenue(order), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const lowStockProducts = products.filter((product) => getProductStock(product) <= 5);
    const outOfStockProducts = products.filter((product) => getProductStock(product) === 0);
    const activeProducts = products.filter((product) => getProductStock(product) > 0);
    const paidOrders = orders.filter((order) => order?.paymentStatus === "paid");
    const customers = new Set(
      orders
        .map((order) => order?.userId || order?.customerUsername || order?.customerName)
        .filter(Boolean),
    );

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      activeProducts,
      paidOrders,
      customerCount: customers.size,
    };
  }, [orders, products]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((left, right) => {
        return new Date(right?.createdAt || 0).getTime() - new Date(left?.createdAt || 0).getTime();
      })
      .slice(0, 5);
  }, [orders]);

  const topProducts = useMemo(() => {
    return [...products]
      .sort((left, right) => getProductStock(left) - getProductStock(right))
      .slice(0, 5);
  }, [products]);

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">
            Store dashboard
          </p>
          <h1 className="mt-2 text-4xl font-bold text-zinc-950">
            {store?.name || "Dashboard overview"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-500">
            Track revenue, orders, and inventory health from one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/shop/${storeId}/create-product`}
            className="rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Add product
          </Link>
          <Link
            href={`/shop/${storeId}/orders`}
            className="rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:border-zinc-950"
          >
            Review orders
          </Link>
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Revenue",
            value: formatCurrency(metrics.totalRevenue),
            detail: `${metrics.paidOrders.length} paid orders`,
          },
          {
            label: "Orders",
            value: String(metrics.totalOrders),
            detail: `${metrics.customerCount} customers`,
          },
          {
            label: "Products",
            value: String(metrics.totalProducts),
            detail: `${metrics.activeProducts.length} in stock`,
          },
          {
            label: "Inventory Risk",
            value: String(metrics.lowStockProducts.length),
            detail: `${metrics.outOfStockProducts.length} out of stock`,
          },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-zinc-500">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
              {loading ? "..." : item.value}
            </p>
            <p className="mt-2 text-sm text-zinc-500">{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5">
            <div>
              <h2 className="text-xl font-semibold text-zinc-950">Recent orders</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Latest order activity for this shop
              </p>
            </div>
            <Link
              href={`/shop/${storeId}/orders`}
              className="text-sm font-semibold text-zinc-500 transition hover:text-zinc-950"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-zinc-200">
            {loading ? (
              <div className="px-6 py-10 text-sm text-zinc-500">Loading orders...</div>
            ) : recentOrders.length === 0 ? (
              <div className="px-6 py-10 text-sm text-zinc-500">
                No orders yet. Orders will appear here after the first checkout.
              </div>
            ) : (
              recentOrders.map((order) => (
                <article
                  key={getOrderId(order)}
                  className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-start lg:justify-between"
                >
                  <div>
                    <p className="text-base font-semibold text-zinc-950">
                      {order?.orderNumber || getOrderId(order)}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {getCustomerLabel(order)} · {formatDate(order?.createdAt)}
                    </p>
                    <p className="mt-2 text-sm text-zinc-600">
                      {getItemCount(getOrderItems(order))} items · {getRecentItemsLabel(order)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(order?.status)}`}
                    >
                      {order?.status || "pending"}
                    </span>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(order?.paymentStatus)}`}
                    >
                      {order?.paymentStatus || "unpaid"}
                    </span>
                    <span className="text-sm font-semibold text-zinc-950">
                      {formatCurrency(order?.total)}
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-zinc-950">Store status</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-zinc-500">Verification</span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    store?.verified
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                  }`}
                >
                  {store?.verified ? "Verified" : "Pending"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-zinc-500">Store visibility</span>
                <span className="font-semibold text-zinc-950">
                  {store?.isActive === false ? "Inactive" : "Active"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-zinc-500">Low stock items</span>
                <span className="font-semibold text-zinc-950">
                  {metrics.lowStockProducts.length}
                </span>
              </div>
            </div>
            <Link
              href={`/shop/${storeId}/shop-profile`}
              className="mt-6 inline-flex rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:border-zinc-950"
            >
              Edit store profile
            </Link>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-zinc-950">Inventory watch</h2>
            <div className="mt-5 space-y-3">
              {loading ? (
                <p className="text-sm text-zinc-500">Loading inventory...</p>
              ) : topProducts.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  Add your first product to start tracking stock.
                </p>
              ) : (
                topProducts.map((product) => {
                  const productId = product?._id || product?.id;
                  const stock = getProductStock(product);

                  return (
                    <Link
                      key={productId}
                      href={`/shop/${storeId}/products/${productId}`}
                      className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 px-4 py-3 transition hover:border-zinc-950"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-zinc-950">{product?.name}</p>
                        <p className="mt-1 text-sm text-zinc-500">
                          {formatCurrency(product?.price)}
                        </p>
                      </div>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                          stock === 0
                            ? "border-red-200 bg-red-50 text-red-700"
                            : stock <= 5
                              ? "border-amber-200 bg-amber-50 text-amber-700"
                              : "border-emerald-200 bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {stock} left
                      </span>
                    </Link>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
