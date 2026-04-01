"use client";

import { usePathname } from "next/navigation";
import HeaderConst from "./HeaderConst";

export default function HeaderWrapper() {
  const pathname = usePathname();

  if (
    pathname === "/" ||
    pathname === "/admin" ||
    pathname.startsWith("/shop")
  ) {
    return null;
  }

  return <HeaderConst />;
}
