"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerStore } from "@/api";
import AuthPageShell from "@/components/shop/AuthPageShell";
import Input from "@/components/ui/Input";
import {
  isFieldEmpty,
  passwordsMatch,
} from "@/utils/validators";

const ShopRegister = () => {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  return (
    <AuthPageShell title="Create Account" subtitle="Register as a shop manager">
      <div className="flex flex-col gap-4">
        <Input
          label="Brand"
          placeholder="Brand name"
          value={brand}
          onChange={(event) => setBrand(event.target.value)}
        />
        <Input
          label="Email"
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Input
          label="Verify password"
          type="password"
          placeholder="Verify password"
          value={verifyPassword}
          onChange={(event) => setVerifyPassword(event.target.value)}
        />
      </div>

      {errorMessage && (
        <p className="text-sm font-medium text-red-500">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-sm font-medium text-green-500">{successMessage}</p>
      )}

      <button
        type="button"
        className="rounded-lg bg-black py-3 text-sm font-medium tracking-wide text-white transition hover:bg-zinc-800"
        onClick={async () => {
          setErrorMessage("");
          setSuccessMessage("");

          if (
            [brand, email, password, verifyPassword].some((value) =>
              isFieldEmpty(value),
            )
          ) {
            setErrorMessage("Please fill in all fields.");
            return;
          }

          if (!passwordsMatch(password, verifyPassword)) {
            setErrorMessage("Passwords do not match.");
            return;
          }

          const result = await registerStore(brand, email, password);
          if (result?.success === false) {
            setErrorMessage(result.message || "Registration failed.");
            return;
          }

          setSuccessMessage("Account created successfully.");
          if (result?.data?.store?._id) {
            router.push(`/shop/${result.data.store._id}`);
          } else {
            router.push("/shop");
          }
        }}
      >
        Create Account
      </button>
    </AuthPageShell>
  );
};

export default ShopRegister;
