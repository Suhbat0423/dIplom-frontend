"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getProducts, getStores, getUsers } from "@/api";
import { getProductList } from "@/api/product";
import { getStoreList } from "@/api/store";
import {
  LoadingPanel,
  NoticeBanner,
  PanelState,
} from "@/components/ui/PageState";

const AdminPage = () => {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadOverview = async () => {
      setLoading(true);
      setError("");

      const [storesResult, productsResult, usersResult] = await Promise.all([
        getStores(),
        getProducts(),
        getUsers(),
      ]);

      if (ignore) return;

      if (!storesResult.success || !productsResult.success || !usersResult.success) {
        setError(
          storesResult.message ||
            productsResult.message ||
            usersResult.message ||
            "Failed to load admin overview.",
        );
      }

      setStores(getStoreList(storesResult.data));
      setProducts(getProductList(productsResult.data));
      setUsers(Array.isArray(usersResult.data) ? usersResult.data : usersResult.data?.users || []);
      setLoading(false);
    };

    loadOverview();

    return () => {
      ignore = true;
    };
  }, []);

  const stats = useMemo(() => {
    const pendingStores = stores.filter((store) => {
      const status = store?.verificationStatus || store?.verification?.status || store?.status;
      return status === "pending";
    });
    const inactiveStores = stores.filter((store) => store?.isActive === false);
    const verifiedStores = stores.filter((store) => store?.verified || store?.isVerified);

    return {
      pendingStores,
      inactiveStores,
      verifiedStores,
    };
  }, [stores]);

  if (loading) {
    return (
      <main className="mt-14 min-h-screen bg-zinc-50 px-5 py-8 text-zinc-950 sm:px-8 lg:px-10">
        <LoadingPanel message="Loading admin overview..." />
      </main>
    );
  }

  return (
    <main className="mt-14 min-h-screen bg-zinc-50 px-5 py-8 text-zinc-950 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="border-b border-zinc-200 pb-6">
          <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Admin</p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight md:text-6xl">
            Platform overview
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-500">
            Read-only operational view for stores, products, users, and brand verification backlog.
          </p>
        </div>

        {error && <NoticeBanner tone="warning">{error}</NoticeBanner>}

        <NoticeBanner tone="neutral">
          Admin write actions are waiting on dedicated backend moderation endpoints and role separation.
          The current panel is limited to operational review and verification queue visibility.
        </NoticeBanner>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Stores", value: stores.length, detail: `${stats.verifiedStores.length} verified` },
            { label: "Products", value: products.length, detail: "Catalog items live now" },
            { label: "Users", value: users.length, detail: "Registered buyers" },
            { label: "Pending Review", value: stats.pendingStores.length, detail: `${stats.inactiveStores.length} inactive stores` },
          ].map((item) => (
            <article
              key={item.label}
              className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-zinc-500">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">{item.value}</p>
              <p className="mt-2 text-sm text-zinc-500">{item.detail}</p>
            </article>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-end justify-between gap-4 border-b border-zinc-200 pb-5">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">Verification queue</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Stores awaiting review</h2>
              </div>
              <span className="text-sm text-zinc-500">{stats.pendingStores.length} pending</span>
            </div>

            {stats.pendingStores.length === 0 ? (
              <div className="mt-6">
                <PanelState
                  title="Queue is clear"
                  description="No stores are currently waiting for verification review."
                />
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {stats.pendingStores.map((store) => {
                  const storeId = store?._id || store?.id;

                  return (
                    <article
                      key={storeId}
                      className="flex flex-col gap-4 rounded-lg border border-zinc-200 p-4 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div>
                        <p className="text-lg font-semibold tracking-tight text-zinc-950">{store?.name}</p>
                        <p className="mt-1 text-sm text-zinc-500">
                          {store?.email || "No email"} {store?.phone ? `· ${store.phone}` : ""}
                        </p>
                        <p className="mt-2 text-sm text-zinc-600">
                          {store?.description || "No description provided."}
                        </p>
                      </div>
                      <Link
                        href={`/shop/${storeId}/shop-profile`}
                        className="inline-flex rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:border-zinc-950"
                      >
                        Open profile
                      </Link>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <div className="space-y-8">
            <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">Recent stores</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Newest brands</h2>
              <div className="mt-5 space-y-3">
                {stores.slice(0, 5).map((store) => {
                  const storeId = store?._id || store?.id;

                  return (
                    <Link
                      key={storeId}
                      href={`/brands/${storeId}`}
                      className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 px-4 py-3 transition hover:border-zinc-950"
                    >
                      <div>
                        <p className="font-semibold text-zinc-950">{store?.name}</p>
                        <p className="mt-1 text-sm text-zinc-500">{store?.email || "No email"}</p>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                        {store?.verified || store?.isVerified ? "Verified" : "Store"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">Catalog snapshot</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Recent products</h2>
              <div className="mt-5 space-y-3">
                {products.slice(0, 5).map((product) => {
                  const productId = product?._id || product?.id;

                  return (
                    <Link
                      key={productId}
                      href={`/products/${productId}`}
                      className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 px-4 py-3 transition hover:border-zinc-950"
                    >
                      <div>
                        <p className="font-semibold text-zinc-950">{product?.name}</p>
                        <p className="mt-1 text-sm text-zinc-500">{product?.storeName || "Independent brand"}</p>
                      </div>
                      <span className="text-sm font-semibold text-zinc-950">
                        {Number(product?.price || 0)}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminPage;
