"use client";

import Link from "next/link";
import { Cart, Search, User } from "../assets/icons";

const HeaderConst = () => {
  return (
    <div
      className="flex w-full h-12 bg-white justify-between px-20 items-center border-b-1 border-gray-300 fixed top-0 left-0 text-black shadow-m"
      style={{ zIndex: 100 }}
    >
      {/* Logo */}
      <div
        className="font-bold text-xl text-black "
        style={{ fontFamily: "Georgia, serif" }}
      >
        <Link href="/">High® End</Link>
      </div>

      {/* Nav Links */}
      <ul className="flex gap-6 ml-[-38px]">
        <Link href="/shops">
          <li className="hover:text-gray-500 transition-colors duration-200">
            Shop
          </li>
        </Link>
        <Link href="/brands">
          <li className="hover:text-gray-500 transition-colors duration-200">
            Brands
          </li>
        </Link>
        <Link href="/sale">
          <li className="hover:text-gray-500 transition-colors duration-200">
            Sale
          </li>
        </Link>
        <Link href="/about">
          <li className="hover:text-gray-500 transition-colors duration-200">
            About
          </li>
        </Link>
      </ul>

      {/* Icons */}
      <ul className="flex gap-6">
        <Link href="/search">
          <li>
            <Search />
          </li>
        </Link>
        <Link href="/cart">
          <li>
            <Cart />
          </li>
        </Link>
        <li>
          <Link href="/user">
            <User />
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default HeaderConst;
