"use client";

import { useEffect, useMemo, useState } from "react";
import { requestStoreVerification, updateStore } from "@/api/store";
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
  verificationStatus: "incomplete",
  verificationFeedback: "",
};

const fields = [
  {
    name: "name",
    label: "Shop name",
    type: "text",
    placeholder: "High End Studio",
    helper: "Customers and admins use this to identify your storefront.",
  },
  {
    name: "email",
    label: "Contact email",
    type: "email",
    placeholder: "store@example.com",
    helper: "Use an inbox your team checks regularly.",
  },
  {
    name: "phone",
    label: "Phone number",
    type: "tel",
    placeholder: "+976 9999 9999",
    helper: "Required for verification and customer support.",
  },
  {
    name: "address",
    label: "Business address",
    type: "text",
    placeholder: "Store address",
    helper: "Add the physical address or registered business address.",
  },
];

const requiredItems = [
  { key: "name", label: "Shop name" },
  { key: "description", label: "Shop description" },
  { key: "email", label: "Contact email" },
  { key: "phone", label: "Phone number" },
  { key: "address", label: "Business address" },
  { key: "logo", label: "Logo image" },
  { key: "coverImage", label: "Banner image" },
];

const statusConfig = {
  incomplete: {
    label: "Draft profile",
    tone: "border-zinc-200 bg-white text-zinc-700",
    icon: "dot",
  },
  pending: {
    label: "Pending Verification",
    tone: "border-amber-200 bg-amber-50 text-amber-700",
    icon: "clock",
  },
  verified: {
    label: "Verified",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: "check",
  },
  rejected: {
    label: "Rejected",
    tone: "border-red-200 bg-red-50 text-red-700",
    icon: "alert",
  },
};

const normalizeVerificationStatus = (store) => {
  if (store?.verificationStatus) return store.verificationStatus;
  if (store?.verification?.status) return store.verification.status;
  if (store?.isVerified || store?.verified) return "verified";
  if (store?.status === "verified") return "verified";
  if (store?.status === "rejected") return "rejected";
  if (store?.status === "pending") return "pending";
  return "incomplete";
};

const normalizeStore = (store) => ({
  ...emptyStore,
  name: store?.name || "",
  description: store?.description || "",
  phone: store?.phone || "",
  email: store?.email || "",
  address: store?.address || "",
  logo: store?.logo || "",
  coverImage: store?.coverImage || store?.cover || store?.banner || "",
  verificationStatus: normalizeVerificationStatus(store),
  verificationFeedback:
    store?.verificationFeedback ||
    store?.rejectionReason ||
    store?.verification?.feedback ||
    "",
});

const getStoreUpdatePayload = (store, logo, coverImage) => ({
  name: store.name,
  description: store.description,
  phone: store.phone,
  email: store.email,
  address: store.address,
  logo,
  coverImage,
});

const isFilled = (value) => {
  if (value === null || value === undefined) return false;
  return String(value).trim().length > 0;
};

