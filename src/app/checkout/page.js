"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder, getCart } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import {
  DELIVERY_FEE,
  TAX,
  formatCurrency,
  getCartItems,
  getItemImage,
  getItemName,
  getItemSubtotal,
  getItemsSubtotal,
  hasMissingRequiredSize,
} from "@/utils/orderDisplay";

const requiredAddressFields = [
  "fullName",
  "phone",
  "city",
  "district",
  "addressLine1",
];

const emptyAddress = {
  fullName: "",
  phone: "",
  city: "",
  district: "",
  addressLine1: "",
  addressLine2: "",
  postalCode: "",
};

const CheckoutPage = () => {
  const router = useRouter();
  const { token, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState(emptyAddress);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const subtotal = useMemo(() => getItemsSubtotal(items), [items]);
  const total = subtotal + DELIVERY_FEE + TAX;

  useEffect(() => {
    let ignore = false;

    const loadCart = async () => {
      if (authLoading) return;

      await Promise.resolve();
      if (ignore) return;

      if (!token) {
        setItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await getCart(token);

      if (ignore) return;

      if (!result.success) {
        setError(result.message || "Failed to load cart.");
        setItems([]);
        setLoading(false);
        return;
      }

      setItems(getCartItems(result.data));
      setLoading(false);
    };

    loadCart();

    return () => {
      ignore = true;
    };
  }, [authLoading, token]);

  const updateAddress = (event) => {
    const { name, value } = event.target;
    setShippingAddress((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const validateCheckout = () => {
    if (!token) return "Sign in before checkout.";
    if (items.length === 0) return "Your cart is empty.";
    if (hasMissingRequiredSize(items)) {
      return "One or more cart items need a selected size.";
    }

    const missingField = requiredAddressFields.find(
      (field) => !shippingAddress[field].trim(),
    );

    if (missingField) {
      return "Please complete all required shipping fields.";
    }

    return "";
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateCheckout();
    if (validationError) {
      setError(validationError);
      return;
    }

    setPlacing(true);
    const result = await createOrder(token, {
      shippingAddress: Object.fromEntries(
        Object.entries(shippingAddress).map(([key, value]) => [key, value.trim()]),
      ),
      deliveryFee: DELIVERY_FEE,
      tax: TAX,
      notes: notes.trim(),
    });
    setPlacing(false);

    if (!result.success) {
      setError(result.message || "Failed to place order.");
      return;
    }

    setSuccess("Order placed successfully.");
    setItems([]);

    const orderId = result.data?._id || result.data?.id;
    setTimeout(() => {
      router.push(orderId ? `/orders/${orderId}` : "/orders");
    }, 700);
  };

  if (!authLoading && !token) {
    return (
      <main className="mt-14 min-h-screen bg-zinc-50 px-5 py-12 text-zinc-950 sm:px-8 lg:px-10">
        <section className="mx-auto max-w-3xl rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-4xl font-semibold tracking-tight">Sign in to checkout</h1>
          <p className="mt-3 text-sm text-zinc-500">Checkout requires an authenticated cart.</p>
          <Link
            href="/user?next=/checkout"
            className="mt-6 inline-flex rounded-lg bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Sign in
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mt-14 min-h-screen bg-zinc-50 px-5 py-8 text-zinc-950 sm:px-8 lg:px-10">
      <form onSubmit={handlePlaceOrder} className="mx-auto max-w-7xl">
        <div className="border-b border-zinc-200 pb-6">
          <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Checkout</p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight md:text-6xl">
            Place order
          </h1>
        </div>

        {(error || success) && (
          <div
            className={`mt-6 rounded-lg border px-4 py-3 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {error || success}
          </div>
        )}

        {loading ? (
          <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-8 text-sm text-zinc-500 shadow-sm">
            Loading checkout...
          </div>
        ) : items.length === 0 ? (
          <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight">Your cart is empty</h2>
            <Link
              href="/shops"
              className="mt-6 inline-flex rounded-lg bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
            <section className="space-y-6">
              <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-semibold tracking-tight">Shipping address</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {[
                    ["fullName", "Full name", true],
                    ["phone", "Phone", true],
                    ["city", "City", true],
                    ["district", "District", true],
                    ["addressLine1", "Address line 1", true],
                    ["addressLine2", "Address line 2", false],
                    ["postalCode", "Postal code", false],
                  ].map(([name, label, required]) => (
                    <label key={name} className={name.includes("address") ? "md:col-span-2" : ""}>
                      <span className="text-sm font-medium text-zinc-800">
                        {label} {required && <span className="text-red-500">*</span>}
                      </span>
                      <input
                        name={name}
                        value={shippingAddress[name]}
                        onChange={updateAddress}
                        className="mt-2 h-12 w-full rounded-lg border border-zinc-300 bg-white px-4 text-sm outline-none transition focus:border-zinc-950 focus:ring-4 focus:ring-zinc-100"
                      />
                    </label>
                  ))}
                </div>

                <label className="mt-4 block">
                  <span className="text-sm font-medium text-zinc-800">Notes</span>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={4}
                    className="mt-2 w-full resize-none rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-4 focus:ring-zinc-100"
                    placeholder="Delivery notes"
                  />
                </label>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-semibold tracking-tight">Items</h2>
                <div className="mt-5 space-y-4">
                  {items.map((item) => {
                    const quantity = Number(item.quantity || 1);
                    const price = Number(item.price || item.product?.price || 0);

                    return (
                      <article
                        key={`${item.productId}-${item.size || "no-size"}`}
                        className="grid gap-4 border-b border-zinc-100 pb-4 last:border-0 last:pb-0 sm:grid-cols-[88px_minmax(0,1fr)]"
                      >
                        <div className="aspect-square overflow-hidden rounded-lg bg-zinc-100">
                          <img
                            src={getItemImage(item)}
                            alt={getItemName(item)}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex min-w-0 justify-between gap-4">
                          <div>
                            <h3 className="font-semibold tracking-tight">{getItemName(item)}</h3>
                            <p className="mt-1 text-sm text-zinc-500">
                              Qty {quantity} · {formatCurrency(price)}
                            </p>
                            {item.size && (
                              <p className="mt-1 text-sm font-medium text-zinc-700">
                                Size: {String(item.size).toUpperCase()}
                              </p>
                            )}
                          </div>
                          <p className="shrink-0 text-sm font-semibold">
                            {formatCurrency(getItemSubtotal(item))}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>

            <aside>
              <div className="sticky top-20 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold tracking-tight">Order summary</h2>
                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Delivery fee</span>
                    <span className="font-semibold">{formatCurrency(DELIVERY_FEE)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Tax</span>
                    <span className="font-semibold">{formatCurrency(TAX)}</span>
                  </div>
                </div>
                <div className="mt-6 flex justify-between border-t border-zinc-200 pt-5">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-2xl font-semibold">{formatCurrency(total)}</span>
                </div>
                <button
                  type="submit"
                  disabled={placing}
                  className="mt-6 h-12 w-full rounded-lg bg-zinc-950 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
                >
                  {placing ? "Placing..." : "Place order"}
                </button>
              </div>
            </aside>
          </div>
        )}
      </form>
    </main>
  );
};

export default CheckoutPage;
