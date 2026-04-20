"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/api";
import Input from "@/components/ui/Input";
import UserAuthShell from "@/components/user/UserAuthShell";
import { useAuth } from "@/hooks/useAuth";
import { setStorageItem } from "@/utils/storage";
import { STORAGE_KEYS } from "@/config/constants";

const UserLoginPage = () => {
  const router = useRouter();
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    const result = await loginUser(email.trim(), password);
    setLoading(false);

    if (!result.success) {
      setError(result.message || "Unable to sign in.");
      return;
    }

    const token = result.data?.token;
    if (token) {
      auth.login(token);
    }

    if (result.data?.user && typeof window !== "undefined") {
      setStorageItem(STORAGE_KEYS.USER, JSON.stringify(result.data.user));
    }

    const nextUrl =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("next")
        : "";

    router.push(nextUrl || "/shops");
  };

  return (
    <UserAuthShell
      mode="login"
      title="Welcome back"
      subtitle="Sign in to continue shopping and manage your cart."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError("");
          }}
          required
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-[34px] text-xs font-medium text-zinc-500 transition hover:text-zinc-900"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-lg bg-zinc-950 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-center text-sm text-zinc-500">
          New to High End?{" "}
          <Link href="/user/register" className="font-semibold text-zinc-950 underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </form>
    </UserAuthShell>
  );
};

export default UserLoginPage;