const Icon = ({ type }) => {
  if (type === "check") {
    return (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.5 7.57a1 1 0 0 1-1.42.004L3.29 9.74a1 1 0 1 1 1.42-1.408l3.79 3.822 6.79-6.858a1 1 0 0 1 1.414-.006Z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  if (type === "clock") {
    return (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm1-11a1 1 0 1 0-2 0v3.25c0 .31.144.602.39.79l2.5 1.9a1 1 0 0 0 1.22-1.586L11 9.75V7Z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  if (type === "alert") {
    return (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-13a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1Zm0 10a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  return <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />;
};

const ImagePicker = ({
  title,
  helper,
  preview,
  inputId,
  onFileChange,
  isCover = false,
  required,
  missing,
  locked,
}) => {
  return (
    <div>
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <label htmlFor={inputId} className="text-sm font-semibold text-zinc-900">
            {title} {required && <span className="text-red-500">*</span>}
          </label>
          <p className="mt-1 text-xs leading-5 text-zinc-500" title="Required for profile verification">
            {helper}
          </p>
        </div>
        {locked && (
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
            Locked
          </span>
        )}
      </div>

      <label
        htmlFor={locked ? undefined : inputId}
        className={`group flex flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed text-center transition ${
          locked
            ? "cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-80"
            : "cursor-pointer bg-zinc-50 hover:border-zinc-900 hover:bg-white"
        } ${missing ? "border-red-300 bg-red-50" : "border-zinc-300"} ${
          isCover ? "min-h-56" : "min-h-44"
        }`}
      >
        {preview ? (
          <img
            src={preview}
            alt={title}
            className={`h-full w-full object-cover transition duration-300 ${
              locked ? "" : "group-hover:scale-[1.02]"
            } ${isCover ? "aspect-[16/7]" : "aspect-square max-h-48 max-w-48 rounded-lg"}`}
          />
        ) : (
          <div className="px-6 py-10">
            <p className={`text-sm font-medium ${missing ? "text-red-700" : "text-zinc-900"}`}>
              {missing ? "Required image missing" : "Click to upload"}
            </p>
            <p className="mt-1 text-xs text-zinc-500">PNG, JPG, WEBP up to 5MB</p>
          </div>
        )}
      </label>

      {missing && <p className="mt-2 text-xs font-medium text-red-600">Required before verification.</p>}

      <input
        id={inputId}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={onFileChange}
        disabled={locked}
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
    verifying: false,
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

  const completion = useMemo(() => {
    const values = {
      ...form,
      logo: logoFile || logoPreview,
      coverImage: coverFile || coverPreview,
    };
    const completed = requiredItems.filter((item) => isFilled(values[item.key]));
    const missing = requiredItems
      .filter((item) => !isFilled(values[item.key]))
      .map((item) => item.key);

    return {
      completedKeys: completed.map((item) => item.key),
      missing,
      percentage: Math.round((completed.length / requiredItems.length) * 100),
    };
  }, [coverFile, coverPreview, form, logoFile, logoPreview]);

  const isComplete = completion.percentage === 100;
  const verificationStatus = isComplete ? form.verificationStatus : "incomplete";
  const profileLocked = false;
  const canRequestVerification =
    isComplete && verificationStatus !== "pending" && verificationStatus !== "verified";
  const currentStatus = statusConfig[verificationStatus] || statusConfig.incomplete;

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImageChange = (type) => (event) => {
    const file = event.target.files?.[0];
    const error = validateStoreImage(file);

    if (error) {
      setStatus({ loading: false, verifying: false, error, success: "" });
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

    setStatus({ loading: false, verifying: false, error: "", success: "" });
  };

  const saveProfile = async () => {
    if (!token) {
      throw new Error("Please sign in again before updating your store.");
    }

    const [logoUrl, coverUrl] = await Promise.all([
      logoFile ? uploadStoreImage(logoFile) : Promise.resolve(form.logo),
      coverFile ? uploadStoreImage(coverFile) : Promise.resolve(form.coverImage),
    ]);

    const payload = getStoreUpdatePayload(form, logoUrl, coverUrl);

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

    return updatedStore;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, verifying: false, error: "", success: "" });

    try {
      await saveProfile();
      setStatus({
        loading: false,
        verifying: false,
        error: "",
        success: "Shop profile updated successfully.",
      });
    } catch (error) {
      setStatus({
        loading: false,
        verifying: false,
        error: error?.message || "Failed to update store.",
        success: "",
      });
    }
  };

  const handleVerificationRequest = async () => {
    setStatus({ loading: false, verifying: true, error: "", success: "" });

    try {
      await saveProfile();
      const result = await requestStoreVerification(storeId, token);

      if (!result.success) {
        throw new Error(result.message || "Failed to request verification.");
      }

      setForm((current) => ({
        ...current,
        verificationStatus: "pending",
        verificationFeedback: "",
      }));
      setStatus({
        loading: false,
        verifying: false,
        error: "",
        success: "Verification request sent to admin.",
      });
    } catch (error) {
      setStatus({
        loading: false,
        verifying: false,
        error: error?.message || "Failed to request verification.",
        success: "",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Shop admin
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-950">
              Shop profile
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              Complete every required detail before sending your shop to admin review.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold ${currentStatus.tone}`}>
              <Icon type={currentStatus.icon} />
              {currentStatus.label}
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
              {form.name || "Untitled shop"}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between gap-4 text-sm">
            <span className="font-semibold text-zinc-900">Profile completion</span>
            <span className="font-bold text-emerald-700">{completion.percentage}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${completion.percentage}%` }}
              aria-label={`Profile completion ${completion.percentage}%`}
            />
          </div>
          {!isComplete && (
            <p className="mt-2 text-sm text-zinc-500">
              Missing fields are highlighted. Finish them to unlock verification.
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 border-b border-zinc-200 pb-5 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950">Business information</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Required fields are used for public trust and admin verification.
              </p>
            </div>
            {isComplete && (
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                Ready for verification
              </span>
            )}
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {fields.map((field) => {
              const missing = completion.missing.includes(field.name);

              return (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="mb-2 block text-sm font-medium text-zinc-800"
                  >
                    {field.label} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={form[field.name]}
                    onChange={updateField}
                    placeholder={field.placeholder}
                    readOnly={profileLocked}
                    title={field.helper}
                    className={`w-full rounded-lg border px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 ${
                      profileLocked
                        ? "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-600"
                        : missing
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-zinc-300 bg-white focus:border-zinc-900 focus:ring-4 focus:ring-zinc-100"
                    }`}
                  />
                  <p className={`mt-2 text-xs ${missing ? "font-medium text-red-600" : "text-zinc-500"}`}>
                    {missing ? "Required before verification." : field.helper}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-5">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-zinc-800"
            >
              Shop description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={updateField}
              rows={6}
              readOnly={profileLocked}
              title="Tell customers what you sell, who you serve, and what makes your shop trustworthy."
              placeholder="Tell customers what makes your shop different."
              className={`w-full resize-none rounded-lg border px-4 py-3 text-sm leading-6 text-zinc-950 outline-none transition placeholder:text-zinc-400 ${
                profileLocked
                  ? "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-600"
                  : completion.missing.includes("description")
                    ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-zinc-300 bg-white focus:border-zinc-900 focus:ring-4 focus:ring-zinc-100"
              }`}
            />
            <p
              className={`mt-2 text-xs ${
                completion.missing.includes("description")
                  ? "font-medium text-red-600"
                  : "text-zinc-500"
              }`}
            >
              {completion.missing.includes("description")
                ? "Required before verification."
                : "Write a concise summary customers can trust."}
            </p>
          </div>

          {form.verificationStatus === "rejected" && form.verificationFeedback && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span className="font-semibold">Admin feedback: </span>
              {form.verificationFeedback}
            </div>
          )}

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
              {profileLocked
                ? "Your completed profile is read-only while it is prepared for admin review."
                : "Old images stay saved unless you choose new files."}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={status.loading}
                className="rounded-lg bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
              >
                {status.loading ? "Saving..." : "Save changes"}
              </button>
              {canRequestVerification && (
                <button
                  type="button"
                  onClick={handleVerificationRequest}
                  disabled={status.verifying}
                  className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                >
                  {status.verifying ? "Sending..." : "Request Verification"}
                </button>
              )}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-950">Completion checklist</h2>
            <p className="mt-1 text-sm text-zinc-500">Every item must be complete before review.</p>
            <div className="mt-5 space-y-3">
              {requiredItems.map((item) => {
                const complete = completion.completedKeys.includes(item.key);

                return (
                  <div key={item.key} className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                          complete
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-zinc-100 text-zinc-400"
                        }`}
                      >
                        {complete ? <Icon type="check" /> : <span className="h-2 w-2 rounded-full bg-current" />}
                      </span>
                      <span className="truncate text-sm font-medium text-zinc-800">{item.label}</span>
                    </div>
                    <span className={`text-xs font-semibold ${complete ? "text-emerald-700" : "text-zinc-500"}`}>
                      {complete ? "Done" : "Missing"}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <ImagePicker
              title="Logo image"
              helper="Square images work best. Required for verification."
              preview={logoPreview}
              inputId="logo-upload"
              onFileChange={handleImageChange("logo")}
              required
              locked={profileLocked}
              missing={completion.missing.includes("logo")}
            />
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <ImagePicker
              title="Banner image"
              helper="Use a wide storefront image for your public header."
              preview={coverPreview}
              inputId="cover-upload"
              onFileChange={handleImageChange("cover")}
              required
              locked={profileLocked}
              missing={completion.missing.includes("coverImage")}
              isCover
            />
          </section>
        </aside>
      </form>
    </div>
  );
};

export default StoreProfileForm;
