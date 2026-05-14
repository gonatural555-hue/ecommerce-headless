"use client";

type SortOption = { value: string; label: string };

type SortingBarProps = {
  locale: string;
  q?: string;
  sort: string;
  /** Conserva filtro por categoría al ordenar */
  category?: string;
  options: SortOption[];
  label: string;
};

/**
 * Ordenación mínima via GET — sin JS obligatorio, mantiene q + category.
 */
export default function SortingBar({
  locale,
  q,
  sort,
  category,
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
      {category?.trim() ? (
        <input type="hidden" name="category" value={category.trim()} />
      ) : null}
      <label className="sr-only" htmlFor="products-sort">
        {label}
      </label>
      <select
        id="products-sort"
        name="sort"
        defaultValue={sort || "featured"}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="w-full cursor-pointer rounded-sm border border-[rgba(46,74,54,0.2)] bg-[rgba(255,255,255,0.55)] px-4 py-2.5 text-xs text-[rgba(46,74,54,0.9)] shadow-[0_4px_16px_-8px_rgba(46,74,54,0.12)] outline-none backdrop-blur-sm transition duration-200 hover:border-[rgba(46,74,54,0.3)] focus:border-accent-gold/55 focus:ring-2 focus:ring-accent-gold/25 sm:max-w-[240px] sm:text-[0.7rem] sm:uppercase sm:tracking-[0.14em]"
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
