"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Input from "@/components/ui/Input";
import { createProduct as createProductAPI } from "@/api";
import { PRODUCT_SIZES } from "@/config/constants";
import { useAuth } from "@/hooks/useAuth";
import {
  getTotalSizeStock,
  normalizeProductSizes,
  normalizeSizeStock,
  toggleProductSize,
} from "@/utils/productSizes";

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
const maxImages = 5;
const maxImageSize = 5 * 1024 * 1024;
const allowedImageTypes = ["image/png", "image/jpeg", "image/webp"];

const CreateProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();
  const id = params.id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    priceCategory: "",
    stock: "",
    stockQuality: "",
    imageUrl: "",
    sizes: [],
    sizeStock: {},
  });
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
    setError("");
  };

  const handleFiles = (fileList) => {
    const nextFiles = Array.from(fileList);

    if (images.length + nextFiles.length > maxImages) {
      setError("You can upload up to 5 images.");
      return;
    }

    const invalidFile = nextFiles.find(
      (file) =>
        !allowedImageTypes.includes(file.type) || file.size > maxImageSize,
    );

    if (invalidFile) {
      setError("Images must be PNG, JPG, or WEBP and up to 5MB.");
      return;
    }

    setImages((currentImages) => [...currentImages, ...nextFiles]);
    setError("");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const removeImage = (imageName) => {
    setImages((currentImages) =>
      currentImages.filter((image) => image.name !== imageName),
    );
  };

  const handleSizeToggle = (size) => {
    setFormData((currentData) => {
      const nextSizes = toggleProductSize(currentData.sizes, size);

      return {
        ...currentData,
        sizes: nextSizes,
        sizeStock: normalizeSizeStock(currentData.sizeStock, nextSizes),
      };
    });
    setError("");
  };

  const handleSizeStockChange = (size, value) => {
    setFormData((currentData) => ({
      ...currentData,
      sizeStock: {
        ...currentData.sizeStock,
        [size]: value,
      },
    }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Product name is required");
      return;
    }

    if (!formData.category) {
      setError("Please select a category");
      return;
    }

    if (!formData.priceCategory) {
      setError("Please select a price category");
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    if (!formData.stockQuality) {
      setError("Please select a stock quality");
      return;
    }

    const selectedSizes = normalizeProductSizes(formData.sizes);
    const sizeStock = normalizeSizeStock(formData.sizeStock, selectedSizes);
    const totalSizeStock = getTotalSizeStock(sizeStock);

    if (selectedSizes.length !== formData.sizes.length) {
      setError("One or more selected sizes are not supported");
      return;
    }

    if (selectedSizes.length > 0 && totalSizeStock <= 0) {
      setError("Add stock quantity for at least one selected size");
      return;
    }

    if (selectedSizes.length === 0 && (!formData.stock || parseInt(formData.stock) < 0)) {
      setError("Stock cannot be negative");
      return;
    }

    if (!token) {
      setError("Authentication required");
      return;
    }

    setLoading(true);

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      stock: selectedSizes.length > 0 ? totalSizeStock : parseInt(formData.stock),
      sizes: selectedSizes,
      sizeStock,
      metadata: {
        category: formData.category,
        priceCategory: formData.priceCategory,
        stockQuality: formData.stockQuality,
        imageNames: images.map((image) => image.name),
      },
    };

    if (formData.imageUrl.trim()) {
      productData.imageUrl = formData.imageUrl.trim();
    }

    const result = await createProductAPI(token, productData);

    if (result.success) {
      setSuccess("Product created successfully!");
      setTimeout(() => {
        router.push(`/shop/${id}/products`);
      }, 1000);
    } else {
      setError(
        result.status === 403
          ? "Your session is not authorized to create products. Please check that product-service is using the same JWT_SECRET as store-service."
          : result.message || "Failed to create product",
      );
    }

    setLoading(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-zinc-900">Create Product</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Add product details, inventory, and imagery for your shop.
        </p>
      </div>

      {error && (
        <div className="mb-4 max-w-5xl rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 max-w-5xl rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          {success}
        </div>
      )}

      <form className="max-w-5xl space-y-6" onSubmit={handleSubmit}>
        <section className="rounded-lg border border-zinc-200 bg-white p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900">
              Product Information
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Enter the basic details of your product
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                label="Product Name"
                type="text"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Enter product description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Select category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="h-12 w-full rounded-lg border border-zinc-300 bg-white px-4 text-sm outline-none focus:border-black"
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Price category
              </label>
              <select
                name="priceCategory"
                value={formData.priceCategory}
                onChange={handleChange}
                className="h-12 w-full rounded-lg border border-zinc-300 bg-white px-4 text-sm outline-none focus:border-black"
                required
              >
                <option value="">Select price category</option>
                {priceCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Price"
              type="number"
              name="price"
              placeholder="0.00"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />

            <Input
              label="Stock quantity"
              type="number"
              name="stock"
              placeholder="0"
              min="0"
              value={
                formData.sizes.length > 0
                  ? String(getTotalSizeStock(normalizeSizeStock(formData.sizeStock, formData.sizes)))
                  : formData.stock
              }
              onChange={handleChange}
              disabled={formData.sizes.length > 0}
              required
            />

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Stock quality
              </label>
              <select
                name="stockQuality"
                value={formData.stockQuality}
                onChange={handleChange}
                className="h-12 w-full rounded-lg border border-zinc-300 bg-white px-4 text-sm outline-none focus:border-black"
                required
              >
                <option value="">Select stock quality</option>
                {stockQualities.map((quality) => (
                  <option key={quality} value={quality}>
                    {quality}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <div className="mb-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-700">Available sizes</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Select every size customers can buy.
                  </p>
                </div>
                {formData.sizes.length > 0 && (
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
                    {formData.sizes.length} selected
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-9">
                {PRODUCT_SIZES.map((size) => {
                  const selected = formData.sizes.includes(size);

                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      aria-pressed={selected}
                      className={`h-12 rounded-lg border text-sm font-semibold transition ${
                        selected
                          ? "border-zinc-950 bg-zinc-950 text-white shadow-sm"
                          : "border-zinc-300 bg-white text-zinc-900 hover:border-zinc-950"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {formData.sizes.length > 0 && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {formData.sizes.map((size) => (
                    <label
                      key={size}
                      className="rounded-lg border border-zinc-200 bg-zinc-50 p-3"
                    >
                      <span className="text-sm font-semibold text-zinc-900">
                        {size} stock
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={formData.sizeStock[size] ?? ""}
                        onChange={(event) =>
                          handleSizeStockChange(size, event.target.value)
                        }
                        placeholder="0"
                        className="mt-2 h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-black"
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900">
              Product Images
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Upload images of your product (Max 5 images)
            </p>
          </div>

          <label
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 text-center transition ${
              isDragging
                ? "border-black bg-zinc-100"
                : "border-zinc-300 bg-zinc-50 hover:border-black"
            }`}
          >
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="hidden"
              onChange={(event) => handleFiles(event.target.files)}
            />
            <div className="text-base font-semibold text-zinc-900">
              Drag and drop your images here, or click to browse
            </div>
            <p className="mt-2 text-sm text-zinc-500">
              PNG, JPG, WEBP up to 5MB
            </p>
            <span className="mt-6 rounded-lg bg-black px-5 py-2 text-sm font-medium text-white">
              Browse Files
            </span>
          </label>

          {images.length > 0 && (
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {images.map((image) => (
                <div
                  key={image.name}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-zinc-900">{image.name}</p>
                    <p className="text-zinc-500">
                      {(image.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(image.name)}
                    className="font-medium text-red-600 transition hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
          <Link
            href={`/shop/${id}/products`}
            className="rounded-lg border border-zinc-300 px-6 py-2 text-zinc-700 transition hover:bg-zinc-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CreateProductPage;
