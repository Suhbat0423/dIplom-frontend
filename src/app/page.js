import Image from "next/image";
import Link from "next/link";
import { getProducts, getStores } from "@/api";
import { getProductList } from "@/api/product";
import { getStoreList } from "@/api/store";
import SiteHeader from "@/components/layout/SiteHeader";
import SectionHeading from "@/components/home/SectionHeading";

export const dynamic = "force-dynamic";

const heroImage =
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1600&q=80";

const editorialImage =
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80";

const fallbackProductImages = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
];

const fallbackBrandImages = [
  "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80",
];

const placeholderProducts = [
  {
    id: "placeholder-product-1",
    name: "Structured Wool Coat",
    price: 220,
    storeId: "placeholder-brand-1",
    storeName: "Atelier North",
    metadata: { category: "Outerwear" },
    imageUrl: fallbackProductImages[0],
  },
  {
    id: "placeholder-product-2",
    name: "Signature Denim Shirt",
    price: 98,
    storeId: "placeholder-brand-2",
    storeName: "Mono Studio",
    metadata: { category: "Shirting" },
    imageUrl: fallbackProductImages[1],
  },
  {
    id: "placeholder-product-3",
    name: "Pleated City Trouser",
    price: 134,
    storeId: "placeholder-brand-3",
    storeName: "Common Form",
    metadata: { category: "Tailoring" },
    imageUrl: fallbackProductImages[2],
  },
  {
    id: "placeholder-product-4",
    name: "Leather Strap Bag",
    price: 156,
    storeId: "placeholder-brand-1",
    storeName: "Atelier North",
    metadata: { category: "Accessories" },
    imageUrl: fallbackProductImages[3],
  },
];

const placeholderBrands = [
  {
    id: "placeholder-brand-1",
    name: "Atelier North",
    description: "Minimal tailoring built for everyday structure.",
    logo: fallbackBrandImages[0],
  },
  {
    id: "placeholder-brand-2",
    name: "Mono Studio",
    description: "Quiet essentials with premium fabrics and clean lines.",
    logo: fallbackBrandImages[1],
  },
  {
    id: "placeholder-brand-3",
    name: "Common Form",
    description: "Modern silhouettes shaped for city wardrobes.",
    logo: fallbackBrandImages[2],
  },
];

