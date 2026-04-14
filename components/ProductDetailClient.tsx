"use client";

import { useEffect, useMemo, useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductDesktopGallery from "@/components/ProductDesktopGallery";
import VariantSelector from "@/components/VariantSelector";
import type {
  ProductImages,
  VariantImagesMap,
  VariantImagesValueMap,
  VariantImageSet,
} from "@/lib/product-images";
import type {
  ProductVariants,
  VariantDefinition,
} from "@/lib/product-variants";
import { trackViewItem } from "@/lib/analytics/ga4";

type ProductSummary = {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  shortDescription?: string;
  images: string[];
  freeShipping?: boolean;
};

export type PdpDesktopContent = {
  benefitsTitle: string;
  specsToggle: string;
  idealForLabel: string;
  trustMicrocopy: string;
  shippingHeading: string;
  shippingEurope: string;
  shippingLatam: string;
  returns: string;
  benefits: string[];
  specBullets: string[];
  idealForLine: string;
};

type Props = {
  product: ProductSummary;
  seoH1: string;
  productImages: ProductImages;
  productVariants: ProductVariants | null;
  ctaLabel: string;
  noImageLabel: string;
  freeShippingLabel?: string;
  pdpDesktop: PdpDesktopContent;
};

function getDefaultSelections(variants: VariantDefinition[]) {
  const selections: Record<string, string> = {};

  variants.forEach((variant) => {
    const options = variant.options || [];
    if (options.length === 0) return;

    if (variant.default) {
      const match = options.find(
        (opt) => opt.value === variant.default || opt.label === variant.default
      );
      if (match) {
        selections[variant.type] = match.value || match.label;
        return;
      }
    }

    selections[variant.type] = options[0].value || options[0].label;
  });

  return selections;
}

export default function ProductDetailClient({
  product,
  seoH1,
  productImages,
  productVariants,
  ctaLabel,
  noImageLabel,
  freeShippingLabel,
  pdpDesktop,
}: Props) {
  const showFullImage = product.id === "gn-ski-snow-pants-001";
  const baseFeatured =
    productImages.featured || product.images[0] || "";
  const baseGallery =
    productImages.gallery.length > 0
      ? productImages.gallery
      : product.images.slice(1);

  const initialSelections = useMemo(() => {
    if (!productVariants) return {};
    return getDefaultSelections(productVariants.variants);
  }, [productVariants]);

  const [selections, setSelections] = useState<Record<string, string>>(
    initialSelections
  );

  useEffect(() => {
    setSelections(initialSelections);
  }, [initialSelections]);

  useEffect(() => {
    trackViewItem({
      item_id: product.id,
      item_name: seoH1,
      price: product.price,
      item_category: product.category,
      quantity: 1,
    });
  }, [product.id, product.category, product.price, seoH1]);

  const activeImages = useMemo(() => {
    const defaultImages = {
      featured: baseFeatured,
      gallery: baseGallery,
    };

    if (!productImages.variantImages || Object.keys(selections).length === 0) {
      return defaultImages;
    }

    let variant: VariantImageSet | string[] | undefined;

    if (productVariants) {
      for (const variantDef of productVariants.variants) {
        const selectedValue = selections[variantDef.type];
        if (!selectedValue) continue;

        const typedMap = (productImages.variantImages as VariantImagesMap)[
          variantDef.type
        ];
        if (typedMap && typedMap[selectedValue]) {
          variant = typedMap[selectedValue];
          break;
        }
      }
    }

    if (!variant) {
      const flatMap = productImages.variantImages as VariantImagesValueMap;
      const selectedValues = Object.values(selections);
      for (const value of selectedValues) {
        if (flatMap[value]) {
          variant = flatMap[value];
          break;
        }
      }
    }

    if (!variant) {
      return defaultImages;
    }

    if (Array.isArray(variant)) {
      return {
        featured: variant[0] ?? defaultImages.featured,
        gallery: variant.length ? variant : defaultImages.gallery,
      };
    }

    return {
      featured: variant.featured?.[0] ?? defaultImages.featured,
      gallery: variant.gallery?.length
        ? variant.gallery
        : variant.featured ?? defaultImages.gallery,
    };
  }, [
    baseFeatured,
    baseGallery,
    productImages,
    productVariants,
    selections,
  ]);

  const resolvedPrice = useMemo(() => {
    if (!productVariants) return product.price;
    let price = product.price;

    productVariants.variants.forEach((variant) => {
      const selectedValue = selections[variant.type];
      if (!selectedValue) return;
      const option = variant.options.find(
        (opt) => (opt.value || opt.label) === selectedValue
      );
      if (option && typeof option.priceModifier === "number") {
        price += option.priceModifier;
      }
    });

    return price;
  }, [product.price, productVariants, selections]);

  const variantSelections = useMemo(() => {
    if (!productVariants) return undefined;
    const selectionsList = productVariants.variants
      .map((variant) => {
        const selection = selections[variant.type];
        if (!selection) return null;
        const option = variant.options.find(
          (opt) => (opt.value || opt.label) === selection
        );
        const value = option?.value || selection;
        const label = option?.label || selection;
        return {
          type: variant.type,
          typeLabel: variant.label,
          value,
          label,
        };
      })
      .filter(
        (entry): entry is NonNullable<typeof entry> => Boolean(entry)
      );
    return selectionsList.length ? selectionsList : undefined;
  }, [productVariants, selections]);

  const cartImage = activeImages.featured || product.images[0];

  const desktopLead =
    product.shortDescription?.trim() || product.description;

  const ctaDesktopClassName =
    "w-full lg:rounded-lg lg:py-3.5 lg:px-8 lg:text-[0.95rem] lg:font-semibold lg:tracking-wide lg:shadow-[0_10px_32px_rgba(0,0,0,0.35)] lg:transition-all lg:duration-200 lg:ease-out lg:hover:-translate-y-0.5 lg:hover:shadow-[0_14px_36px_rgba(200,155,60,0.32)]";

  return (
    <>
      {/* Mobile Layout (<1024px) - Mantener exactamente igual */}
      <section className="lg:hidden grid gap-6 md:gap-8 items-start max-w-full pb-20">
        {/* Galería Mobile */}
        <div className="relative z-0 bg-dark-surface/40 rounded-2xl p-3 md:p-6 max-w-full overflow-x-hidden">
          <ProductImageGallery
            featured={activeImages.featured}
            gallery={activeImages.gallery}
            title={product.title}
            noImageLabel={noImageLabel}
            featuredContainerClassName={
              showFullImage ? "aspect-auto overflow-visible" : undefined
            }
            featuredImageClassName={
              showFullImage ? "object-contain h-auto mx-auto p-2 md:p-3" : undefined
            }
          />
        </div>

        {/* Info principal Mobile */}
        <div className="relative z-10 flex flex-col gap-4 md:gap-7 min-w-0">
          {/* Mobile: Precio primero (más grande que título) */}
          <div className="order-1">
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-text-primary">
                ${resolvedPrice.toFixed(2)}
              </p>
              {product.freeShipping && freeShippingLabel && (
                <span className="text-xs uppercase tracking-[0.12em] text-text-muted/80">
                  {freeShippingLabel}
                </span>
              )}
            </div>
          </div>

          {/* Título - más pequeño en mobile */}
          <div className="order-2">
            <h1 className="text-xl font-semibold text-text-primary break-words">
              {seoH1}
            </h1>
          </div>

          {/* Variantes */}
          {productVariants && (
            <div className="order-3 pt-1">
              <VariantSelector
                variants={productVariants}
                onChange={setSelections}
                value={selections}
              />
            </div>
          )}

          {/* Descripción - visible arriba en mobile */}
          <div className="order-4 min-w-0">
            <p className="text-sm text-text-muted break-words line-clamp-3">
              {product.description}
            </p>
          </div>
        </div>
      </section>

      {/* Desktop Layout (>=1024px) — galería ~35% / contenido ~65% */}
      <section className="hidden lg:grid lg:grid-cols-[7fr_13fr] lg:gap-x-12 xl:gap-x-16 lg:gap-y-10 items-start max-w-full">
        <div className="relative z-0 min-w-0 pr-1 xl:pr-2">
          <div className="rounded-2xl bg-dark-surface/30 p-4 xl:p-5 ring-1 ring-white/[0.06]">
            <ProductDesktopGallery
              featured={activeImages.featured}
              gallery={activeImages.gallery}
              title={product.title}
              noImageLabel={noImageLabel}
              showFullImage={showFullImage}
            />
          </div>
        </div>

        <div className="relative z-10 min-w-0">
          <div className="sticky top-24 flex flex-col gap-8 xl:gap-10 min-w-0">
            <header className="space-y-4">
              <h1 className="text-3xl xl:text-[2rem] font-semibold text-text-primary tracking-tight break-words leading-snug text-balance">
                {seoH1}
              </h1>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pt-1 border-t border-white/[0.08]">
                <p className="text-2xl xl:text-[1.65rem] font-semibold text-text-primary tabular-nums">
                  ${resolvedPrice.toFixed(2)}
                </p>
                {product.freeShipping && freeShippingLabel && (
                  <span className="text-[11px] uppercase tracking-[0.14em] text-text-muted/85">
                    {freeShippingLabel}
                  </span>
                )}
              </div>
            </header>

            <div className="min-w-0">
              <p className="text-base xl:text-[1.05rem] text-text-primary/85 leading-relaxed break-words">
                {desktopLead}
              </p>
            </div>

            {pdpDesktop.benefits.length > 0 ? (
              <section
                className="rounded-xl border border-white/[0.08] bg-dark-surface/25 px-4 py-4 xl:px-5 xl:py-5"
                aria-labelledby="pdp-benefits-heading"
              >
                <h2
                  id="pdp-benefits-heading"
                  className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted mb-3"
                >
                  {pdpDesktop.benefitsTitle}
                </h2>
                <ul className="space-y-2.5">
                  {pdpDesktop.benefits.map((line) => (
                    <li
                      key={line}
                      className="flex gap-3 text-sm text-text-primary/90 leading-snug"
                    >
                      <span
                        className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-gold/90"
                        aria-hidden
                      />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {productVariants ? (
              <div className="pt-0.5">
                <VariantSelector
                  variants={productVariants}
                  onChange={setSelections}
                  value={selections}
                  appearance="premium"
                />
              </div>
            ) : null}

            {pdpDesktop.specBullets.length > 0 ? (
              <details className="group rounded-xl border border-white/[0.08] bg-dark-surface/20 px-4 py-3 xl:px-5 open:pb-4 transition-[padding] duration-200">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-text-primary select-none marker:content-none [&::-webkit-details-marker]:hidden">
                  <span>{pdpDesktop.specsToggle}</span>
                  <span
                    className="text-text-muted transition-transform duration-200 group-open:rotate-180"
                    aria-hidden
                  >
                    ▼
                  </span>
                </summary>
                <div className="mt-4 space-y-4 border-t border-white/[0.06] pt-4">
                  <ul className="space-y-2 text-sm text-text-primary/80 leading-relaxed">
                    {pdpDesktop.specBullets.map((spec) => (
                      <li key={spec} className="flex gap-2.5">
                        <span
                          className="mt-2 h-px w-3 shrink-0 bg-accent-gold/50 self-start"
                          aria-hidden
                        />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                  {pdpDesktop.idealForLine ? (
                    <p className="text-xs text-text-muted leading-relaxed">
                      <span className="font-medium text-text-primary/70">
                        {pdpDesktop.idealForLabel}
                      </span>{" "}
                      {pdpDesktop.idealForLine}
                    </p>
                  ) : null}
                </div>
              </details>
            ) : null}

            <div className="space-y-3 pt-1">
              <AddToCartButton
                id={product.id}
                title={product.title}
                price={resolvedPrice}
                image={cartImage}
                variantSelections={variantSelections}
                label={ctaLabel}
                className={ctaDesktopClassName}
              />
              <p className="text-center text-[11px] leading-relaxed text-text-muted/75 tracking-wide">
                {pdpDesktop.trustMicrocopy}
              </p>
            </div>

            <aside className="rounded-xl border border-white/[0.07] bg-dark-surface/30 px-4 py-4 xl:px-5 text-sm text-text-primary/80 leading-relaxed space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                {pdpDesktop.shippingHeading}
              </h2>
              <ul className="space-y-1.5 text-text-muted/90">
                <li>{pdpDesktop.shippingEurope}</li>
                <li>{pdpDesktop.shippingLatam}</li>
              </ul>
              <p className="text-text-muted/90 border-t border-white/[0.06] pt-3">
                {pdpDesktop.returns}
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* Mobile: Sticky CTA con microcopy */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark-base/98 backdrop-blur-md border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.4)] pt-3 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="max-w-full mx-auto">
          {/* Precio siempre visible en sticky */}
          <div className="mb-2 text-center">
            <p className="text-2xl font-bold text-text-primary">
              ${resolvedPrice.toFixed(2)}
            </p>
          </div>

          {/* CTA Button */}
          <AddToCartButton
            id={product.id}
            title={product.title}
            price={resolvedPrice}
            image={cartImage}
            variantSelections={variantSelections}
            label={ctaLabel}
            className="w-full mt-0 py-3.5 text-base"
          />

          {/* Microcopy de confianza */}
          <div className="mt-2.5 flex items-center justify-center gap-3 text-[10px] text-text-muted/70 leading-tight">
            <span>Envíos internacionales</span>
            <span>•</span>
            <span>Devolución sin costo</span>
            <span>•</span>
            <span>Compra segura</span>
          </div>
        </div>
      </div>
    </>
  );
}
