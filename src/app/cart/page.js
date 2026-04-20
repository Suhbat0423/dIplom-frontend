"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { clearCart, deleteCartItem, getCart, updateCartItem } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import { hasMissingRequiredSize } from "@/utils/orderDisplay";

const fallbackImage =
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
};

const getItemId = (item) => {
  return item?._id || item?.id || item?.itemId || item?.cartItemId;
};

const getProductId = (item) => {
  return item?.productId || item?.product?._id || item?.product?.id;
};

const getItemImage = (item) => {
  const image = item?.imageUrl || item?.image || item?.product?.imageUrl;

  if (image?.startsWith("http") || image?.startsWith("/")) {
    return image;
  }

  return fallbackImage;
};

const normalizeCartItems = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.cart?.items)) return data.cart.items;
  if (Array.isArray(data?.data?.items)) return data.data.items;
  return [];
};

const CartPage = () => {
  const { token, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState("");
  const [message, setMessage] = useState("");

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      return sum + Number(item.price || item.product?.price || 0) * Number(item.quantity || 1);
    }, 0);
    const itemCount = items.reduce((sum, item) => sum + Number(item.quantity || 1), 0);

    return {
      subtotal,
      itemCount,
      shipping: subtotal > 0 ? 0 : 0,
      total: subtotal,
    };
  }, [items]);

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
      setMessage("");

      const result = await getCart(token);

      if (ignore) return;

      if (!result.success) {
        setMessage(result.message || "Failed to load your cart.");
        setItems([]);
        setLoading(false);
        return;
      }

      setItems(normalizeCartItems(result.data));
      setLoading(false);
    };

    loadCart();

    return () => {
      ignore = true;
    };
  }, [authLoading, token]);

  const changeQuantity = async (item, nextQuantity) => {
    const itemId = getItemId(item);

    if (!itemId || nextQuantity < 1) return;

    setPendingAction(`quantity-${itemId}`);
    setMessage("");

    const result = await updateCartItem(token, itemId, nextQuantity);

    if (!result.success) {
      setMessage(result.message || "Failed to update item quantity.");
      setPendingAction("");
      return;
    }

    setItems((current) =>
      current.map((cartItem) =>
        getItemId(cartItem) === itemId
          ? { ...cartItem, quantity: nextQuantity }
          : cartItem,
      ),
    );
    setPendingAction("");
  };

  const removeItem = async (item) => {
    const itemId = getItemId(item);

    if (!itemId) return;

    setPendingAction(`remove-${itemId}`);
    setMessage("");

    const result = await deleteCartItem(token, itemId);

    if (!result.success) {
      setMessage(result.message || "Failed to remove this item.");
      setPendingAction("");
      return;
    }

    setItems((current) => current.filter((cartItem) => getItemId(cartItem) !== itemId));
    setPendingAction("");
  };

  const handleClearCart = async () => {
    setPendingAction("clear");
    setMessage("");

    const result = await clearCart(token);

    if (!result.success) {
      setMessage(result.message || "Failed to clear your cart.");
      setPendingAction("");
      return;
    }

    setItems([]);
    setPendingAction("");
    setMessage("Cart cleared.");
  };

  if (!authLoading && !token) {
    return (
      <main className="mt-14 min-h-screen bg-zinc-50 px-5 py-12 text-zinc-950 sm:px-8 lg:px-10">
        <section className="mx-auto max-w-3xl rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Cart</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Sign in to view your cart</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-500">
            Your cart is saved to your account and requires an authenticated session.
          </p>
          <Link
            href="/user?next=/cart"
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
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 border-b border-zinc-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Cart</p>
            <h1 className="mt-2 text-5xl font-semibold tracking-tight md:text-6xl">
              Shopping cart
            </h1>
            <p className="mt-3 text-sm text-zinc-500">
              {totals.itemCount} {totals.itemCount === 1 ? "item" : "items"} ready for checkout.
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClearCart}
              disabled={pendingAction === "clear"}
              className="rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 shadow-sm transition hover:border-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pendingAction === "clear" ? "Clearing..." : "Clear cart"}
            </button>
          )}
        </div>

        {message && (
          <div
            className={`mt-6 rounded-lg border px-4 py-3 text-sm ${
              message.includes("Failed")
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {message}
          </div>
        )}

        {loading ? (
          <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-8 text-sm text-zinc-500 shadow-sm">
            Loading cart...
          </div>
        ) : items.length === 0 ? (
          <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight">Your cart is empty</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Browse brands and add products when you are ready.
            </p>
            <Link
              href="/shops"
              className="mt-6 inline-flex rounded-lg bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <section className="space-y-4">
              {items.map((item) => {
                const itemId = getItemId(item);
                const productId = getProductId(item);
                const quantity = Number(item.quantity || 1);
                const price = Number(item.price || item.product?.price || 0);
                const isQuantityPending = pendingAction === `quantity-${itemId}`;
                const isRemovePending = pendingAction === `remove-${itemId}`;

                return (
                  <article
                    key={itemId || productId || item.name}
                    className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-[132px_minmax(0,1fr)]"
                  >
                    <div className="aspect-square overflow-hidden rounded-lg bg-zinc-100">
                      <img
                        src={getItemImage(item)}
                        alt={item.name || item.product?.name || "Cart item"}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex min-w-0 flex-col justify-between gap-5">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                          <h2 className="truncate text-xl font-semibold tracking-tight">
                            {item.name || item.product?.name || "Product"}
                          </h2>
                          <p className="mt-1 text-sm text-zinc-500">
                            Store ID: {item.storeId || item.product?.storeId || "Unknown"}
                          </p>
                          {item.size && (
                            <p className="mt-1 text-sm font-medium text-zinc-700">
                              Size: {String(item.size).toUpperCase()}
                            </p>
                          )}
                          {productId && (
                            <Link
                              href={`/products/${productId}`}
                              className="mt-3 inline-flex text-sm font-semibold text-zinc-900 underline underline-offset-4"
                            >
                              View product
                            </Link>
                          )}
                        </div>

                        <div className="text-left md:text-right">
                          <p className="text-lg font-semibold">{formatCurrency(price)}</p>
                          <p className="mt-1 text-sm text-zinc-500">
                            {formatCurrency(price * quantity)} total
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex h-11 w-36 items-center justify-between rounded-lg border border-zinc-300 bg-white">
                          <button
                            type="button"
                            onClick={() => changeQuantity(item, quantity - 1)}
                            disabled={quantity <= 1 || isQuantityPending}
                            className="h-full px-4 text-lg text-zinc-600 transition hover:text-zinc-950 disabled:cursor-not-allowed disabled:text-zinc-300"
                          >
                            -
                          </button>
                          <span className="text-sm font-semibold">
                            {isQuantityPending ? "..." : quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => changeQuantity(item, quantity + 1)}
                            disabled={isQuantityPending}
                            className="h-full px-4 text-lg text-zinc-600 transition hover:text-zinc-950 disabled:cursor-not-allowed disabled:text-zinc-300"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item)}
                          disabled={isRemovePending}
                          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isRemovePending ? "Removing..." : "Remove"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside>
              <div className="sticky top-20 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold tracking-tight">Order summary</h2>
                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="font-semibold">{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Shipping</span>
                    <span className="font-semibold">Calculated later</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Tax</span>
                    <span className="font-semibold">Calculated later</span>
                  </div>
                </div>

                <div className="mt-6 border-t border-zinc-200 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold">Total</span>
                    <span className="text-2xl font-semibold">
                      {formatCurrency(totals.total)}
                    </span>
                  </div>
                </div>

                {hasMissingRequiredSize(items) ? (
                  <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    Select a size for every sized product before checkout.
                  </div>
                ) : (
                  <Link
                    href="/checkout"
                    className="mt-6 flex h-12 w-full items-center justify-center rounded-lg bg-zinc-950 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-zinc-800"
                  >
                    Checkout
                  </Link>
                )}

                <Link
                  href="/shops"
                  className="mt-3 flex h-12 w-full items-center justify-center rounded-lg border border-zinc-300 bg-white text-sm font-semibold text-zinc-900 transition hover:border-zinc-950"
                >
                  Continue shopping
                </Link>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
};

export default CartPage;
