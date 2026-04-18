import type { Product } from "@/lib/products";
import type { Locale } from "@/lib/i18n/config";
import ProductCardSimple from "@/components/ProductCardSimple";
import ScrollReveal from "@/components/blog/ScrollReveal";
import EditorialBreak from "@/components/products/EditorialBreak";

const CHUNK = 6;

type Labels = {
  viewProduct?: string;
  noImage?: string;
  addToCart?: string;
};

export type EditorialBreakConfig = {
  variant: "image" | "text";
  title: string;
  imageSrc?: string;
  imageAlt?: string;
};

type ProductsEditorialGridProps = {
  products: Product[];
  locale: Locale;
  labels: Labels;
  analyticsListName: string;
  breaks: [EditorialBreakConfig | null, EditorialBreakConfig | null];
};

function chunkProducts(list: Product[], size: number): Product[][] {
  const out: Product[][] = [];
  for (let i = 0; i < list.length; i += size) {
    out.push(list.slice(i, i + size));
  }
  return out;
}

/**
 * Rejilla con ritmo editorial: primer producto destacado si hay volumen, pausas entre bloques.
 */
export default function ProductsEditorialGrid({
  products,
  locale,
  labels,
  analyticsListName,
  breaks,
}: ProductsEditorialGridProps) {
  if (products.length === 0) return null;

  const chunks = chunkProducts(products, CHUNK);
  const [breakAfterFirst, breakAfterSecond] = breaks;

  return (
    <div className="space-y-0">
      {chunks.map((chunk, chunkIdx) => (
        <div key={`chunk-${chunkIdx}`}>
          <ScrollReveal>
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">
              {chunk.map((product, j) => {
                const isFeatured =
                  chunkIdx === 0 && j === 0 && chunk.length >= 4;
                return (
                  <div
                    key={product.id}
                    className={
                      isFeatured
                        ? "sm:col-span-2 xl:col-span-2 xl:max-w-none"
                        : undefined
                    }
                  >
                    <ProductCardSimple
                      product={product}
                      locale={locale}
                      labels={labels}
                      analyticsListName={analyticsListName}
                      editorial
                    />
                  </div>
                );
              })}
            </div>
          </ScrollReveal>

          {chunkIdx === 0 &&
          chunks.length > 1 &&
          breakAfterFirst ? (
            <EditorialBreak {...breakAfterFirst} />
          ) : null}
          {chunkIdx === 1 &&
          chunks.length > 2 &&
          breakAfterSecond ? (
            <EditorialBreak {...breakAfterSecond} />
          ) : null}
        </div>
      ))}
    </div>
  );
}
