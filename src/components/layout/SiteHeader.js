"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cart, Search, User } from "@/assets/icons";
import AnimatedLogo from "@/components/layout/AnimatedLogo";
import { useAuth } from "@/hooks/useAuth";
import { getDefaultRedirectForRole, getUserProfilePath } from "@/utils/auth";

const navItems = [
  { label: "Shop", href: "/shops" },
  { label: "Brands", href: "/brands" },
  { label: "Sale", href: "/sale" },
  { label: "About", href: "/about" },
];

const SiteHeader = ({ scrollY = 0, variant = "solid" }) => {
  const pathname = usePathname();
  const auth = useAuth();
  const isTransparent = variant === "transparent";
  const [windowScrollY, setWindowScrollY] = useState(0);
  const accountHref = auth.isUser
    ? getUserProfilePath()
    : auth.isAuthenticated
      ? getDefaultRedirectForRole(auth.session)
      : "/user";
  const cartHref = auth.isShop
    ? getDefaultRedirectForRole(auth.session)
    : "/cart";
  const getNavClass = (href, activeClass, inactiveClass = "") => {
    const isActive = pathname === href || pathname.startsWith(`${href}/`);
    return `${inactiveClass} ${
      isActive ? activeClass : ""
    } transition-colors duration-200`;
  };
  const animatedScrollY = scrollY > 0 ? scrollY : windowScrollY;

  useEffect(() => {
    if (!isTransparent) return undefined;

    const handleScroll = () => {
      setWindowScrollY(window.scrollY || 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isTransparent]);

  if (isTransparent) {
    return (
      <div
        className="flex w-full h-14 bg-transparent justify-between px-8 items-center fixed top-0 left-0 text-white hover:bg-white hover:text-black transition-colors duration-300"
        style={{ zIndex: 100 }}
      >
        <AnimatedLogo scrollY={animatedScrollY} />
        <h1 className="text-transparent hover:text-black">High End®</h1>
        <ul className="flex gap-6 mx-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className={getNavClass(
                item.href,
                "underline underline-offset-4 decoration-2",
                "hover:text-gray-600",
              )}
              href={item.href}
            >
              <li>{item.label}</li>
            </Link>
          ))}
        </ul>

        <ul className="flex gap-6">
          <Link className="hover:text-gray-600" href="/search">
            <li>
              <Search />
            </li>
          </Link>
          <Link className="hover:text-gray-600" href={cartHref}>
            <li>
              <Cart />
            </li>
          </Link>
          <li>
            <Link className="hover:text-gray-600" href={accountHref}>
              <User />
            </Link>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div
      className="flex w-full h-14 bg-white justify-between px-8 items-center border-b-1 border-gray-300 fixed top-0 left-0 text-shadow-gray-700 shadow-m"
      style={{ zIndex: 100 }}
    >
      <div
        className="font-bold text-xl text-black "
        style={{ fontFamily: "Georgia, serif" }}
      >
        <Link href="/">High® End</Link>
      </div>

      <ul className="flex gap-6 ml-[-38px]">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <li
              className={getNavClass(
                item.href,
                "underline underline-offset-4 decoration-2",
                "hover:text-gray-500",
              )}
            >
              {item.label}
            </li>
          </Link>
        ))}
      </ul>

      <ul className="flex gap-6">
        <Link href="/search">
          <li>
            <Search />
          </li>
        </Link>
        <Link href={cartHref}>
          <li>
            <Cart />
          </li>
        </Link>
        <li>
          <Link href={accountHref}>
            <User />
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SiteHeader;
