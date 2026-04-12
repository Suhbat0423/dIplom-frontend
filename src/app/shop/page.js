"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginStore } from "@/api";
import AuthPageShell from "@/components/shop/AuthPageShell";
import Input from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

const Shop = () => {
  const router = useRouter();
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <AuthPageShell
      title={
        <>
          Welcome back, <em>Store</em>
        </>
      }
      subtitle="Sign in to your portal"
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Email"
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-[38px] flex items-center gap-1 text-xs text-zinc-500 transition hover:text-zinc-700"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {errorMessage && (
        <p className="text-sm font-semibold text-red-500">{errorMessage}</p>
      )}

      <button
        type="button"
        onClick={async () => {
          setErrorMessage("");

          if (!email || !password) {
            setErrorMessage("Invalid email or password");
            return;
          }

          const result = await loginStore(email, password);
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
            auth.login(token);
          }

          const storeId = result.data?.store?._id || result.data?.store?.id;
          if (storeId) {
            router.push(`/shop/${storeId}`);
            return;
          }

          router.push("/admin");
        }}
        className="rounded-lg bg-black py-3 text-sm font-medium tracking-wide text-white transition hover:bg-zinc-800"
      >
        Sign in to portal
      </button>
    </AuthPageShell>
  );
};

export default Shop;
