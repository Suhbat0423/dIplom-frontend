"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "@/components/layout/SiteHeader";

const headerlessRoutes = ["/", "/admin"];

export default function HeaderWrapper() {
  const pathname = usePathname();
  const hideHeader =
    headerlessRoutes.includes(pathname) ||
    pathname === "/shop" ||
    pathname.startsWith("/shop/");

  return hideHeader ? null : <SiteHeader />;
}
