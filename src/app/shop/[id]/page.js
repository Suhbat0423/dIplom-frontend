"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const StorePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { loading, isAuthenticated } = useRequireAuth();

  useEffect(() => {
    if (loading || !isAuthenticated || !id) {
      return;
    }

    router.replace(`/shop/${id}/dashboard`);
  }, [id, isAuthenticated, loading, router]);

  return null;
};

export default StorePage;
