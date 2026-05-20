import Link from "next/link";
import SectionHeading from "@/components/home/SectionHeading";

const principles = [
  {
    title: "Curated over crowded",
    body: "We keep the catalog selective so shoppers can discover distinct brands without sorting through noise.",
  },
  {
    title: "Independent first",
    body: "The platform is built to give smaller labels a clearer digital storefront and stronger brand presence.",
  },
  {
    title: "Clean buying flow",
    body: "From product detail to checkout, the experience is designed to feel direct, premium, and easy to trust.",
  },
];

const stats = [
  { label: "Focus", value: "Fashion-first marketplace" },
  { label: "Model", value: "Multi-brand storefront" },
  { label: "Built for", value: "Independent labels and modern shoppers" },
];

export default function AboutPage() {
  return (
    <main className="mt-14 bg-stone-50 text-zinc-950">
      <section className="relative overflow-hidden bg-zinc-950 px-5 py-16 text-white sm:px-8 lg:px-10 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,245,244,0.16),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(161,161,170,0.2),transparent_24%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-[0.28em] text-white/65">
            About High End
          </p>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            A marketplace shaped for independent fashion brands with a sharper digital experience.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
            High End brings premium product discovery, brand storytelling, and a cleaner commerce flow into one modern storefront.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Mission"
          title="Why this platform exists"
          description="Many independent labels have strong product vision but weak digital presentation. High End is meant to close that gap with a storefront that feels editorial, structured, and commerce-ready."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {principles.map((principle) => (
            <article
              key={principle.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-semibold tracking-tight">
                {principle.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-600">
                {principle.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:px-10">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">
              Platform direction
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Designed to feel premium on both the shopper and brand side.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600">
              The storefront side helps users browse products and brands with more clarity. The dashboard side gives shops a simpler way to manage products, orders, and presentation without clutter.
            </p>
          </div>

          <div className="grid gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-zinc-200 bg-stone-50 p-5"
              >
                <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">
                  {stat.label}
                </p>
                <p className="mt-3 text-lg font-semibold text-zinc-950">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="rounded-[2rem] bg-zinc-950 px-6 py-10 text-white sm:px-8 lg:flex lg:items-end lg:justify-between lg:px-10">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.24em] text-white/60">
              Next step
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">
              Explore the brands, browse the products, or open your own shop dashboard.
            </h2>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0">
            <Link
              href="/brands"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-stone-200"
            >
              Explore brands
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Open shop login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
