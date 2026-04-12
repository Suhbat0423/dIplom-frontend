import { useEffect, useState } from "react";
import { getStoreInfo } from "@/api";

export const useStoreInfo = (storeId, token) => {
  const [storeName, setStoreName] = useState("Store");
  const [loading, setLoading] = useState(Boolean(token && storeId));

  useEffect(() => {
    if (!token || !storeId) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const fetchStoreInfo = async () => {
      setLoading(true);

      try {
        const result = await getStoreInfo(storeId, token);

        if (mounted && result?.success) {
          setStoreName(result.data?.name || "Store");
        }
      } catch (error) {
        console.error("Store info error:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchStoreInfo();

    return () => {
      mounted = false;
    };
  }, [storeId, token]);

  return { storeName, loading };
};
