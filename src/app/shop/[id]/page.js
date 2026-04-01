"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

const StorePage = ({ params }) => {
  const { id } = use(params);
  const router = useRouter();

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className=" flex w-full h-screen bg-red-300">
      <div className="w-64 p-4"> sidebar</div>
      <div className="w-full p-4 bg-red-500"> chart</div>
    </div>
  );
};

export default StorePage;
