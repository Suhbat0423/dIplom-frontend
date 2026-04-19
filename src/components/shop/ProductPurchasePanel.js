"use client";

import { useState } from "react";

const sizes = ["XS", "S", "M", "L", "XL"];

const ProductPurchasePanel = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const inStock = Number(product.stock || 0) > 0;

  const increaseQuantity = () => {
    setQuantity((current) => Math.min(current + 1, Number(product.stock || 1)));
    setMessage("");
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(current - 1, 1));
    setMessage("");
  };

  const handleAddToBag = () => {
    if (!inStock) {
      setMessage("This product is currently sold out.");
      return;
    }

    if (!selectedSize) {
      setMessage("Choose a size before adding this product.");
      return;
    }

    setMessage(`${product.name} added to bag.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-900">Size</p>
          <button type="button" className="text-sm text-zinc-500 hover:text-zinc-950">
            Size guide
          </button>
        </div>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              disabled={!inStock}
              onClick={() => {
                setSelectedSize(size);
                setMessage("");
              }}
              className={`h-12 rounded-lg border text-sm font-semibold transition disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-300 ${
                selectedSize === size
                  ? "border-zinc-950 bg-zinc-950 text-white"
                  : "border-zinc-300 bg-white text-zinc-900 hover:border-zinc-950"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-zinc-900">Quantity</p>
        <div className="mt-3 flex h-12 w-36 items-center justify-between rounded-lg border border-zinc-300 bg-white">
          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={!inStock}
            className="h-full px-4 text-lg text-zinc-600 transition hover:text-zinc-950 disabled:text-zinc-300"
          >
            -
          </button>
          <span className="text-sm font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={increaseQuantity}
            disabled={!inStock || quantity >= Number(product.stock || 0)}
            className="h-full px-4 text-lg text-zinc-600 transition hover:text-zinc-950 disabled:text-zinc-300"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddToBag}
        disabled={!inStock}
        className="h-14 w-full rounded-lg bg-zinc-950 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        {inStock ? "Add to bag" : "Sold out"}
      </button>

      {message && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            message.includes("added")
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default ProductPurchasePanel;

