const SkeletonBlock = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 bg-[length:200%_100%] ${className}`}
    />
  );
};

export default function Loading() {
  return (
    <main className="mt-14 min-h-screen bg-stone-50 text-zinc-950">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_320px] lg:px-10 lg:py-14">
          <div className="space-y-5">
            <SkeletonBlock className="h-4 w-32 rounded-full" />
            <SkeletonBlock className="h-14 w-full max-w-3xl" />
            <SkeletonBlock className="h-14 w-4/5 max-w-2xl" />
            <SkeletonBlock className="h-5 w-full max-w-2xl" />
            <SkeletonBlock className="h-5 w-2/3 max-w-xl" />

            <div className="flex gap-3 pt-4">
              <SkeletonBlock className="h-12 w-36 rounded-full" />
              <SkeletonBlock className="h-12 w-40 rounded-full" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <SkeletonBlock className="h-28 w-full" />
            <SkeletonBlock className="h-28 w-full" />
            <SkeletonBlock className="h-28 w-full" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="flex items-end justify-between gap-6">
          <div className="space-y-4">
            <SkeletonBlock className="h-4 w-28 rounded-full" />
            <SkeletonBlock className="h-10 w-72" />
          </div>
          <SkeletonBlock className="hidden h-4 w-32 rounded-full md:block" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <article key={index} className="space-y-4">
              <SkeletonBlock className="aspect-[4/5] w-full rounded-[1.75rem]" />
              <SkeletonBlock className="h-4 w-24 rounded-full" />
              <SkeletonBlock className="h-7 w-3/4" />
              <div className="flex items-center justify-between gap-4">
                <SkeletonBlock className="h-4 w-20 rounded-full" />
                <SkeletonBlock className="h-4 w-16 rounded-full" />
              </div>
              <SkeletonBlock className="h-11 w-full rounded-full" />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
