"use client";

import { usePathname, useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useStoreInfo } from "@/hooks/useStoreInfo";
import { StoreIcon } from "@/assets/icons";

const getMenuItems = (storeId) => [
  { label: "Dashboard", path: `/shop/${storeId}/dashboard` },
  { label: "Profile", path: `/shop/${storeId}/profile` },
  { label: "Products", path: `/shop/${storeId}/products` },
  { label: "Create Product", path: `/shop/${storeId}/create-product` },
  { label: "Orders", path: `/shop/${storeId}/orders` },
  { label: "Settings", path: `/shop/${storeId}/settings` },
];

const StoreSidebar = () => {
  const { id } = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const { token, logout } = useAuth();
  const { storeName, loading } = useStoreInfo(id, token);
  const menuItems = getMenuItems(id);

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col bg-zinc-900 text-white">
      <div className="border-b border-zinc-700 p-6">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-700">
            <StoreIcon />
          </div>
          <div className="flex flex-col">
            <h1 className="truncate text-xl font-bold">
              {loading ? "Loading..." : storeName}
            </h1>
            <p className="text-xs text-zinc-400">Admin panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4" aria-label="Store dashboard">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <li key={item.path}>
                <button
                  type="button"
                  onClick={() => router.push(item.path)}
                  className={`w-full rounded-lg px-4 py-3 text-left transition-all ${
                    isActive
                      ? "bg-blue-600 font-medium text-white"
                      : "text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-zinc-700 p-4">
        <button
          type="button"
          onClick={() => {
            logout();
            router.replace("/shop");
          }}
          className="w-full rounded-lg bg-zinc-700 px-4 py-2 text-sm transition hover:bg-zinc-600"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default StoreSidebar;
