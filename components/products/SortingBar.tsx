"use client";

type SortOption = { value: string; label: string };

type SortingBarProps = {
  locale: string;
  segment: string;
  q?: string;
  sort: string;
  options: SortOption[];
  label: string;
};

/**
 * Ordenación mínima via GET — sin JS obligatorio, mantiene q + segment.
 */
export default function SortingBar({
  locale,
  segment,
  q,
  sort,
  options,
  label,
}: SortingBarProps) {
  const action = `/${locale}/products`;

  return (
    <form
      action={action}
      method="get"
      className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end"
    >
      {q?.trim() ? <input type="hidden" name="q" value={q.trim()} /> : null}
      {segment && segment !== "all" ? (
        <input type="hidden" name="segment" value={segment} />
      ) : null}
      <label className="sr-only" htmlFor="products-sort">
        {label}
      </label>
      <select
        id="products-sort"
        name="sort"
        defaultValue={sort || "featured"}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="w-full cursor-pointer rounded-sm border border-white/10 bg-[#0f1412]/90 px-4 py-2.5 text-xs text-text-muted outline-none transition hover:border-white/18 focus:border-accent-gold/40 focus:ring-1 focus:ring-accent-gold/30 sm:max-w-[240px] sm:text-[0.7rem] sm:uppercase sm:tracking-[0.14em]"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </form>
  );
}
