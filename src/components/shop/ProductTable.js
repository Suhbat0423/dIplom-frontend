"use client";

import Link from "next/link";
import { useState } from "react";
import { deleteProduct } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import {
  getProductSizeStock,
  getTotalSizeStock,
  normalizeProductSizes,
} from "@/utils/productSizes";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
};

const getProductId = (product) => product._id || product.id;

const ProductTable = ({ initialProducts = [], storeId, loadError }) => {
  const { token } = useAuth();
  const [products, setProducts] = useState(initialProducts);
  const [pendingId, setPendingId] = useState("");
  const [message, setMessage] = useState("");
  const [openMenuId, setOpenMenuId] = useState("");

  const handleRemove = async (product) => {
    const productId = getProductId(product);

    if (!token) {
      setMessage("Authentication required.");
      return;
    }

    const confirmed = window.confirm(`Remove ${product.name}?`);
    if (!confirmed) {
      return;
    }

    setPendingId(productId);
    setMessage("");
    setOpenMenuId("");

    const result = await deleteProduct(token, productId);

    if (result.success) {
      setProducts((currentProducts) =>
        currentProducts.filter((item) => getProductId(item) !== productId),
      );
      setMessage("Product removed.");
    } else {
      setMessage(result.message || "Failed to remove product.");
    }

    setPendingId("");
  };

  return (
    <div>
      {message && (
        <div className="mb-4 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700">
          {message}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <table className="w-full">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">
                Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">
                Sizes
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">
                Status
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-zinc-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => {
                const productId = getProductId(product);
                const stock = product.stock ?? 0;
                const sizes = normalizeProductSizes(product.sizes);
                const sizeStock = getProductSizeStock(product);
                const inStock =
                  sizes.length > 0
                    ? getTotalSizeStock(sizeStock) > 0
                    : Number(stock || 0) > 0;
                const isPending = pendingId === productId;
                const isMenuOpen = openMenuId === productId;

                return (
                  <tr
                    key={productId}
                    className="border-b border-zinc-200 hover:bg-zinc-50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-zinc-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-700">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-700">
                      {stock}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-700">
                      {sizes.length > 0 && (
                        <div className="flex max-w-xs flex-wrap gap-1.5">
                          {sizes.map((size) => (
                            <span
                              key={size}
                              className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-700"
                            >
                              {size}: {sizeStock[size] || 0}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-700">
                      {inStock ? "In stock" : "Out of stock"}
                    </td>
                    <td className="relative px-6 py-4 text-right text-sm">
                      <button
                        type="button"
                        disabled={isPending}
                        aria-label={`Open actions for ${product.name}`}
                        onClick={() =>
                          setOpenMenuId((currentId) =>
                            currentId === productId ? "" : productId,
                          )
                        }
                        className="inline-flex h-9 w-9 flex-col items-center justify-center gap-0.5 rounded-full border border-zinc-200 transition hover:border-black hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <span className="h-1 w-1 rounded-full bg-current" />
                        <span className="h-1 w-1 rounded-full bg-current" />
                        <span className="h-1 w-1 rounded-full bg-current" />
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-6 top-14 z-20 w-40 overflow-hidden rounded-lg border border-zinc-200 bg-white text-left shadow-lg">
                          <Link
                            href={`/shop/${storeId}/products/${productId}`}
                            className="block w-full px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleRemove(product)}
                            className="block w-full px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="border-b border-zinc-200 hover:bg-zinc-50">
                <td colSpan="6" className="px-6 py-8 text-center text-zinc-500">
                  {loadError || "No products found."}{" "}
                  <Link
                    href={`/shop/${storeId}/create-product`}
                    className="text-blue-600 hover:underline"
                  >
                    Create one now
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
