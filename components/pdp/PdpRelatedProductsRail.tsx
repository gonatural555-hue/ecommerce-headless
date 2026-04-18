import type { Product } from "@/lib/products";
import type { Locale } from "@/lib/i18n/config";
import ProductCardSimple from "@/components/ProductCardSimple";
import type { UISurface } from "@/lib/ui-surface";

type Labels = {
  viewProduct: string;
  addToCart: string;
  noImage: string;
};

type Props = {
  title: string;
  products: Product[];
  locale: Locale;
  labels: Labels;
  surface?: UISurface;
};

/**
 * Carril horizontal de productos relacionados — misma tarjeta editorial que el listado.
 */
export default function PdpRelatedProductsRail({
  title,
  products,
  locale,
  labels,
  surface = "dark",
}: Props) {
  const L = surface === "light";
  if (products.length === 0) return null;

  return (
    <section
      className={
        L
          ? "border-t border-neutral-200/90 py-16 md:py-20"
          : "border-t border-white/[0.07] py-16 md:py-20"
      }
    >
      <div className="px-6 sm:px-10 lg:px-16">
        <h2
          className={
            L
              ? "text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500"
              : "text-xs font-semibold uppercase tracking-[0.2em] text-text-muted"
          }
        >
          {title}
        </h2>
        <div className="mt-8 -mx-6 flex gap-6 overflow-x-auto px-6 pb-2 scrollbar-rail-premium sm:-mx-10 sm:px-10 lg:-mx-16 lg:px-16">
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[min(280px,78vw)] shrink-0 sm:w-[300px]"
            >
              <ProductCardSimple
                product={product}
                locale={locale}
                labels={labels}
                analyticsListName="pdp_related"
                editorial
                surface={surface}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
