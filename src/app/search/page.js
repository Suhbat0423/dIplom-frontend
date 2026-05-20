"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState, startTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProducts, getStores } from "@/api";
import { getProductList } from "@/api/product";
import { getStoreList } from "@/api/store";
import { NoticeBanner, PanelState } from "@/components/ui/PageState";
import { getSafeImageSrc } from "@/utils/imageSources";

const fallbackProductImages = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
];

const fallbackBrandImages = [
  "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80",
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));

const normalizeText = (value) => String(value || "").trim().toLowerCase();

const getProductImage = (product, index) => {
  const image = product?.imageUrl || product?.image;
  return getSafeImageSrc(image, fallbackProductImages[index % fallbackProductImages.length]);
};

const getBrandImage = (brand, index) => {
  const image = brand?.coverImage || brand?.logo;
  return getSafeImageSrc(image, fallbackBrandImages[index % fallbackBrandImages.length]);
};

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    let ignore = false;

    const loadSearchData = async () => {
      setLoading(true);
      setError("");

      const [productsResult, storesResult] = await Promise.all([getProducts(), getStores()]);

      if (ignore) return;

      if (!productsResult.success || !storesResult.success) {
        setError(
          productsResult.message ||
            storesResult.message ||
            "Failed to load search results.",
        );
      }

      setProducts(getProductList(productsResult.data));
      setBrands(getStoreList(storesResult.data));
      setLoading(false);
    };

    loadSearchData();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const normalized = query.trim();
    const current = searchParams.get("q") || "";

    if (normalized === current) return;

    startTransition(() => {
      const nextParams = new URLSearchParams(searchParams.toString());

      if (normalized) {
        nextParams.set("q", normalized);
      } else {
        nextParams.delete("q");
      }

      const next = nextParams.toString();
      router.replace(next ? `/search?${next}` : "/search");
    });
  }, [query, router, searchParams]);

  const filteredProducts = useMemo(() => {
    const normalized = normalizeText(deferredQuery);
    if (!normalized) return [];

    return products.filter((product) => {
      const haystack = normalizeText(
        [
          product?.name,
          product?.description,
          product?.metadata?.category,
          product?.category,
          product?.brandName,
          product?.storeName,
        ].join(" "),
      );

      return haystack.includes(normalized);
    });
  }, [deferredQuery, products]);

  const filteredBrands = useMemo(() => {
    const normalized = normalizeText(deferredQuery);
    if (!normalized) return [];

    return brands.filter((brand) => {
      const haystack = normalizeText(
        [brand?.name, brand?.description, brand?.email].join(" "),
      );

      return haystack.includes(normalized);
    });
  }, [brands, deferredQuery]);

  const totalResults = filteredProducts.length + filteredBrands.length;

  return (
    <main className="mt-14 min-h-screen bg-stone-50 px-5 py-8 text-zinc-950 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="border-b border-zinc-200 pb-6">
          <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Search</p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight md:text-6xl">
            Search products and brands
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-500">
            Find products by name or category, and discover brands by their name or description.
          </p>
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
          <label className="block">
            <span className="sr-only">Search</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for coats, tailoring, Mono Studio..."
              className="h-14 w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-5 text-base outline-none transition focus:border-zinc-950 focus:bg-white focus:ring-4 focus:ring-zinc-100"
            />
          </label>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-500">
            <span>{loading ? "Loading catalog..." : `${products.length} products indexed`}</span>
            <span>{loading ? "" : `${brands.length} brands indexed`}</span>
            <span>
              {deferredQuery.trim()
                ? `${totalResults} results for "${deferredQuery.trim()}"`
                : "Start typing to search"}
            </span>
          </div>
        </div>

        {error && <div className="mt-6"><NoticeBanner tone="warning">{error}</NoticeBanner></div>}

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <section>
            <div className="flex items-end justify-between gap-4 border-b border-zinc-200 pb-4">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">Products</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">Matching products</h2>
              </div>
              {!loading && <p className="text-sm text-zinc-500">{filteredProducts.length} found</p>}
            </div>

            {loading ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                    <div className="aspect-[4/5] animate-pulse rounded-2xl bg-zinc-200" />
                    <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-200" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-200" />
                  </div>
                ))}
              </div>
            ) : deferredQuery.trim() && filteredProducts.length > 0 ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {filteredProducts.map((product, index) => {
                  const productId = product?._id || product?.id;

                  return (
                    <article
                      key={productId || `${product?.name}-${index}`}
                      className="overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-sm"
                    >
                      <Link
                        href={`/products/${productId}`}
                        className="relative block aspect-[4/5] bg-zinc-100"
                      >
                        <Image
                          src={getProductImage(product, index)}
                          alt={product?.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover"
                        />
                      </Link>
                      <div className="space-y-3 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                          {product?.metadata?.category || product?.category || "Product"}
                        </p>
                        <Link
                          href={`/products/${productId}`}
                          className="block text-xl font-semibold tracking-tight transition hover:text-zinc-600"
                        >
                          {product?.name}
                        </Link>
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-zinc-500">
                            {product?.storeName || product?.brandName || "Independent brand"}
                          </span>
                          <span className="font-semibold text-zinc-950">
                            {formatCurrency(product?.price)}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6">
                <PanelState
                  title={deferredQuery.trim() ? "No matching products" : "Search for products"}
                  description={
                    deferredQuery.trim()
                      ? "Try a broader category, brand name, or a shorter keyword."
                      : "Search terms will show matching products here."
                  }
                  actionHref={deferredQuery.trim() ? "/shops" : ""}
                  actionLabel={deferredQuery.trim() ? "Browse shops" : ""}
                />
              </div>
            )}
          </section>

          <section>
            <div className="flex items-end justify-between gap-4 border-b border-zinc-200 pb-4">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">Brands</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">Matching brands</h2>
              </div>
              {!loading && <p className="text-sm text-zinc-500">{filteredBrands.length} found</p>}
            </div>

            {loading ? (
              <div className="mt-6 grid gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-[100px_minmax(0,1fr)]">
                    <div className="aspect-square animate-pulse rounded-2xl bg-zinc-200" />
                    <div className="space-y-3">
                      <div className="h-5 w-1/2 animate-pulse rounded bg-zinc-200" />
                      <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
                      <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : deferredQuery.trim() && filteredBrands.length > 0 ? (
              <div className="mt-6 grid gap-4">
                {filteredBrands.map((brand, index) => {
                  const brandId = brand?._id || brand?.id;

                  return (
                    <article
                      key={brandId || `${brand?.name}-${index}`}
                      className="grid gap-4 rounded-[1.75rem] border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-[120px_minmax(0,1fr)]"
                    >
                      <Link
                        href={`/brands/${brandId}`}
                        className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100"
                      >
                        <Image
                          src={getBrandImage(brand, index)}
                          alt={brand?.name}
                          fill
                          sizes="120px"
                          className="object-cover"
                        />
                      </Link>
                      <div className="min-w-0">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <Link
                              href={`/brands/${brandId}`}
                              className="block truncate text-xl font-semibold tracking-tight transition hover:text-zinc-600"
                            >
                              {brand?.name}
                            </Link>
                            <p className="mt-2 text-sm leading-6 text-zinc-500">
                              {brand?.description || "Independent fashion brand."}
                            </p>
                          </div>
                          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-700">
                            {brand?.verified ? "Verified" : "Brand"}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6">
                <PanelState
                  title={deferredQuery.trim() ? "No matching brands" : "Search for brands"}
                  description={
                    deferredQuery.trim()
                      ? "Try a store name, a category, or a shorter phrase."
                      : "Search terms will show matching brands here."
                  }
                  actionHref={deferredQuery.trim() ? "/brands" : ""}
                  actionLabel={deferredQuery.trim() ? "Browse brands" : ""}
                />
              </div>
            )}
          </section>
        </div>

        {!loading && deferredQuery.trim() && totalResults === 0 && (
          <div className="mt-10 rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">Suggestions</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {["Outerwear", "Tailoring", "Minimal", "Accessories"].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setQuery(suggestion)}
                  className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 transition hover:border-zinc-950"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
