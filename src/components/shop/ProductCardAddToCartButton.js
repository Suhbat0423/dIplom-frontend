"use client";

import { useState } from "react";
import { addCartItem } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import {
  getProductSizeStock,
  normalizeProductSizes,
} from "@/utils/productSizes";

const getDefaultSize = (product) => {
  const sizes = normalizeProductSizes(product.sizes);
  const sizeStock = getProductSizeStock(product);

  for (const size of sizes) {
    if (Number(sizeStock[size] || 0) > 0) {
      return size;
    }
  }

  return "";
};

const ProductCardAddToCartButton = ({ product }) => {
  const { token, role } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const sizes = normalizeProductSizes(product.sizes);
  const defaultSize = getDefaultSize(product);
  const inStock = sizes.length > 0 ? Boolean(defaultSize) : Number(product.stock || 0) > 0;

  const handleAddToCart = async () => {
    if (!token) {
      setMessage("Sign in before adding items to your cart.");
      return;
    }

    if (role !== "user") {
      setMessage("Only customer accounts can use the cart.");
      return;
    }

    if (!inStock) {
      setMessage("This item is currently sold out.");
      return;
    }

    setLoading(true);
    setMessage("");

    const result = await addCartItem(token, {
      productId: product._id || product.id,
      quantity: 1,
      name: product.name,
      imageUrl: product.imageUrl || product.image || "",
      price: Number(product.price || 0),
      storeId: product.storeId,
      ...(defaultSize ? { size: defaultSize } : {}),
    });

    setLoading(false);

    if (!result.success) {
      setMessage(result.message || "Failed to add item to cart.");
      return;
    }

    setMessage("Added to cart.");
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={loading || !inStock}
        className="w-full border border-zinc-950 bg-zinc-950 px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-zinc-950 disabled:cursor-not-allowed disabled:border-zinc-300 disabled:bg-zinc-200 disabled:text-zinc-500"
      >
        {loading ? "Adding..." : inStock ? "Add to Cart" : "Sold out"}
      </button>
      {message && (
        <p
          className={`text-xs ${
            message === "Added to cart." ? "text-emerald-700" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default ProductCardAddToCartButton;
