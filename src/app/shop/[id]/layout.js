"use client";

import { useParams } from "next/navigation";
import StoreSidebar from "@/components/layout/StoreSidebar";
import ShopHeader from "@/components/layout/ShopHeader";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { AUTH_ROLES } from "@/config/constants";

const DashboardLayout = ({ children }) => {
  const { id } = useParams();
  const auth = useRequireAuth({
    requiredRole: AUTH_ROLES.SHOP,
    requiredStoreId: id,
  });

  if (auth.loading || !auth.isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
        <p className="text-sm text-zinc-500">Checking dashboard access...</p>
      </div>
    );
  }

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
