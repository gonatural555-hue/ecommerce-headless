import Link from "next/link";
import ScrollReveal from "@/components/blog/ScrollReveal";
import { resolveProductsCategoryParam } from "@/lib/categories";
import { buildProductsListHref } from "@/lib/products-page-segments";

export type CategorySelectorItem = {
  id: string;
  label: string;
};

type CategorySelectorProps = {
  locale: string;
  items: CategorySelectorItem[];
  /** `null` = vista “Todo”; si no, slug resuelto (p. ej. outdoor-adventure) */
  activeResolvedCategorySlug: string | null;
  q?: string;
  sort?: string;
};

/**
 * Píldoras grandes estilo editorial (misma lógica que Home): estado activo claro.
 */
export default function CategorySelector({
  locale,
  items,
  activeResolvedCategorySlug,
  q,
  sort,
}: CategorySelectorProps) {
  return (
    <ScrollReveal className="w-full">
      <div className="flex flex-wrap justify-center gap-3 md:gap-4">
        {items.map((item) => {
          const isActive =
            item.id === "all"
              ? activeResolvedCategorySlug === null
              : resolveProductsCategoryParam(item.id) ===
                activeResolvedCategorySlug;
          const href =
            item.id === "all"
              ? buildProductsListHref(locale, { q, sort })
              : buildProductsListHref(locale, {
                  q,
                  sort,
                  category: item.id,
                });
          return (
            <Link
              key={item.id}
              href={href}
              scroll={false}
              className={[
                "inline-flex min-h-[48px] min-w-[120px] items-center justify-center rounded-full px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-sm transition duration-300 md:min-w-[132px] md:px-8 md:text-[0.7rem] md:tracking-[0.22em]",
                isActive
                  ? "border border-accent-gold/65 bg-accent-gold/22 text-accent-gold shadow-[0_8px_24px_-8px_rgba(0,0,0,0.45)] ring-1 ring-accent-gold/20"
                  : "border border-white/18 bg-white/[0.06] text-white/[0.82] hover:border-white/28 hover:bg-white/[0.1] hover:text-text-primary",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </ScrollReveal>
  );
}
