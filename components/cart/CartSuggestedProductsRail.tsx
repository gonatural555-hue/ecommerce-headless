"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import type { Locale } from "@/lib/i18n/config";
import ProductCardSimple from "@/components/ProductCardSimple";
import HorizontalSwipeHint from "@/components/HorizontalSwipeHint";

type Labels = {
  viewProduct: string;
  addToCart: string;
  noImage: string;
};

type Props = {
  locale: Locale;
  labels: Labels;
  /** IDs de producto en el carrito (mismo `id` que en el catálogo / PRODUCT_CATEGORY_MAP). */
  cartItemIds: string[];
  /** Etiqueta accesible de la región del carrusel (i18n). */
  regionAriaLabel: string;
  /** Mensaje si falla la carga (i18n). */
  suggestError: string;
};

/**
 * Carril horizontal de sugerencias: los datos vienen de GET /api/cart/suggestions
 * para mantener el catálogo y el mapa de categorías solo en el servidor.
 */
export default function CartSuggestedProductsRail({
  locale,
  labels,
  cartItemIds,
  regionAriaLabel,
  suggestError,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const idsKey = useMemo(() => cartItemIds.slice().sort().join(","), [cartItemIds]);

  useEffect(() => {
    if (cartItemIds.length === 0) {
      setProducts([]);
      setError(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(false);

    const q = encodeURIComponent(cartItemIds.join(","));
    fetch(`/api/cart/suggestions?ids=${q}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("suggestions failed");
        return res.json() as Promise<{ products: Product[] }>;
      })
      .then((data) => {
        setProducts(Array.isArray(data.products) ? data.products : []);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [idsKey, cartItemIds]);

  if (cartItemIds.length === 0) {
    return null;
  }

  return (
    <div
      className="mt-6 min-h-[120px]"
      role="region"
      aria-label={regionAriaLabel}
      aria-busy={loading}
    >
      {loading && (
        <div className="flex gap-4 overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-52 min-w-[200px] flex-1 animate-pulse rounded-lg bg-white/5 motion-reduce:animate-none"
              aria-hidden
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="text-sm text-text-muted py-4" role="alert">
          {suggestError}
        </p>
      )}

      {!loading && !error && products.length === 0 && (
        <div
          className="rounded-xl border border-white/5 bg-white/[0.02] min-h-[120px]"
          aria-hidden
        />
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <HorizontalSwipeHint className="mt-1 mb-2" />
          <div
            className="-mx-1 overflow-x-auto overflow-y-visible pb-2 scroll-smooth snap-x snap-mandatory scrollbar-rail-premium"
            tabIndex={0}
            style={{ WebkitOverflowScrolling: "touch" }}
          >
          <div className="flex gap-4 md:gap-5 w-max px-1">
            {products.map((product) => (
              <div
                key={product.id}
                className="snap-start shrink-0 min-w-[min(78vw,260px)] max-w-[280px] sm:min-w-[240px] sm:max-w-[300px] rounded-2xl transition-[transform,box-shadow] duration-300 ease-out motion-reduce:transition-none hover:scale-[1.03] hover:z-10 hover:shadow-[0_20px_44px_-12px_rgba(0,0,0,0.5)] motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none"
              >
                <ProductCardSimple
                  product={product}
                  locale={locale}
                  labels={labels}
                />
              </div>
            ))}
          </div>
        </div>
        </>
      )}
    </div>
  );
}
