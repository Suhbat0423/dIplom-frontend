"use client";

import { usePathname, useRouter } from "next/navigation";

const authTabs = [
  { label: "Login", href: "/shop" },
  { label: "Register", href: "/shop/register" },
];

const AuthModeTabs = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex h-12 rounded-lg bg-white p-0.5">
      {authTabs.map((tab) => {
        const isActive = pathname === tab.href;

        return (
          <button
            key={tab.href}
            type="button"
            onClick={() => router.push(tab.href)}
            className={`w-full rounded-md transition ${
              isActive
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default AuthModeTabs;
