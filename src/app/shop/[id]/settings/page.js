"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { getStoreInfo, updateStore } from "@/api/store";
import { useAuth } from "@/hooks/useAuth";
import {
  LoadingPanel,
  NoticeBanner,
  PanelState,
} from "@/components/ui/PageState";

const normalizeNotifications = (store) => {
  const notifications =
    store?.notifications ||
    store?.notificationSettings ||
    store?.settings?.notifications ||
    {};

  return {
    orders: notifications.orders !== false,
    inquiries: notifications.inquiries !== false,
  };
};

const normalizeSettings = (store) => ({
  name: store?.name || "Store",
  isActive: store?.isActive !== false,
  notifications: normalizeNotifications(store),
});

const SettingsPage = () => {
  const { id: storeId } = useParams();
  const { token } = useAuth();
  const [store, setStore] = useState(null);
  const [form, setForm] = useState({
    name: "Store",
    isActive: true,
    notifications: {
      orders: true,
      inquiries: true,
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    let ignore = false;

    const loadSettings = async () => {
      if (!token || !storeId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setMessage({ type: "", text: "" });

      const result = await getStoreInfo(storeId, token);

      if (ignore) return;

      if (!result.success) {
        setStore(null);
        setMessage({
          type: "error",
          text: result.message || "Failed to load store settings.",
        });
        setLoading(false);
        return;
      }

      setStore(result.data);
      setForm(normalizeSettings(result.data));
      setLoading(false);
    };

    loadSettings();

    return () => {
      ignore = true;
    };
  }, [storeId, token]);

  const hasChanges = useMemo(() => {
    if (!store) return false;

    const normalized = normalizeSettings(store);

    return JSON.stringify(normalized) !== JSON.stringify(form);
  }, [form, store]);

  const toggleNotification = (key) => {
    setForm((current) => ({
      ...current,
      notifications: {
        ...current.notifications,
        [key]: !current.notifications[key],
      },
    }));
    setMessage({ type: "", text: "" });
  };

  const toggleActive = () => {
    setForm((current) => ({
      ...current,
      isActive: !current.isActive,
    }));
    setMessage({ type: "", text: "" });
  };

  const handleSave = async () => {
    if (!token || !storeId || !store) return;

    setSaving(true);
    setMessage({ type: "", text: "" });

    const payload = {
      ...store,
      isActive: form.isActive,
      notifications: form.notifications,
      notificationSettings: form.notifications,
      settings: {
        ...(store.settings || {}),
        notifications: form.notifications,
      },
    };

    const result = await updateStore(storeId, token, payload);

    if (!result.success) {
      setSaving(false);
      setMessage({
        type: "error",
        text: result.message || "Failed to save settings.",
      });
      return;
    }

    const nextStore = result.data || payload;
    setStore(nextStore);
    setForm(normalizeSettings(nextStore));
    setSaving(false);
    setMessage({
      type: "success",
      text: "Store settings updated successfully.",
    });
  };

  if (loading) {
    return <LoadingPanel message="Loading store settings..." />;
  }

  if (!store) {
    return (
      <PanelState
        title="Settings unavailable"
        description={message.text || "Store settings could not be loaded."}
        tone="error"
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 border-b border-zinc-200 pb-6">
        <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">Store settings</p>
        <h1 className="text-4xl font-bold text-zinc-900">Settings</h1>
        <p className="max-w-2xl text-sm text-zinc-500">
          Manage storefront visibility and notification preferences saved against your store profile.
        </p>
      </div>

      {message.text && (
        <NoticeBanner tone={message.type === "error" ? "error" : "success"}>
          {message.text}
        </NoticeBanner>
      )}

      <div className="max-w-3xl space-y-6">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">Store status</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Turn your storefront on or off without changing the rest of your profile.
          </p>

          <div className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-4">
            <div>
              <p className="font-medium text-zinc-900">{form.name}</p>
              <p className="mt-1 text-sm text-zinc-500">
                {form.isActive ? "Customers can browse this shop." : "This shop is hidden from customers."}
              </p>
            </div>
            <button
              type="button"
              onClick={toggleActive}
              className={`inline-flex h-11 items-center rounded-full px-4 text-sm font-semibold transition ${
                form.isActive
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
              }`}
            >
              {form.isActive ? "Active" : "Inactive"}
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">Notifications</h2>
          <p className="mt-1 text-sm text-zinc-500">
            These preferences are stored with your shop settings payload.
          </p>

          <div className="mt-5 space-y-4">
            <label className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 px-4 py-4">
              <div>
                <p className="font-medium text-zinc-900">Email order notifications</p>
                <p className="mt-1 text-sm text-zinc-500">
                  Receive an email when a new order is placed.
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.notifications.orders}
                onChange={() => toggleNotification("orders")}
                className="h-4 w-4 rounded border-zinc-300"
              />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 px-4 py-4">
              <div>
                <p className="font-medium text-zinc-900">Email product inquiries</p>
                <p className="mt-1 text-sm text-zinc-500">
                  Receive follow-up emails for new customer inquiries.
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.notifications.inquiries}
                onChange={() => toggleNotification("inquiries")}
                className="h-4 w-4 rounded border-zinc-300"
              />
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">Save changes</h2>
          <p className="mt-1 text-sm text-zinc-500">
            This updates your store through the same backend `updateStore` integration used elsewhere.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-500">
              {hasChanges ? "You have unsaved changes." : "Settings are up to date."}
            </p>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="rounded-lg bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
            >
              {saving ? "Saving..." : "Save settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
