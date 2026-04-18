import Link from "next/link";
import ScrollReveal from "@/components/blog/ScrollReveal";
import {
  buildProductsListHref,
  type ProductSegment,
} from "@/lib/products-page-segments";

export type CategorySelectorItem = {
  id: ProductSegment;
  label: string;
};

type CategorySelectorProps = {
  locale: string;
  items: CategorySelectorItem[];
  active: ProductSegment;
  q?: string;
  sort?: string;
};

/**
 * Píldoras grandes estilo editorial (misma lógica que Home): estado activo claro.
 */
export default function CategorySelector({
  locale,
  items,
  active,
  q,
  sort,
}: CategorySelectorProps) {
  return (
    <ScrollReveal className="w-full">
      <div className="flex flex-wrap justify-center gap-3 md:gap-4">
        {items.map((item) => {
          const isActive = active === item.id;
          const href = buildProductsListHref(locale, {
            q,
            segment: item.id,
            sort,
          });
          return (
            <Link
              key={item.id}
              href={href}
              scroll={false}
              className={[
                "inline-flex min-h-[48px] min-w-[120px] items-center justify-center rounded-full px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] transition duration-300 md:min-w-[132px] md:px-8 md:text-[0.7rem] md:tracking-[0.22em]",
                isActive
                  ? "border border-accent-gold/70 bg-accent-gold/15 text-accent-gold shadow-[0_0_0_1px_rgba(200,155,60,0.25)]"
                  : "border border-white/10 bg-white/[0.03] text-text-muted hover:border-white/20 hover:bg-white/[0.06] hover:text-text-primary",
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
