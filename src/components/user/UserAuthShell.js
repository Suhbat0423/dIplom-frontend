import Link from "next/link";

const UserAuthShell = ({ mode, title, subtitle, children }) => {
  const tabs = [
    { label: "Login", href: "/user" },
    { label: "Register", href: "/user/register" },
  ];

  return (
    <main className="mt-14 min-h-[calc(100vh-3.5rem)] bg-zinc-50 text-zinc-950">
      <section className="grid min-h-[calc(100vh-3.5rem)] lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.8fr)]">
        <div className="hidden bg-zinc-950 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <Link href="/" className="font-serif text-5xl font-bold">
              High<span className="italic">®</span> End
            </Link>
            <div className="mt-20 max-w-xl">
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">
                Customer account
              </p>
              <h1 className="mt-4 text-6xl font-semibold tracking-tight">
                Curated fashion, saved to your account.
              </h1>
              <p className="mt-5 text-base leading-7 text-zinc-400">
                Keep your cart, orders, and favorite brands in one place.
              </p>
            </div>
          </div>

          <div className="grid gap-4 text-sm text-zinc-300">
            <p>Secure checkout with authenticated carts.</p>
            <p>Track orders from independent labels.</p>
            <p>Return to saved products anytime.</p>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid h-12 grid-cols-2 rounded-lg bg-zinc-100 p-1">
              {tabs.map((tab) => {
                const active = mode === tab.label.toLowerCase();

                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`flex items-center justify-center rounded-md text-sm font-semibold transition ${
                      active
                        ? "bg-zinc-950 text-white shadow-sm"
                        : "text-zinc-600 hover:text-zinc-950"
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-8">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                High End
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                {title}
              </h1>
              <p className="mt-2 text-sm leading-6 text-zinc-500">{subtitle}</p>
            </div>

            <div className="mt-6">{children}</div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default UserAuthShell;
