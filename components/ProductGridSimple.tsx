import { Product } from "@/lib/products";
import ProductCardSimple from "./ProductCardSimple";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  products: Product[];
  locale: Locale;
  labels?: {
    viewProduct?: string;
    noImage?: string;
    addToCart?: string;
  };
};

export default function ProductGridSimple({ products, locale, labels }: Props) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCardSimple
          key={product.id}
          product={product}
          locale={locale}
          labels={labels}
        />
      ))}
    </section>
  );
}
