"use client";

import { getPaymentId, getPaymentStatus } from "@/api/paymentApi";
import { usePayment } from "@/hooks/usePayment";
import { NoticeBanner } from "@/components/ui/PageState";
import { formatDate, getStatusClass } from "@/utils/orderDisplay";

const STATUS_LABELS = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

const getPaymentTimestamp = (payment) => {
  return payment?.updatedAt || payment?.confirmedAt || payment?.createdAt || null;
};

const getStatusLabel = (status) => {
  if (!status) return "Pending";

  return STATUS_LABELS[status] || status.charAt(0).toUpperCase() + status.slice(1);
};

const Button = ({ children, disabled, onClick, tone = "primary" }) => {
  const toneClass =
    tone === "secondary"
      ? "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-950"
      : tone === "danger"
        ? "border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100"
        : "border-zinc-950 bg-zinc-950 text-white hover:bg-zinc-800";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-11 items-center justify-center rounded-lg border px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-100 disabled:text-zinc-400 ${toneClass}`}
    >
      {children}
    </button>
  );
};

const PaymentSection = ({ orderId, token, onStatusChange = null }) => {
  const {
    payment,
    loading,
    refreshing,
    action,
    error,
    successMessage,
    create,
    confirm,
    fail,
    refund,
    refreshPayment,
  } = usePayment(orderId, token);

  const paymentId = getPaymentId(payment);
  const status = getPaymentStatus(payment);
  const showPendingActions = paymentId && status === "pending";
  const showRefundAction = paymentId && status === "paid";
  const canRetry = !paymentId || status === "failed";
  const handleCreate = () => {
    void create().then(() => onStatusChange?.());
  };
  const handleConfirm = () => {
    void confirm().then(() => onStatusChange?.());
  };
  const handleFail = () => {
    void fail().then(() => onStatusChange?.());
  };
  const handleRefund = () => {
    void refund().then(() => onStatusChange?.());
  };
  const handleRefresh = () => {
    void refreshPayment().then(() => onStatusChange?.());
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-zinc-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Payment</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Demo flow with manual gateway states: create a payment request, confirm or fail it, then issue a refund if the order was already paid.
          </p>
        </div>
        <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(status)}`}>
          {paymentId ? getStatusLabel(status) : "Not started"}
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {loading ? (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500">
            Loading payment...
          </div>
        ) : (
          <>
            <div className="grid gap-3 text-sm text-zinc-600">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="font-semibold text-zinc-900">Demo steps</p>
                <p className="mt-1 text-zinc-500">
                  1. Create payment. 2. Confirm or fail it. 3. Refund paid orders if needed. 4. Refresh to sync the order status panel.
                </p>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-zinc-500">Payment ID</span>
                <span className="text-right font-medium text-zinc-950">
                  {paymentId || "No payment yet"}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-zinc-500">Method</span>
                <span className="font-medium text-zinc-950">
                  {payment?.method || "card"}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-zinc-500">Provider</span>
                <span className="font-medium text-zinc-950">
                  {payment?.provider || "manual"}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-zinc-500">Currency</span>
                <span className="font-medium text-zinc-950">
                  {payment?.currency || "MNT"}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-zinc-500">Last updated</span>
                <span className="text-right font-medium text-zinc-950">
                  {getPaymentTimestamp(payment) ? formatDate(getPaymentTimestamp(payment)) : "Not available"}
                </span>
              </div>
            </div>

            {error && (
              <NoticeBanner tone="error">
                {error}
              </NoticeBanner>
            )}

            {successMessage && (
              <NoticeBanner tone="success">
                {successMessage}
              </NoticeBanner>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {canRetry && (
                <Button disabled={action === "create"} onClick={handleCreate}>
                  {action === "create" ? "Creating..." : paymentId ? "Retry Payment" : "Pay Now"}
                </Button>
              )}

              {showPendingActions && (
                <Button disabled={action === "confirm"} onClick={handleConfirm} tone="secondary">
                  {action === "confirm" ? "Confirming..." : "Confirm Payment"}
                </Button>
              )}

              {showPendingActions && (
                <Button disabled={action === "fail"} onClick={handleFail} tone="danger">
                  {action === "fail" ? "Failing..." : "Fail Payment"}
                </Button>
              )}

              {showRefundAction && (
                <Button disabled={action === "refund"} onClick={handleRefund} tone="danger">
                  {action === "refund" ? "Refunding..." : "Refund Payment"}
                </Button>
              )}

              <Button
                disabled={refreshing || loading}
                onClick={handleRefresh}
                tone="secondary"
              >
                {refreshing ? "Refreshing..." : "Refresh Status"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSection;
