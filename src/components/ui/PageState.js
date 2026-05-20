import Link from "next/link";

export const NoticeBanner = ({ tone = "neutral", children }) => {
  const toneClass =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : tone === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : tone === "warning"
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : "border-zinc-200 bg-white text-zinc-700";

  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${toneClass}`}>
      {children}
    </div>
  );
};

export const PanelState = ({
  title,
  description,
  tone = "neutral",
  actionHref = "",
  actionLabel = "",
}) => {
  const toneClass =
    tone === "error"
      ? "border-red-200 bg-red-50"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50"
        : "border-zinc-200 bg-white";

  return (
    <section className={`rounded-lg border p-8 text-center shadow-sm ${toneClass}`}>
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">{title}</h2>
      {description && <p className="mt-2 text-sm text-zinc-500">{description}</p>}
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex rounded-lg bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          {actionLabel}
        </Link>
      )}
    </section>
  );
};

export const LoadingPanel = ({ message = "Loading..." }) => {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
      <p className="text-sm text-zinc-500">{message}</p>
    </section>
  );
};
