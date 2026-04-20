"use client";

import { useState } from "react";
import Link from "next/link";
import { addCartItem } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import {
  getProductSizeStock,
  getTotalSizeStock,
  normalizeProductSizes,
} from "@/utils/productSizes";

const ProductPurchasePanel = ({ product }) => {
  const { token } = useAuth();
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const sizes = normalizeProductSizes(product.sizes);
  const sizeStock = getProductSizeStock(product);
  const selectedSizeStock = selectedSize
    ? Number(sizeStock[selectedSize] || 0)
    : Number(product.stock || 0);
  const maxQuantity = sizes.length > 0 ? selectedSizeStock : Number(product.stock || 0);
  const inStock =
    sizes.length > 0 ? getTotalSizeStock(sizeStock) > 0 : Number(product.stock || 0) > 0;

  const increaseQuantity = () => {
    setQuantity((current) => Math.min(current + 1, Math.max(1, maxQuantity)));
    setMessage("");
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(current - 1, 1));
    setMessage("");
  };

  const handleAddToBag = async () => {
    if (!inStock) {
      setMessage("This product is currently sold out.");
      return;
    }

    if (sizes.length > 0 && !selectedSize) {
      setMessage("Choose a size before adding this product.");
      return;
    }

    if (sizes.length > 0 && selectedSizeStock <= 0) {
      setMessage("Selected size is out of stock.");
      return;
    }

    if (quantity > maxQuantity) {
      setMessage(`Only ${maxQuantity} item${maxQuantity === 1 ? "" : "s"} available for ${selectedSize}.`);
      return;
    }

    if (!token) {
      setMessage("Sign in before adding this product to your cart.");
      return;
    }

    setLoading(true);
    setMessage("");

    const result = await addCartItem(token, {
      productId: product._id || product.id,
      quantity,
      name: product.name,
      imageUrl: product.imageUrl || product.image || "",
      price: Number(product.price || 0),
      storeId: product.storeId,
      ...(selectedSize ? { size: selectedSize } : {}),
    });

    setLoading(false);

    if (!result.success) {
      setMessage(result.message || "Failed to add this product to your cart.");
      return;
    }

    setMessage(`${product.name} added to cart.`);
  };

  return (
    <div className="space-y-6">
      {sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-900">Size</p>
            <button type="button" className="text-sm text-zinc-500 hover:text-zinc-950">
              Size guide
            </button>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                disabled={!inStock || Number(sizeStock[size] || 0) <= 0}
                onClick={() => {
                  setSelectedSize(size);
                  setQuantity(1);
                  setMessage("");
                }}
                aria-pressed={selectedSize === size}
                className={`h-12 rounded-lg border text-sm font-semibold transition disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-300 ${
                  Number(sizeStock[size] || 0) <= 0
                    ? "cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-300"
                    : selectedSize === size
                      ? "border-zinc-950 bg-zinc-950 text-white shadow-sm"
                      : "border-zinc-300 bg-white text-zinc-900 hover:border-zinc-950"
                }`}
              >
                <span>{size}</span>
                <span className="ml-1 text-[11px] font-medium opacity-70">
                  {sizeStock[size] || 0}
                </span>
              </button>
            ))}
          </div>
          {selectedSize && (
            <p className="mt-2 text-xs font-medium text-zinc-500">
              {selectedSize} selected. {selectedSizeStock} available.
            </p>
          )}
        </div>
      )}

      <div>
        <p className="text-sm font-medium text-zinc-900">Quantity</p>
        <div className="mt-3 flex h-12 w-36 items-center justify-between rounded-lg border border-zinc-300 bg-white">
          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={!inStock || quantity <= 1}
            className="h-full px-4 text-lg text-zinc-600 transition hover:text-zinc-950 disabled:text-zinc-300"
          >
            -
          </button>
          <span className="text-sm font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={increaseQuantity}
            disabled={!inStock || (sizes.length > 0 && !selectedSize) || quantity >= maxQuantity}
            className="h-full px-4 text-lg text-zinc-600 transition hover:text-zinc-950 disabled:text-zinc-300"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddToBag}
        disabled={!inStock || loading}
        className="h-14 w-full rounded-lg bg-zinc-950 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        {loading ? "Adding..." : inStock ? "Add to cart" : "Sold out"}
      </button>

      {message && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            message.includes("added")
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}{" "}
          {message.includes("added") && (
            <Link href="/cart" className="font-semibold underline underline-offset-4">
              View cart
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductPurchasePanel;
