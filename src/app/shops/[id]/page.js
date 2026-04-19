import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductsByStore, getStoreById } from "@/api";

export const dynamic = "force-dynamic";

const fallbackHero =
  "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1400&q=80";

const fallbackProductImages = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
];

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
};

const getStoreImage = (store) => {
  const image = store.coverImage || store.logo;

  if (image?.startsWith("http") || image?.startsWith("/")) return image;

  return fallbackHero;
};

const getProductImage = (product, index) => {
  if (
    product.imageUrl?.startsWith("http") ||
    product.imageUrl?.startsWith("/")
  ) {
    return product.imageUrl;
  }

  return fallbackProductImages[index % fallbackProductImages.length];
};

const BrandDetailPage = async ({ params }) => {
  const { id } = await params;
  const [storeResult, productsResult] = await Promise.all([
    getStoreById(id),
    getProductsByStore(id),
  ]);

  if (!storeResult.success || !storeResult.data) {
    notFound();
  }

  const store = storeResult.data;
  const products = Array.isArray(productsResult.data)
    ? productsResult.data
    : [];

  return (
    <main className="mt-14 bg-white text-zinc-950">
      <section className="grid min-h-[540px] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col justify-between px-5 py-8 sm:px-8 lg:px-10">
          <div>
            <Link
              href="/shops"
              className="text-sm font-medium text-zinc-500 transition hover:text-black"
            >
              Back to brands
            </Link>
            <div className="mt-16">
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">
                {store.verified ? "Verified brand" : "Independent brand"}
              </p>
              <h1 className="mt-3 text-6xl font-semibold tracking-tight md:text-7xl">
                {store.name}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
                {store.description || "A curated fashion brand on High End."}
              </p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-zinc-200 pt-6 text-sm sm:grid-cols-3">
            <div>
              <p className="text-zinc-500">Collection</p>
              <p className="mt-1 font-semibold">{products.length} pieces</p>
            </div>
            <div>
              <p className="text-zinc-500">Status</p>
              <p className="mt-1 font-semibold">
                {store.isActive === false ? "Inactive" : "Active"}
              </p>
            </div>
            <div>
              <p className="text-zinc-500">Edit</p>
              <p className="mt-1 font-semibold">New season</p>
            </div>
          </div>
        </div>

        <div className="relative  min-h-[420px] overflow-hidden bg-zinc-100">
          <img
            src={getStoreImage(store)}
            alt={store.name}
            className="h-140 w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
            <p className="max-w-md text-sm uppercase tracking-[0.24em]">
              Brand profile
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 px-5 py-10 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">
              Collection
            </p>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight">
              Available pieces
            </h2>
          </div>
          <p className="text-sm text-zinc-500">
            {products.length > 0
              ? `${products.length} styles from ${store.name}`
              : "No products listed yet"}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 xl:grid-cols-4">
          {products.length > 0 ? (
            products.map((product, index) => (
              <article key={product._id || product.id} className="group">
                <Link
                  href={`/products/${product._id || product.id}`}
                  className="relative block aspect-[4/5] overflow-hidden bg-zinc-100"
                >
                  <img
                    src={getProductImage(product, index)}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-900">
                    {product.stock > 0 ? "Available" : "Sold out"}
                  </span>
                </Link>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/products/${product._id || product.id}`}
                      className="font-medium transition hover:text-zinc-500"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-sm text-zinc-500">
                      {product.description || "Signature piece"}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full border border-zinc-200 p-8 text-zinc-600">
              This brand has not added products yet.
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default BrandDetailPage;
