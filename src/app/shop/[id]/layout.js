"use client";

import StoreSidebar from "@/components/layout/StoreSidebar";
import ShopHeader from "@/components/layout/ShopHeader";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const DashboardLayout = ({ children }) => {
  useRequireAuth();

  return (
    <div className="flex w-full min-h-screen bg-zinc-50">
      <StoreSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <ShopHeader />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
