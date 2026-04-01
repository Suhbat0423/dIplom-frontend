"use client";

import { usePathname, useRouter } from "next/navigation";

const LoginRegisterButton = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isLogin = pathname === "/shop";
  const isRegister = pathname === "/shop/register";

  return (
    <div className="flex h-12 rounded-lg p-0.5 bg-white">
      <button
        type="button"
        onClick={() => router.push("/shop")}
        className={`w-full rounded-md transition ${
          isLogin
            ? "bg-black text-white"
            : "bg-white text-black hover:bg-gray-200"
        }`}
      >
        Login
      </button>
      <button
        type="button"
        onClick={() => router.push("/shop/register")}
        className={`w-full rounded-md transition ${
          isRegister
            ? "bg-black text-white"
            : "bg-white text-black hover:bg-gray-200"
        }`}
      >
        Register
      </button>
    </div>
  );
};

export default LoginRegisterButton;
