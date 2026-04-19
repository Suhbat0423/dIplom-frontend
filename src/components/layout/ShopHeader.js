import { Bell } from "@/assets/icons";

const ShopHeader = () => {
  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white px-8">
      <div className="w-full max-w-md">
        <input
          type="text"
          placeholder="Search products, orders, customers"
          className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 text-sm outline-none transition focus:border-zinc-400 focus:bg-white"
        />
      </div>

      <div className="flex items-center gap-6">
        <button
          type="button"
          className="text-sm font-medium text-zinc-600 transition hover:text-black"
        >
          <Bell />
        </button>
        <div className="flex h-10 items-center rounded-lg bg-zinc-100 px-4 text-sm font-semibold text-zinc-900">
          Shop admin
        </div>
      </div>
    </header>
  );
};

export default ShopHeader;
