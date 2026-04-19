"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { updateProduct } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import {
  uploadProductImage,
  validateProductImage,
} from "@/utils/productImages";

const categories = [
  "T-shirts",
  "Hoodies & Sweatshirts",
  "Knitwear",
  "Outerwear",
  "Shirts & Polos",
  "Jeans",
  "Pants",
  "Shorts",
  "Accessories",
];

const priceCategories = ["Budget", "Standard", "Premium", "Luxury"];
const stockQualities = ["Limited", "Normal", "High availability"];

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: "",
  category: "",
  priceCategory: "",
  stockQuality: "",
};

const normalizeProduct = (product) => ({
  ...emptyProduct,
  name: product?.name || "",
  description: product?.description || "",
  price: product?.price === undefined ? "" : String(product.price),
  stock: product?.stock === undefined ? "" : String(product.stock),
  imageUrl: product?.imageUrl || "",
  category: product?.metadata?.category || "",
  priceCategory: product?.metadata?.priceCategory || "",
  stockQuality: product?.metadata?.stockQuality || "",
});

const selectFields = [
  { name: "category", label: "Category", options: categories },
  { name: "priceCategory", label: "Price category", options: priceCategories },
  { name: "stockQuality", label: "Stock quality", options: stockQualities },
];

const ProductEditForm = ({ product, storeId }) => {
  const { token } = useAuth();
  const productId = product._id || product.id;
  const initialProduct = useMemo(() => normalizeProduct(product), [product]);
  const [form, setForm] = useState(initialProduct);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialProduct.imageUrl);
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setStatus((current) => ({ ...current, error: "", success: "" }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    const error = validateProductImage(file);

    if (error) {
      setStatus({ loading: false, error, success: "" });
      return;
    }

    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setStatus({ loading: false, error: "", success: "" });
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Product name is required.";
    if (!form.price || Number(form.price) < 0) return "Price must be 0 or greater.";
    if (form.stock === "" || Number(form.stock) < 0) {
      return "Stock must be 0 or greater.";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    try {
      if (!token) {
        throw new Error("Please sign in again before updating this product.");
      }

      const validationError = validateForm();
      if (validationError) {
        throw new Error(validationError);
      }

      const imageUrl = imageFile
        ? await uploadProductImage(imageFile)
        : form.imageUrl.trim();

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        imageUrl,
        metadata: {
          ...(product.metadata || {}),
          category: form.category,
          priceCategory: form.priceCategory,
          stockQuality: form.stockQuality,
        },
      };

      const result = await updateProduct(token, productId, payload);

      if (!result.success) {
        throw new Error(result.message || "Failed to update product.");
      }

      const updatedProduct = normalizeProduct(result.data || payload);
      setForm(updatedProduct);
      setImageFile(null);
      setImagePreview(updatedProduct.imageUrl);
      setStatus({
        loading: false,
        error: "",
        success: "Product updated successfully.",
      });
    } catch (error) {
      setStatus({
        loading: false,
        error: error?.message || "Failed to update product.",
        success: "",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Product admin
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-950">
            Edit product
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Update product details, pricing, inventory, category, and imagery.
          </p>
        </div>
        <Link
          href={`/shop/${storeId}/products`}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-950"
        >
          Back to products
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="border-b border-zinc-200 pb-5">
            <h2 className="text-lg font-semibold text-zinc-950">
              Product information
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              These details are shown on your storefront product listing.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-zinc-800">
                Product name
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="Oversized wool coat"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-100"
              />
            </div>

            <div>
              <label htmlFor="price" className="mb-2 block text-sm font-medium text-zinc-800">
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={updateField}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-100"
              />
            </div>

            <div>
              <label htmlFor="stock" className="mb-2 block text-sm font-medium text-zinc-800">
                Stock
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={updateField}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-100"
              />
            </div>

            {selectFields.map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-sm font-medium text-zinc-800"
                >
                  {field.label}
                </label>
                <select
                  id={field.name}
                  name={field.name}
                  value={form[field.name]}
                  onChange={updateField}
                  className="h-12 w-full rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-100"
                >
                  <option value="">Select {field.label.toLowerCase()}</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-zinc-800">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={updateField}
              rows={6}
              placeholder="Describe fit, fabric, and product details."
              className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm leading-6 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-100"
            />
          </div>

          <div className="mt-5">
            <label htmlFor="imageUrl" className="mb-2 block text-sm font-medium text-zinc-800">
              Image URL
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              value={form.imageUrl}
              onChange={(event) => {
                updateField(event);
                setImagePreview(event.target.value);
              }}
              placeholder="https://... or /uploads/products/..."
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-100"
            />
          </div>

          {(status.error || status.success) && (
            <div
              className={`mt-5 rounded-lg border px-4 py-3 text-sm ${
                status.error
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              {status.error || status.success}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 border-t border-zinc-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-zinc-500">
              Existing image stays saved unless you choose a new file or URL.
            </p>
            <button
              type="submit"
              disabled={status.loading}
              className="rounded-lg bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
            >
              {status.loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-3">
              <label htmlFor="product-image-upload" className="text-sm font-semibold text-zinc-900">
                Product image
              </label>
              <p className="mt-1 text-xs text-zinc-500">
                Upload PNG, JPG, or WEBP up to 5MB.
              </p>
            </div>

            <label
              htmlFor="product-image-upload"
              className="group flex min-h-80 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-center transition hover:border-zinc-900 hover:bg-white"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={form.name || "Product preview"}
                  className="aspect-[4/5] h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="px-6 py-12">
                  <p className="text-sm font-medium text-zinc-900">
                    Click to upload
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Preview appears instantly
                  </p>
                </div>
              )}
            </label>

            <input
              id="product-image-upload"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={handleImageChange}
            />
          </section>
        </aside>
      </form>
    </div>
  );
};

export default ProductEditForm;
