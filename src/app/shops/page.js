import Image from "next/image";
import Link from "next/link";
import { getProducts, getStores } from "@/api";
import { getProductList } from "@/api/product";
import { getStoreList } from "@/api/store";
import ProductCardAddToCartButton from "@/components/shop/ProductCardAddToCartButton";
import { getSafeImageSrc } from "@/utils/imageSources";

export const dynamic = "force-dynamic";

const fallbackImages = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
];

const getProductImage = (product, index) => {
  const image = product.imageUrl || product.image;
  return getSafeImageSrc(image, fallbackImages[index % fallbackImages.length]);
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));

const getProductCategory = (product) => {
  return product.metadata?.category || product.category || "New arrival";
};

const ShopPage = async () => {
  const [productsResult, storesResult] = await Promise.all([getProducts(), getStores()]);
  const products = getProductList(productsResult.data);
  const stores = getStoreList(storesResult.data);
  const storeById = new Map(
    stores.map((store) => [String(store._id || store.id), store]),
  );

  return (
    <main className="mt-14 bg-white text-zinc-950">
      <div className="overflow-hidden border-b border-zinc-200 bg-zinc-950 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white">
        <div className="flex w-max animate-[marquee_24s_linear_infinite] gap-10 px-8">
          <span>New product edits added weekly</span>
          <span>Ready-to-cart styles from independent brands</span>
          <span>Fresh arrivals across tailoring and essentials</span>
          <span>New product edits added weekly</span>
          <span>Ready-to-cart styles from independent brands</span>
        </div>
      </div>

      <section className="px-5 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-5 border-b border-zinc-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">
              Shop
            </p>
            <h1 className="mt-2 text-5xl font-semibold tracking-tight md:text-6xl">
              Shop
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-zinc-500">
              Browse products only. Brands stay separate on the brands page.
            </p>
          </div>

          <p className="text-sm text-zinc-500">
            {products.length > 0
              ? `${products.length} products available now`
              : "No products available right now"}
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.85fr)]">
          <section className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 xl:grid-cols-3">
            {products.length > 0 ? (
              products.map((product, index) => {
                const store = storeById.get(String(product.storeId));
                const brandName =
                  store?.name || product.storeName || product.brandName || "Independent brand";
                const category = getProductCategory(product);

                return (
                  <article key={product._id || product.id || `${product.name}-${index}`} className="group">
                    <Link
                      href={`/products/${product._id || product.id}`}
                      className="relative block aspect-[4/5] overflow-hidden bg-zinc-100"
                    >
                      <Image
                        src={getProductImage(product, index)}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-3 top-3 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-900">
                        {category}
                      </span>
                    </Link>

                    <div className="mt-4 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                            {brandName}
                          </p>
                          <Link
                            href={`/products/${product._id || product.id}`}
                            className="mt-2 block text-xl font-semibold tracking-tight transition hover:text-zinc-600"
                          >
                            {product.name}
                          </Link>
                        </div>
                        <p className="text-sm font-semibold text-zinc-900">
                          {formatCurrency(product.price)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-3 text-sm text-zinc-500">
                        <span>{category}</span>
                        {store && (
                          <Link
                            href={`/brands/${store._id || store.id}`}
                            className="font-medium text-zinc-700 transition hover:text-zinc-950"
                          >
                            View brand
                          </Link>
                        )}
                      </div>

                      <ProductCardAddToCartButton product={product} />
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="col-span-full border border-zinc-200 p-8 text-zinc-600">
                {productsResult.success === false
                  ? productsResult.message || "Failed to load products."
                  : "No products found."}
              </div>
            )}
          </section>

          <aside className="order-first lg:order-none">
            <div className="sticky top-20 min-h-[460px] overflow-hidden bg-zinc-100 lg:min-h-[calc(100vh-7rem)]">
              <Image
                src="https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=80"
                alt="New season editorial"
                fill
                sizes="(max-width: 1024px) 100vw, 320px"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                <p className="text-sm uppercase tracking-[0.24em]">
                  Shop Edit
                </p>
                <h2 className="mt-2 text-4xl font-semibold tracking-tight">
                  Product highlights for the season.
                </h2>
                <p className="mt-3 max-w-sm text-sm text-white/80">
                  A focused shop grid with brand, category, and cart actions in one place.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default ShopPage;
