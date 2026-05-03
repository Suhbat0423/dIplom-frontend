"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AUTH_ROLES } from "@/config/constants";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getShopDashboardPath } from "@/utils/auth";

const ShopDashboardEntryPage = () => {
  const router = useRouter();
  const auth = useRequireAuth({ requiredRole: AUTH_ROLES.SHOP });

  useEffect(() => {
    if (auth.loading || !auth.isAuthorized) {
      return;
    }

    const dashboardPath = getShopDashboardPath(auth.session);

    if (dashboardPath) {
      router.replace(dashboardPath);
      return;
    }

    auth.logout();
    router.replace("/shop");
  }, [auth, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <p className="text-sm text-zinc-500">Opening shop dashboard...</p>
    </main>
  );
};

export default ShopDashboardEntryPage;
