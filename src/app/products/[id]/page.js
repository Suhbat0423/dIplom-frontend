import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById, getStoreById } from "@/api";
import ProductPurchasePanel from "@/components/shop/ProductPurchasePanel";

export const dynamic = "force-dynamic";

const fallbackProductImage =
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
};

const getProductImage = (product) => {
  if (product.imageUrl?.startsWith("http") || product.imageUrl?.startsWith("/")) {
    return product.imageUrl;
  }

  return fallbackProductImage;
};

const getProductMeta = (product, key, fallback) => {
  return product.metadata?.[key] || fallback;
};

const ProductPage = async ({ params }) => {
  const { id } = await params;
  const productResult = await getProductById(null, id);

  if (!productResult.success || !productResult.data) {
    notFound();
  }

  const product = productResult.data;
  const storeResult = product.storeId ? await getStoreById(product.storeId) : null;
  const store = storeResult?.success ? storeResult.data : null;
  const inStock = Number(product.stock || 0) > 0;

  return (
    <main className="mt-14 bg-white text-zinc-950">
      <section className="grid min-h-[calc(100vh-3.5rem)] lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
        <div className="bg-zinc-100">
          <div className="sticky top-14 min-h-[560px] lg:min-h-[calc(100vh-3.5rem)]">
            <img
              src={getProductImage(product)}
              alt={product.name}
              className="h-full min-h-[560px] w-full object-cover lg:min-h-[calc(100vh-3.5rem)]"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between px-5 py-8 sm:px-8 lg:px-12">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
              <Link href="/shops" className="transition hover:text-zinc-950">
                Shops
              </Link>
              <span>/</span>
              {store ? (
                <Link
                  href={`/shops/${store._id || store.id}`}
                  className="transition hover:text-zinc-950"
                >
                  {store.name}
                </Link>
              ) : (
                <span>Brand</span>
              )}
            </div>

            <div className="mt-10">
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">
                {getProductMeta(product, "category", "New arrival")}
              </p>
              <div className="mt-4 flex items-start justify-between gap-6">
                <div>
                  <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
                    {product.name}
                  </h1>
                  {store?.name && (
                    <p className="mt-3 text-sm font-medium text-zinc-500">
                      by {store.name}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  aria-label={`Save ${product.name}`}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-zinc-300 bg-white text-xl transition hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
                >
                  ♡
                </button>
              </div>

              <p className="mt-6 text-2xl font-semibold">
                {formatCurrency(product.price)}
              </p>

              <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600">
                {product.description ||
                  "A carefully selected piece for a clean, modern wardrobe."}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3 border-y border-zinc-200 py-5 text-sm sm:grid-cols-4">
                <div>
                  <p className="text-zinc-500">Status</p>
                  <p className="mt-1 font-semibold">
                    {inStock ? "Available" : "Sold out"}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500">Stock</p>
                  <p className="mt-1 font-semibold">{Number(product.stock || 0)}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Price tier</p>
                  <p className="mt-1 font-semibold">
                    {getProductMeta(product, "priceCategory", "Standard")}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500">Inventory</p>
                  <p className="mt-1 font-semibold">
                    {getProductMeta(product, "stockQuality", "Normal")}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <ProductPurchasePanel product={product} />
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-4 border-t border-zinc-200 pt-6 text-sm text-zinc-600 sm:grid-cols-3">
            <p>Free pickup where available.</p>
            <p>Returns accepted within 14 days.</p>
            <p>Secure checkout for every order.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductPage;

