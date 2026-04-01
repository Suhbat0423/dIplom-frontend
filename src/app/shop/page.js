"use client";

import Input from "@/components/input";
import LeftBar from "./components/LeftBar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../apis/store/storeLogin";
import LoginRegisterButton from "./components/LoginRegisterButton";

const Shop = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div className="flex w-full h-screen">
      {/* LEFT — dark panel */}
      <LeftBar />

      {/* RIGHT — light panel */}
      <div className="w-1/2 bg-[#f8f7f5] px-40 flex flex-col justify-center gap-6">
        {/* Toggle */}
        <LoginRegisterButton />

        {/* Heading */}
        <div>
          <h2 className="font-serif text-3xl text-zinc-900">
            Welcome back, <em>Store</em>
          </h2>
          <p className="text-zinc-400 text-sm mt-1">Sign in to your portal</p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <Input
            label="Email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="flex items-center gap-1 absolute right-3 top-[38px] text-xs text-zinc-500 hover:text-zinc-700 transition"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {errorMessage && (
          <h1 className="text-sm font-semibold text-red-500">{errorMessage}</h1>
        )}

        {/* Button */}
        <button
          onClick={async () => {
            setErrorMessage("");

            if (!email || !password) {
              setErrorMessage("invalid email or password");
              return;
            }

            const result = await login(email, password);
            if (!result.success) {
              const message = result.message || "Wrong email or wrong password";
              const normalized = /password/i.test(message)
                ? "Wrong password"
                : /email|mail/i.test(message)
                  ? "Wrong email"
                  : "Wrong email or wrong password";
              setErrorMessage(normalized);
              return;
            }

            const token = result.data?.token;
            if (token) {
              window.localStorage.setItem("token", token);
            }

            const storeId = result.data?.store?._id || result.data?.store?.id;
            if (storeId) {
              router.push(`/shop/${storeId}`);
              return;
            }

            router.push("/admin");
          }}
          className="bg-black text-white rounded-lg py-3 text-sm font-medium tracking-wide hover:bg-zinc-800 transition"
        >
          Sign in to portal
        </button>
      </div>
    </div>
  );
};

export default Shop;
