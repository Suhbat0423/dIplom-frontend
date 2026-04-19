"use client";

import { useEffect, useMemo, useState } from "react";
import { updateStore } from "@/api/store";
import { useAuth } from "@/hooks/useAuth";
import { uploadStoreImage, validateStoreImage } from "@/utils/storeImages";

const emptyStore = {
  name: "",
  description: "",
  phone: "",
  email: "",
  address: "",
  logo: "",
  coverImage: "",
};

const fields = [
  { name: "name", label: "Store name", type: "text", placeholder: "High End Studio" },
  { name: "email", label: "Email", type: "email", placeholder: "store@example.com" },
  { name: "phone", label: "Phone", type: "tel", placeholder: "+976 9999 9999" },
  { name: "address", label: "Address", type: "text", placeholder: "Store address" },
];

const normalizeStore = (store) => ({
  ...emptyStore,
  name: store?.name || "",
  description: store?.description || "",
  phone: store?.phone || "",
  email: store?.email || "",
  address: store?.address || "",
  logo: store?.logo || "",
  coverImage: store?.coverImage || store?.cover || "",
});

const ImagePicker = ({
  title,
  helper,
  preview,
  inputId,
  onFileChange,
  isCover = false,
}) => {
  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <label htmlFor={inputId} className="text-sm font-semibold text-zinc-900">
            {title}
          </label>
          <p className="mt-1 text-xs text-zinc-500">{helper}</p>
        </div>
      </div>

      <label
        htmlFor={inputId}
        className={`group flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-center transition hover:border-zinc-900 hover:bg-white ${
          isCover ? "min-h-56" : "min-h-44"
        }`}
      >
        {preview ? (
          <img
            src={preview}
            alt={title}
            className={`h-full w-full object-cover transition duration-300 group-hover:scale-[1.02] ${
              isCover ? "aspect-[16/7]" : "aspect-square max-h-48 max-w-48 rounded-lg"
            }`}
          />
        ) : (
          <div className="px-6 py-10">
            <p className="text-sm font-medium text-zinc-900">Click to upload</p>
            <p className="mt-1 text-xs text-zinc-500">PNG, JPG, WEBP up to 5MB</p>
          </div>
        )}
      </label>

      <input
        id={inputId}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={onFileChange}
      />
    </div>
  );
};

const StoreProfileForm = ({ storeId, initialStore, loadError = "" }) => {
  const { token } = useAuth();
  const initialValues = useMemo(() => normalizeStore(initialStore), [initialStore]);
  const [form, setForm] = useState(initialValues);
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(initialValues.logo);
  const [coverPreview, setCoverPreview] = useState(initialValues.coverImage);
  const [status, setStatus] = useState({
    loading: false,
    error: loadError,
    success: "",
  });

  useEffect(() => {
    setForm(initialValues);
    setLogoPreview(initialValues.logo);
    setCoverPreview(initialValues.coverImage);
  }, [initialValues]);

  useEffect(() => {
    return () => {
      if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
      if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    };
  }, [logoPreview, coverPreview]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImageChange = (type) => (event) => {
    const file = event.target.files?.[0];
    const error = validateStoreImage(file);

    if (error) {
      setStatus({ loading: false, error, success: "" });
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (type === "logo") {
      if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
      setLogoFile(file);
      setLogoPreview(previewUrl);
    } else {
      if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
      setCoverFile(file);
      setCoverPreview(previewUrl);
    }

    setStatus({ loading: false, error: "", success: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    try {
      if (!token) {
        throw new Error("Please sign in again before updating your store.");
      }

      const [logoUrl, coverUrl] = await Promise.all([
        logoFile ? uploadStoreImage(logoFile) : Promise.resolve(form.logo),
        coverFile ? uploadStoreImage(coverFile) : Promise.resolve(form.coverImage),
      ]);

      const payload = {
        ...form,
        logo: logoUrl,
        coverImage: coverUrl,
      };

      const result = await updateStore(storeId, token, payload);

      if (!result.success) {
        throw new Error(result.message || "Failed to update store.");
      }

      const updatedStore = normalizeStore(result.data || payload);
      setForm(updatedStore);
      setLogoFile(null);
      setCoverFile(null);
      setLogoPreview(updatedStore.logo);
      setCoverPreview(updatedStore.coverImage);
      setStatus({
        loading: false,
        error: "",
        success: "Store profile updated successfully.",
      });
    } catch (error) {
      setStatus({
        loading: false,
        error: error?.message || "Failed to update store.",
        success: "",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Store admin
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-950">
            Store profile
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Keep your public brand details, contact information, and storefront images up to date.
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600">
          {form.name || "Untitled store"}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="border-b border-zinc-200 pb-5">
            <h2 className="text-lg font-semibold text-zinc-950">Store information</h2>
            <p className="mt-1 text-sm text-zinc-500">
              These details are used on your brand page and admin account.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-sm font-medium text-zinc-800"
                >
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={form[field.name]}
                  onChange={updateField}
                  placeholder={field.placeholder}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-100"
                />
              </div>
            ))}
          </div>

          <div className="mt-5">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-zinc-800"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={updateField}
              rows={6}
              placeholder="Tell customers what makes your store different."
              className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm leading-6 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-100"
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
              Old images stay saved unless you choose new files.
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
            <ImagePicker
              title="Logo image"
              helper="Square images work best."
              preview={logoPreview}
              inputId="logo-upload"
              onFileChange={handleImageChange("logo")}
            />
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <ImagePicker
              title="Cover image"
              helper="Use a wide lifestyle image for your storefront header."
              preview={coverPreview}
              inputId="cover-upload"
              onFileChange={handleImageChange("cover")}
              isCover
            />
          </section>
        </aside>
      </form>
    </div>
  );
};

export default StoreProfileForm;

