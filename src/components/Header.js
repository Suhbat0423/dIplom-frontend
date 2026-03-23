import Link from "next/link";
import { Cart, Search, User } from "../assets/icons";
import AnimatedLogo from "./AnimatedLogo";

const Header = ({ scrollY = 0 }) => {
  return (
    <div
      className="flex w-full h-12 bg-transparent justify-between px-20 items-center fixed top-0 left-0 text-white hover:bg-white hover:text-black transition-colors duration-300"
      style={{ zIndex: 100 }}
    >
      <AnimatedLogo scrollY={scrollY} />
      <h1 className="text-transparent hover:text-black">High End®</h1>
      {/* Nav Links */}
      <ul className="flex gap-6 mx-auto">
        <Link className="hover:text-gray-600" href="/shop">
          <li>Shop</li>
        </Link>
        <Link className="hover:text-gray-600" href="/brands">
          <li>Brands</li>
        </Link>
        <Link className="hover:text-gray-600" href="/sale">
          <li>Sale</li>
        </Link>
        <Link className="hover:text-gray-600" href="/about">
          <li>About</li>
        </Link>
      </ul>

      {/* Icons */}
      <ul className="flex gap-6">
        <Link className="hover:text-gray-600" href="/search">
          <li>
            <Search />
          </li>
        </Link>
        <Link className="hover:text-gray-600" href="/cart">
          <li>
            <Cart />
          </li>
        </Link>
        <li>
          <Link className="hover:text-gray-600" href="/user">
            <User />
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Header;
