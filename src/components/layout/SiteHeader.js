import Link from "next/link";
import { Cart, Search, User } from "@/assets/icons";
import AnimatedLogo from "@/components/layout/AnimatedLogo";

const navItems = [
  { label: "Shop", href: "/shops" },
  { label: "Brands", href: "/brands" },
  { label: "Sale", href: "/sale" },
  { label: "About", href: "/about" },
];

const actionItems = [
  { label: "Search", href: "/search", Icon: Search },
  { label: "Cart", href: "/cart", Icon: Cart },
  { label: "User", href: "/user", Icon: User },
];

const SiteHeader = ({ scrollY = 0, variant = "solid" }) => {
  const isTransparent = variant === "transparent";
  const containerClass = isTransparent
    ? "bg-transparent text-white hover:bg-white hover:text-black"
    : "border-b border-gray-300 bg-white text-black shadow-sm";

  return (
    <header
      className={`fixed left-0 top-0 flex h-12 w-full items-center justify-between px-20 transition-colors duration-300 ${containerClass}`}
      style={{ zIndex: 100 }}
    >
      <AnimatedLogo scrollY={scrollY} animated={isTransparent} />
      <h1 className={isTransparent ? "text-transparent hover:text-black" : "sr-only"}>
        High End®
      </h1>

      <nav aria-label="Main navigation">
        <ul className={`flex gap-6 ${isTransparent ? "mx-auto" : "ml-[-38px]"}`}>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link className="hover:text-gray-600" href={item.href}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Account navigation">
        <ul className="flex gap-6">
          {actionItems.map(({ label, href, Icon }) => (
            <li key={href}>
              <Link className="hover:text-gray-600" href={href} aria-label={label}>
                <Icon />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default SiteHeader;
