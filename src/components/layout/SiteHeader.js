"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Cart, Search, User } from "@/assets/icons";
import AnimatedLogo from "@/components/layout/AnimatedLogo";
import { useAuth } from "@/hooks/useAuth";
import { getDefaultRedirectForRole, getUserProfilePath } from "@/utils/auth";

const navItems = [
  { label: "Shop", href: "/shops" },
  { label: "Brands", href: "/brands" },
  { label: "About", href: "/about" },
];

const SiteHeader = ({ scrollY = 0, variant = "solid" }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const searchInputDefault = pathname === "/search" ? searchParams.get("q") || "" : "";

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const normalized = String(formData.get("q") || "").trim();
    router.push(normalized ? `/search?q=${encodeURIComponent(normalized)}` : "/search");
  };

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

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
            <input
              key={`transparent-${pathname}-${searchInputDefault}`}
              name="q"
              type="search"
              defaultValue={searchInputDefault}
              placeholder="Search"
              className="h-10 w-44 rounded-full border border-white/25 bg-white/10 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-white/70 focus:border-white focus:bg-white/15"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/75">
              <Search size={18} />
            </span>
          </form>
          <Link className="md:hidden hover:text-gray-600" href="/search">
            <Search />
          </Link>

          <ul className="flex gap-6">
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

      <div className="flex items-center gap-6">
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
          <input
            key={`solid-${pathname}-${searchInputDefault}`}
            name="q"
            type="search"
            defaultValue={searchInputDefault}
            placeholder="Search"
            className="h-10 w-44 rounded-full border border-zinc-300 bg-zinc-50 pl-10 pr-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-500 focus:border-zinc-950 focus:bg-white"
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            <Search size={18} />
          </span>
        </form>
        <Link className="md:hidden" href="/search">
          <Search />
        </Link>

        <ul className="flex gap-6">
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
    </div>
  );
};

export default SiteHeader;
