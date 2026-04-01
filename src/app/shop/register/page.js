"use client";

// shop.jsx
import Input from "@/components/input";
import LeftBar from "../components/LeftBar";
import LoginRegisterButton from "../components/LoginRegisterButton";
import { useState } from "react";
import { register } from "../../../apis/store/storeRegister";
import { useRouter } from "next/navigation";

const ShopRegister = () => {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  return (
    <div className="flex w-full h-screen">
      {/* LEFT — dark panel */}
      <LeftBar />

      {/* RIGHT — light panel */}
      <div className="w-1/2 bg-[#f8f7f5] px-40 flex flex-col justify-center gap-6">
        <LoginRegisterButton />

        {/* Heading */}
        <div>
          <h2 className="font-serif text-3xl text-zinc-900">Create Account</h2>
          <p className="text-zinc-400 text-sm mt-1">
            Register as a shop manager
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <Input
            label="Brand"
            placeholder="Brand name"
            value={brand}
            onChange={(e) => {
              setBrand(e.target.value);
            }}
          />
          <Input
            label="Email"
            placeholder="Email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Input
            label="Verify password"
            type="password"
            placeholder="Verify password"
            value={verifyPassword}
            onChange={(e) => {
              setVerifyPassword(e.target.value);
            }}
          />
        </div>

        {errorMessage && (
          <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-sm text-green-500 font-medium">{successMessage}</p>
        )}

        {/* Button */}
        <button
          className="bg-black text-white rounded-lg py-3 text-sm font-medium tracking-wide 
        hover:bg-zinc-800 transition"
          onClick={async () => {
            setErrorMessage("");
            setSuccessMessage("");

            if (!brand || !email || !password || !verifyPassword) {
              setErrorMessage("Please fill in all fields.");
              return;
            }

            if (password !== verifyPassword) {
              setErrorMessage("Passwords do not match.");
              return;
            }

            const result = await register(brand, email, password);
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
      </div>
    </div>
  );
};

export default ShopRegister;