const valueProps = [
  {
    title: "Curated Brands",
    body: "Independent labels selected for design clarity, finish, and point of view.",
  },
  {
    title: "Secure Checkout",
    body: "A streamlined buying flow that keeps payment and order status clear.",
  },
  {
    title: "Order Tracking",
    body: "Stay close to every purchase with clean order history and status visibility.",
  },
  {
    title: "Premium Selection",
    body: "A focused marketplace built around style, not clutter.",
  },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const allowedImageHosts = new Set(["images.unsplash.com"]);

const isAllowedImageSrc = (src) => {
  if (!src || typeof src !== "string") return false;
  if (src.startsWith("/")) return true;

  try {
    const url = new URL(src);
    return url.protocol === "https:" && allowedImageHosts.has(url.hostname);
  } catch {
    return false;
  }
};

const getProductImage = (product, index) => {
  const image = product.imageUrl || product.image;
  if (isAllowedImageSrc(image)) return image;
  return fallbackProductImages[index % fallbackProductImages.length];
};

const getBrandImage = (brand, index) => {
  const image = brand.coverImage || brand.logo || brand.imageUrl;
  if (isAllowedImageSrc(image)) return image;
  return fallbackBrandImages[index % fallbackBrandImages.length];
};

const getBrandName = (product, storeById) => {
  const store = storeById.get(String(product.storeId || ""));
  return store?.name || product.storeName || product.brandName || "Independent Brand";
};

const getCategory = (product) =>
  product.metadata?.category || product.category || "New Arrival";

const normalizeProduct = (product) => ({
  ...product,
  id: product._id || product.id,
});

const normalizeBrand = (brand) => ({
  ...brand,
  id: brand._id || brand.id,
});

export default async function Home() {
  const [productsResult, storesResult] = await Promise.all([getProducts(), getStores()]);
  const fetchedProducts = getProductList(productsResult.data).map(normalizeProduct);
  const fetchedBrands = getStoreList(storesResult.data).map(normalizeBrand);
  const products = fetchedProducts.length > 0 ? fetchedProducts : placeholderProducts;
  const brands = fetchedBrands.length > 0 ? fetchedBrands : placeholderBrands;
  const storeById = new Map(brands.map((brand) => [String(brand.id), brand]));
  const productCountByStore = products.reduce((counts, product) => {
    const key = String(product.storeId || "");
    if (!key) return counts;
    counts.set(key, (counts.get(key) || 0) + 1);
    return counts;
  }, new Map());
  const featuredProducts = products.slice(0, 4);
  const featuredBrands = brands.slice(0, 3);
  const seasonalProducts = products.slice(0, 2);

  return (
    <>
      <SiteHeader variant="transparent" />
      <main className="bg-stone-50 text-zinc-950">
        <section className="relative isolate overflow-hidden bg-zinc-950 text-white">
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt="Editorial fashion hero"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(9,9,11,0.9)_18%,rgba(9,9,11,0.58)_55%,rgba(9,9,11,0.2)_100%)]" />
          </div>

          <div className="relative mx-auto grid min-h-[100svh] max-w-7xl items-end gap-10 px-5 pb-10 pt-28 sm:px-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] lg:px-10 lg:pb-14">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                Multi-brand fashion marketplace
              </p>
              <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Independent brands. Elevated pieces. One refined storefront.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
                Shop curated products, discover emerging labels, and move from
                first impression to checkout in a cleaner, more premium flow.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/shops"
                  className="inline-flex items-center justify-center bg-white px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-zinc-950 transition hover:bg-stone-200"
                >
                  Shop Now
                </Link>
                <Link
                  href="/brands"
                  className="inline-flex items-center justify-center border border-white/40 px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:border-white hover:bg-white/10"
                >
                  Explore Brands
                </Link>
              </div>
            </div>

            <div className="grid gap-4 self-end sm:grid-cols-3 lg:grid-cols-1">
              <div className="border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-white/60">
                  Products
                </p>
                <p className="mt-3 text-3xl font-semibold">{products.length}+</p>
              </div>
              <div className="border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-white/60">
                  Brands
                </p>
                <p className="mt-3 text-3xl font-semibold">{brands.length}+</p>
              </div>
              <div className="border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-white/60">
                  Experience
                </p>
                <p className="mt-3 text-lg font-medium text-white/85">
                  Premium layout, clear browsing, focused checkout.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-18 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Featured Products"
            title="A sharper first look at what customers can buy now."
            description="A curated product grid that leads with image, brand, and price clarity."
            ctaHref="/shops"
            ctaLabel="View all products"
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <article
                key={product.id || `${product.name}-${index}`}
                className="group flex flex-col bg-white"
              >
                <Link
                  href={product.id ? `/products/${product.id}` : "/shops"}
                  className="relative block aspect-[4/5] overflow-hidden bg-zinc-100"
                >
                  <Image
                    src={getProductImage(product, index)}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-900">
                    {getCategory(product)}
                  </span>
                </Link>
                <div className="flex flex-1 flex-col justify-between border border-t-0 border-zinc-200 p-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                      {getBrandName(product, storeById)}
                    </p>
                    <Link
                      href={product.id ? `/products/${product.id}` : "/shops"}
                      className="mt-2 block text-xl font-semibold tracking-tight transition hover:text-zinc-600"
                    >
                      {product.name}
                    </Link>
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-zinc-900">
                      {formatCurrency(product.price)}
                    </p>
                    <Link
                      href={product.id ? `/products/${product.id}` : "/shops"}
                      className="text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
                    >
                      Shop item
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-zinc-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-18 sm:px-8 lg:px-10">
            <SectionHeading
              eyebrow="Featured Brands"
              title="A marketplace with room for brand identity."
              description="Each brand keeps its own presence, voice, and product edit."
              ctaHref="/brands"
              ctaLabel="View all brands"
            />

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {featuredBrands.map((brand, index) => (
                <article
                  key={brand.id || `${brand.name}-${index}`}
                  className="group overflow-hidden border border-zinc-200 bg-stone-50"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
                    <Image
                      src={getBrandImage(brand, index)}
                      alt={brand.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-4 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-2xl font-semibold tracking-tight">
                        {brand.name}
                      </h3>
                      <span className="text-sm text-zinc-500">
                        {productCountByStore.get(String(brand.id)) || 0} products
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-zinc-600">
                      {brand.description || "Independent fashion brand with a clear point of view."}
                    </p>
                    <Link
                      href={brand.id ? `/brands/${brand.id}` : "/brands"}
                      className="inline-flex border border-zinc-950 px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-zinc-950 transition hover:bg-zinc-950 hover:text-white"
                    >
                      View Brand
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-18 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Why Shop With Us"
            title="Built for discovery without the clutter."
            description="The homepage should feel editorial, but still direct shoppers clearly into products, brands, and checkout."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {valueProps.map((item) => (
              <article
                key={item.title}
                className="border border-zinc-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-30px_rgba(0,0,0,0.45)]"
              >
                <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                  {item.title}
                </p>
                <p className="mt-5 text-sm leading-7 text-zinc-700">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#e7e1d7]">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-18 sm:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:px-10">
            <div className="relative min-h-[420px] overflow-hidden">
              <Image
                src={editorialImage}
                alt="Seasonal fashion editorial"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">
                  Seasonal Edit
                </p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                  New arrivals shaped for a sharper wardrobe.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-700">
                  Use this space to highlight a tighter edit: key silhouettes,
                  premium textures, and standout pieces that move users into the
                  shop with intent.
                </p>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {seasonalProducts.map((product, index) => (
                  <Link
                    key={product.id || `${product.name}-${index}`}
                    href={product.id ? `/products/${product.id}` : "/shops"}
                    className="border border-black/10 bg-white/80 p-5 transition hover:bg-white"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                      {getBrandName(product, storeById)}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight">
                      {product.name}
                    </h3>
                    <p className="mt-3 text-sm text-zinc-600">
                      {getCategory(product)} · {formatCurrency(product.price)}
                    </p>
                  </Link>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  href="/shops"
                  className="inline-flex bg-zinc-950 px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-zinc-800"
                >
                  Shop the edit
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-zinc-950 text-white">
          <div className="mx-auto max-w-7xl px-5 py-18 sm:px-8 lg:px-10">
            <div className="grid gap-8 border border-white/10 bg-white/5 p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:p-12">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-white/60">
                  Start here
                </p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                  Make the first click obvious.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-white/75">
                  Push users directly into products when they want to shop, or
                  into brands when they want to explore labels. That separation
                  is now clear from the first screen.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/shops"
                  className="inline-flex items-center justify-center bg-white px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-zinc-950 transition hover:bg-stone-200"
                >
                  Start Shopping
                </Link>
                <Link
                  href="/brands"
                  className="inline-flex items-center justify-center border border-white/30 px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:border-white hover:bg-white/10"
                >
                  Browse Brands
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
