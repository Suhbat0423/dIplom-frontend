"use client";

import StoreSidebar from "@/components/layout/StoreSidebar";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const DashboardLayout = ({ children }) => {
  useRequireAuth();

  return (
    <div className="flex w-full min-h-screen bg-zinc-50">
      <StoreSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default DashboardLayout;
