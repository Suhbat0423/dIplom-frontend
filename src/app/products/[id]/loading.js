const StatBlock = () => {
  return (
    <div className="space-y-2">
      <div className="h-3 w-16 animate-pulse rounded bg-zinc-200" />
      <div className="h-5 w-24 animate-pulse rounded bg-zinc-200" />
    </div>
  );
};

export default function ProductDetailLoading() {
  return (
    <main className="mt-14 bg-white text-zinc-950">
      <section className="grid min-h-[calc(100vh-3.5rem)] lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
        <div className="bg-zinc-100">
          <div className="min-h-[560px] animate-pulse bg-zinc-200 lg:min-h-[calc(100vh-3.5rem)]" />
        </div>

        <div className="flex flex-col justify-between px-5 py-8 sm:px-8 lg:px-12">
          <div>
            <div className="flex gap-3">
              <div className="h-4 w-16 animate-pulse rounded bg-zinc-200" />
              <div className="h-4 w-4 animate-pulse rounded bg-zinc-200" />
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
            </div>

            <div className="mt-10 space-y-5">
              <div className="h-4 w-28 animate-pulse rounded bg-zinc-200" />
              <div className="h-16 w-3/4 animate-pulse rounded bg-zinc-200" />
              <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />
              <div className="h-8 w-24 animate-pulse rounded bg-zinc-200" />
              <div className="space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200" />
                <div className="h-4 w-4/6 animate-pulse rounded bg-zinc-200" />
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-9 w-20 animate-pulse rounded-full bg-zinc-200" />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 border-y border-zinc-200 py-5 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <StatBlock key={index} />
                ))}
              </div>
              <div className="space-y-4 rounded-3xl border border-zinc-200 p-5">
                <div className="h-5 w-32 animate-pulse rounded bg-zinc-200" />
                <div className="h-12 w-full animate-pulse rounded-2xl bg-zinc-200" />
                <div className="h-12 w-full animate-pulse rounded-2xl bg-zinc-200" />
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-4 border-t border-zinc-200 pt-6 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-4 w-32 animate-pulse rounded bg-zinc-200" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
