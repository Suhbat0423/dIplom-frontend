import Image from "next/image";
import Link from "next/link";
import { getProducts, getStores } from "@/api";
import { getProductList } from "@/api/product";
import { getStoreList } from "@/api/store";
import { getSafeImageSrc } from "@/utils/imageSources";

export const dynamic = "force-dynamic";

const fallbackImages = [
  "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
];

const getBrandImage = (store, index) => {
  const image = store.coverImage || store.logo;
  return getSafeImageSrc(image, fallbackImages[index % fallbackImages.length]);
};

const getBrandBadge = (store) => {
  if (store.verified) return "Verified";
  return store.isActive === false ? "Inactive" : "Brand";
};

const BrandsPage = async () => {
  const [storesResult, productsResult] = await Promise.all([getStores(), getProducts()]);
  const stores = getStoreList(storesResult.data);
  const products = getProductList(productsResult.data);
  const productCountByStore = products.reduce((counts, product) => {
    const key = String(product.storeId || "");
    if (!key) return counts;
    counts.set(key, (counts.get(key) || 0) + 1);
    return counts;
  }, new Map());

  return (
    <main className="mt-14 bg-white text-zinc-950">
      <div className="overflow-hidden border-b border-zinc-200 bg-zinc-950 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white">
        <div className="flex w-max animate-[marquee_24s_linear_infinite] gap-10 px-8">
          <span>Featured brands updated weekly</span>
          <span>Independent labels now online</span>
          <span>Members get early brand access</span>
          <span>Featured brands updated weekly</span>
          <span>Independent labels now online</span>
        </div>
      </div>

      <section className="px-5 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-5 border-b border-zinc-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">
              Brands
            </p>
            <h1 className="mt-2 text-5xl font-semibold tracking-tight md:text-6xl">
              Brands
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-zinc-500">
              Browse stores only. Click through to see each brand&apos;s product selection.
            </p>
          </div>

          <p className="text-sm text-zinc-500">
            {stores.length > 0
              ? `${stores.length} brands available now`
              : "No brands available right now"}
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.85fr)]">
          <section className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 xl:grid-cols-3">
            {stores.length > 0 ? (
              stores.map((brand, index) => {
                const brandId = brand._id || brand.id;
                const productCount = productCountByStore.get(String(brandId)) || 0;

                return (
                  <article key={brandId || brand.name} className="group">
                    <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
                      <Image
                        src={getBrandImage(brand, index)}
                        alt={brand.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-3 top-3 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-900">
                        {getBrandBadge(brand)}
                      </span>
                      <Link
                        href={`/brands/${brandId}`}
                        className="absolute bottom-3 left-3 right-3 translate-y-3 bg-white px-4 py-3 text-sm font-semibold opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                      >
                        View Brand
                      </Link>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-xl font-semibold tracking-tight">
                          {brand.name}
                        </h2>
                        <p className="text-sm font-medium text-zinc-500">
                          {productCount} products
                        </p>
                      </div>
                      <p className="text-sm leading-6 text-zinc-500">
                        {brand.description || "Independent fashion brand."}
                      </p>
                      <Link
                        href={`/brands/${brandId}`}
                        className="inline-flex border border-zinc-950 px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-zinc-950 transition hover:bg-zinc-950 hover:text-white"
                      >
                        View Brand
                      </Link>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="col-span-full border border-zinc-200 p-8 text-zinc-600">
                {storesResult.success === false
                  ? storesResult.message || "Failed to load brands."
                  : "No brands found."}
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
                  Brand Edit
                </p>
                <h2 className="mt-2 text-4xl font-semibold tracking-tight">
                  Names shaping the season.
                </h2>
                <p className="mt-3 max-w-sm text-sm text-white/80">
                  Curated labels selected for cut, fabric, and point of view.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default BrandsPage;
