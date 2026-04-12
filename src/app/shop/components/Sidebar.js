"use client";

import { usePathname, useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { GetStoreInfo } from "@/apis/store/login";

const Sidebar = () => {
  const { id } = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const { token } = useAuth();

  const [storeName, setStoreName] = useState("Store");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    let mounted = true;

    const fetchStoreInfo = async () => {
      try {
        const result = await GetStoreInfo(token);

        if (mounted && result?.success) {
          setStoreName(result.data?.name || "Store");
        }
      } catch (error) {
        console.error("Store info error:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchStoreInfo();

    return () => {
      mounted = false;
    };
  }, [token]);

  const menuItems = [
    { label: "Dashboard", path: `/shop/${id}/dashboard` },
    { label: "Profile", path: `/shop/${id}/profile` },
    { label: "Products", path: `/shop/${id}/products` },
    { label: "Create Product", path: `/shop/${id}/create-product` },
    { label: "Orders", path: `/shop/${id}/orders` },
    { label: "Settings", path: `/shop/${id}/settings` },
  ];

  const isActive = (path) => pathname === path;

  return (
    <div className="w-64 bg-zinc-900 text-white h-screen flex flex-col sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-zinc-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center">
            📦
          </div>

          <h1 className="text-xl font-bold truncate">
            {loading ? "Loading..." : storeName}
          </h1>
        </div>

        <p className="text-xs text-zinc-400">Store ID: {id}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => router.push(item.path)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? "bg-blue-600 text-white font-medium"
                    : "text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-700">
        <button onClick={} className="w-full px-4 py-2 text-sm bg-zinc-700 hover:bg-zinc-600 rounded-lg transition">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
