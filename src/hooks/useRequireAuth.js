import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AUTH_ROLES } from "@/config/constants";
import { useAuth } from "@/hooks/useAuth";
import {
  getDefaultRedirectForRole,
  getLoginPathForRole,
} from "@/utils/auth";

export const useRequireAuth = ({
  requiredRole,
  requiredStoreId = null,
} = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const currentPath = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;
  const isRoleAllowed = !requiredRole || auth.role === requiredRole;
  const isStoreAllowed =
    !requiredStoreId || !auth.storeId || String(auth.storeId) === String(requiredStoreId);
  const isAuthorized = auth.isAuthenticated && isRoleAllowed && isStoreAllowed;

  useEffect(() => {
    if (auth.loading) {
      return;
    }

    if (!auth.isAuthenticated) {
      router.replace(
        getLoginPathForRole(requiredRole === AUTH_ROLES.SHOP ? AUTH_ROLES.SHOP : AUTH_ROLES.USER, currentPath),
      );
      return;
    }

    if (requiredRole && auth.role !== requiredRole) {
      router.replace(getDefaultRedirectForRole(auth.session));
      return;
    }

    if (requiredStoreId && auth.storeId && String(auth.storeId) !== String(requiredStoreId)) {
      router.replace(getDefaultRedirectForRole(auth.session));
    }
  }, [
    auth.isAuthenticated,
    auth.loading,
    auth.role,
    auth.session,
    auth.storeId,
    currentPath,
    requiredRole,
    requiredStoreId,
    router,
  ]);

  return {
    ...auth,
    isAuthorized,
  };
};
