const SkeletonBlock = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 bg-[length:200%_100%] ${className}`}
    />
  );
};

export const StorefrontGridSkeleton = ({ mode = "products" }) => {
  const label = mode === "brands" ? "Brands" : "Shop";

  return (
    <main className="mt-14 bg-white text-zinc-950">
      <div className="overflow-hidden border-b border-zinc-200 bg-zinc-950 py-2">
        <div className="flex gap-10 px-8">
          <SkeletonBlock className="h-3 w-44 rounded-full bg-white/20" />
          <SkeletonBlock className="h-3 w-40 rounded-full bg-white/20" />
          <SkeletonBlock className="h-3 w-48 rounded-full bg-white/20" />
        </div>
      </div>

      <section className="px-5 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-5 border-b border-zinc-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <SkeletonBlock className="h-4 w-20 rounded-full" />
            <SkeletonBlock className="h-14 w-52" />
            <SkeletonBlock className="h-4 w-full max-w-xl" />
          </div>

          <SkeletonBlock className="h-4 w-36 rounded-full" />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.85fr)]">
          <section className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <article key={`${label}-${index}`} className="space-y-4">
                <SkeletonBlock className="aspect-[4/5] w-full rounded-[1.75rem]" />
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <SkeletonBlock className="h-7 w-40" />
                    <SkeletonBlock className="h-4 w-20 rounded-full" />
                  </div>
                  <SkeletonBlock className="h-4 w-full" />
                  <SkeletonBlock className="h-4 w-5/6" />
                  <SkeletonBlock className="h-11 w-32 rounded-full" />
                </div>
              </article>
            ))}
          </section>

          <aside className="order-first lg:order-none">
            <div className="sticky top-20 min-h-[460px] overflow-hidden rounded-[2rem] bg-zinc-100 lg:min-h-[calc(100vh-7rem)]">
              <SkeletonBlock className="h-full min-h-[460px] w-full rounded-[2rem]" />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export const BrandDetailSkeleton = () => {
  return (
    <main className="mt-14 bg-white text-zinc-950">
      <section className="grid min-h-[540px] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col justify-between px-5 py-8 sm:px-8 lg:px-10">
          <div>
            <SkeletonBlock className="h-4 w-28 rounded-full" />
            <div className="mt-16 space-y-5">
              <SkeletonBlock className="h-4 w-32 rounded-full" />
              <SkeletonBlock className="h-16 w-full max-w-md" />
              <SkeletonBlock className="h-5 w-full max-w-xl" />
              <SkeletonBlock className="h-5 w-4/5 max-w-lg" />
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-zinc-200 pt-6 text-sm sm:grid-cols-3">
            <SkeletonBlock className="h-16 w-full" />
            <SkeletonBlock className="h-16 w-full" />
            <SkeletonBlock className="h-16 w-full" />
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden bg-zinc-100">
          <SkeletonBlock className="h-full min-h-[420px] w-full rounded-none" />
        </div>
      </section>

      <section className="border-t border-zinc-200 px-5 py-10 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <SkeletonBlock className="h-4 w-24 rounded-full" />
            <SkeletonBlock className="h-10 w-64" />
          </div>
          <SkeletonBlock className="h-4 w-40 rounded-full" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <article key={index} className="space-y-4">
              <SkeletonBlock className="aspect-[4/5] w-full rounded-[1.75rem]" />
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-3">
                  <SkeletonBlock className="h-5 w-3/4" />
                  <SkeletonBlock className="h-4 w-full" />
                  <SkeletonBlock className="h-4 w-5/6" />
                </div>
                <SkeletonBlock className="h-4 w-16 rounded-full" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};
