import Link from "next/link";

const SectionHeading = ({
  eyebrow,
  title,
  description,
  ctaHref,
  ctaLabel,
}) => {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          {title}
        </h2>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
            {description}
          </p>
        )}
      </div>

      {ctaHref && ctaLabel && (
        <Link
          href={ctaHref}
          className="inline-flex text-sm font-semibold uppercase tracking-[0.16em] text-zinc-950 transition hover:text-zinc-500"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
};

export default SectionHeading;
