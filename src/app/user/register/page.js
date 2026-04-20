"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/api";
import Input from "@/components/ui/Input";
import UserAuthShell from "@/components/user/UserAuthShell";
import { STORAGE_KEYS } from "@/config/constants";
import { useAuth } from "@/hooks/useAuth";
import { setStorageItem } from "@/utils/storage";

const UserRegisterPage = () => {
  const router = useRouter();
  const auth = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!username.trim() || !email.trim() || !password) {
      setError("Username, email, and password are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const registerResult = await registerUser(username.trim(), email.trim(), password);

    if (!registerResult.success) {
      setLoading(false);
      setError(registerResult.message || "Unable to create account.");
      return;
    }

    const loginResult = await loginUser(email.trim(), password);
    setLoading(false);

    if (!loginResult.success) {
      router.push("/user");
      return;
    }

    const token = loginResult.data?.token;
    if (token) {
      auth.login(token);
    }

    if (loginResult.data?.user && typeof window !== "undefined") {
      setStorageItem(STORAGE_KEYS.USER, JSON.stringify(loginResult.data.user));
    }

    router.push("/shops");
  };

  return (
    <UserAuthShell
      mode="register"
      title="Create account"
      subtitle="Join High End to save carts, orders, and favorite brands."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          placeholder="yourname"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
            setError("");
          }}
          required
        />

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
            placeholder="At least 6 characters"
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

        <Input
          label="Confirm password"
          type={showPassword ? "text" : "password"}
          placeholder="Repeat password"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            setError("");
          }}
          required
        />

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
          {loading ? "Creating..." : "Create account"}
        </button>

        <p className="text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/user" className="font-semibold text-zinc-950 underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </form>
    </UserAuthShell>
  );
};

export default UserRegisterPage;
