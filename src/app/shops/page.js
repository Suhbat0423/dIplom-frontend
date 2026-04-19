import Link from "next/link";
import { getStores } from "@/api";
import BrandTextButton from "@/components/ui/BrandTextButton";

export const dynamic = "force-dynamic";

const categories = [
  "All Brands",
  "Minimal",
  "Streetwear",
  "Tailoring",
  "Luxury",
  "Womenswear",
  "Menswear",
  "Accessories",
  "Local Labels",
];

const fallbackImages = [
  "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80",
];

const getBrandImage = (store, index) => {
  const image = store.coverImage || store.logo;

  if (image?.startsWith("http") || image?.startsWith("/")) return image;

  return fallbackImages[index % fallbackImages.length];
};

const getBrandBadge = (store) => {
  if (store.verified) {
    return "Verified";
  }

  return store.isActive === false ? "Inactive" : "Brand";
};

const shop = async () => {
  const result = await getStores();
  const stores = Array.isArray(result.data) ? result.data : [];

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
              Shop
            </p>
            <h1 className="mt-2 text-5xl font-semibold tracking-tight md:text-6xl">
              Brands
            </h1>
          </div>

          <label className="flex w-full items-center justify-between gap-3 border border-zinc-200 px-4 py-3 text-sm md:w-auto">
            <span className="text-zinc-500">Sort by:</span>
            <select className="bg-transparent font-medium outline-none">
              <option>Featured</option>
              <option>Newest</option>
              <option>A to Z</option>
              <option>Most wanted</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <BrandTextButton key={category} active={index === 0}>
              {category}
            </BrandTextButton>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.85fr)]">
          <section className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 xl:grid-cols-3">
            {stores.length > 0 ? (
              stores.map((brand, index) => (
                <article key={brand._id || brand.id || brand.name} className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
                  <img
                    src={getBrandImage(brand, index)}
                    alt={brand.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-900">
                    {getBrandBadge(brand)}
                  </span>
                  <button
                    type="button"
                    aria-label={`Save ${brand.name}`}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg leading-none transition hover:bg-zinc-950 hover:text-white"
                  >
                    ♡
                  </button>
                  <Link
                    href={`/shops/${brand._id || brand.id}`}
                    className="absolute bottom-3 left-3 right-3 translate-y-3 bg-white px-4 py-3 text-sm font-semibold opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    View brand
                  </Link>
                </div>

                <div className="mt-4">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-xl font-semibold tracking-tight">
                      {brand.name}
                    </h2>
                    <p className="text-sm font-medium text-zinc-500">
                      {brand.verified ? "Verified" : "Independent"}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">
                    {brand.description || "Fashion brand"}
                  </p>
                </div>
              </article>
              ))
            ) : (
              <div className="col-span-full border border-zinc-200 p-8 text-zinc-600">
                {result.success === false
                  ? result.message || "Failed to load brands."
                  : "No brands found."}
              </div>
            )}
          </section>

          <aside className="order-first lg:order-none">
            <div className="sticky top-20 min-h-[460px] overflow-hidden bg-zinc-100 lg:min-h-[calc(100vh-7rem)]">
              <img
                src="https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=80"
                alt="New season editorial"
                className="h-full min-h-[460px] w-full object-cover"
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

export default shop;
