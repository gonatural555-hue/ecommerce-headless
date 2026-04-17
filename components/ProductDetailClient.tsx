"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AddedToCartModal, {
  type AddedToCartLineSnapshot,
} from "@/components/AddedToCartModal";
import AddToCartButton, {
  type AddToCartLinePayload,
} from "@/components/AddToCartButton";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductGalleryGrid from "@/components/pdp/ProductGalleryGrid";
import ProductInfoPanel from "@/components/pdp/ProductInfoPanel";
import VariantSelector from "@/components/VariantSelector";
import { splitVariantDefinitions } from "@/lib/pdp-variant-utils";
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
import { PDP_HERO_WIDE_PRODUCT_IDS } from "@/lib/pdp-star-products";
import type { UISurface } from "@/lib/ui-surface";

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
  surface?: UISurface;
  reviewsAverage?: number;
  reviewsCount?: number;
  reviewsLinkLabel?: string;
  taxNote?: string | null;
  selectSizeLabel: string;
  sizeGuideLabel: string;
  sizeGuideHref?: string;
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
  surface = "dark",
  reviewsAverage = 0,
  reviewsCount = 0,
  reviewsLinkLabel,
  taxNote,
  selectSizeLabel,
  sizeGuideLabel,
  sizeGuideHref,
}: Props) {
  const L = surface === "light";
  /** Gafas / horizontales: ver `lib/pdp-star-products.ts`. Pantalón ski: solo móvil legacy. */
  const useWideHeroGallery = PDP_HERO_WIDE_PRODUCT_IDS.has(product.id);
  const showFullImage =
    product.id === "gn-ski-snow-pants-001" || useWideHeroGallery;
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

  const [addedToCart, setAddedToCart] = useState<AddedToCartLineSnapshot | null>(
    null
  );

  const handleAfterAddToCart = useCallback((item: AddToCartLinePayload) => {
    setAddedToCart({
      title: item.title,
      price: item.price,
      image: item.image,
      variantSelections: item.variantSelections,
    });
  }, []);

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

  const desktopDescription =
    product.shortDescription?.trim() || product.description;

  const gridDesktopImages = useMemo(() => {
    const list: string[] = [];
    const push = (url: string) => {
      if (url && !list.includes(url)) list.push(url);
    };
    if (activeImages.featured) push(activeImages.featured);
    activeImages.gallery.forEach(push);
    productImages.lifestyle.forEach(push);
    productImages.extras.forEach(push);
    return list;
  }, [activeImages, productImages.lifestyle, productImages.extras]);

  const heroGalleryFeatured = gridDesktopImages[0] ?? null;
  const heroGalleryRest = gridDesktopImages.slice(1);

  const { color: colorDef, size: sizeDef, other: otherVariantDefs } =
    useMemo(
      () => splitVariantDefinitions(productVariants?.variants ?? []),
      [productVariants]
    );

  return (
    <>
      {/* Mobile Layout (<1024px) - Mantener exactamente igual */}
      <section className="lg:hidden grid gap-6 md:gap-8 items-start max-w-full pb-20">
        {/* Galería Mobile */}
        <div
          className={
            L
              ? "relative z-0 bg-neutral-100 rounded-2xl p-3 md:p-6 max-w-full overflow-x-hidden border border-neutral-200/80"
              : "relative z-0 bg-dark-surface/40 rounded-2xl p-3 md:p-6 max-w-full overflow-x-hidden"
          }
        >
          <ProductImageGallery
            featured={activeImages.featured}
            gallery={activeImages.gallery}
            title={product.title}
            noImageLabel={noImageLabel}
            surface={surface}
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
              <p
                className={
                  L
                    ? "text-4xl font-bold text-neutral-900"
                    : "text-4xl font-bold text-text-primary"
                }
              >
                ${resolvedPrice.toFixed(2)}
              </p>
              {product.freeShipping && freeShippingLabel && (
                <span
                  className={
                    L
                      ? "text-xs uppercase tracking-[0.12em] text-neutral-500"
                      : "text-xs uppercase tracking-[0.12em] text-text-muted/80"
                  }
                >
                  {freeShippingLabel}
                </span>
              )}
            </div>
          </div>

          {/* Título - más pequeño en mobile */}
          <div className="order-2">
            <h1
              className={
                L
                  ? "text-xl font-semibold text-neutral-900 break-words"
                  : "text-xl font-semibold text-text-primary break-words"
              }
            >
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
                surface={surface}
              />
            </div>
          )}

          {/* Descripción - visible arriba en mobile */}
          <div className="order-4 min-w-0">
            <p
              className={
                L
                  ? "text-sm text-neutral-600 break-words line-clamp-3"
                  : "text-sm text-text-muted break-words line-clamp-3"
              }
            >
              {product.description}
            </p>
          </div>
        </div>
      </section>

      {/* Desktop (lg+): galería (60% o ~67% si hero ancho) + panel sticky */}
      <section
        className={[
          "hidden lg:grid lg:items-start lg:gap-x-12 xl:gap-x-16 2xl:gap-x-20 max-w-full",
          useWideHeroGallery ? "lg:grid-cols-[5fr_2.5fr]" : "lg:grid-cols-[5fr_3fr]",
        ].join(" ")}
      >
        <div className="min-w-0">
          <div
            className={
              L
                ? "rounded-2xl border border-neutral-200/90 bg-neutral-100/80 p-5 xl:p-7 2xl:p-8"
                : "rounded-2xl border border-white/[0.08] bg-dark-surface/25 p-5 xl:p-7 2xl:p-8 ring-1 ring-white/[0.04]"
            }
          >
            {useWideHeroGallery ? (
              <ProductImageGallery
                featured={heroGalleryFeatured}
                gallery={heroGalleryRest}
                title={product.title}
                noImageLabel={noImageLabel}
                surface={surface}
                heroWide
              />
            ) : (
              <ProductGalleryGrid
                images={gridDesktopImages}
                title={product.title}
                noImageLabel={noImageLabel}
                surface={surface}
              />
            )}
          </div>
        </div>
        <div className="min-w-0">
          <ProductInfoPanel
            productId={product.id}
            surface={surface}
            seoH1={seoH1}
            description={desktopDescription}
            resolvedPrice={resolvedPrice}
            freeShipping={product.freeShipping}
            freeShippingLabel={freeShippingLabel}
            taxNote={taxNote}
            reviewsAverage={reviewsAverage}
            reviewsCount={reviewsCount}
            reviewsLinkLabel={reviewsLinkLabel}
            productVariants={productVariants}
            colorDef={colorDef}
            sizeDef={sizeDef}
            otherVariantDefs={otherVariantDefs}
            selections={selections}
            onSelectionsChange={setSelections}
            sizeGuideHref={sizeGuideHref}
            sizeGuideLabel={sizeGuideLabel}
            selectSizeLabel={selectSizeLabel}
            ctaLabel={ctaLabel}
            trustMicrocopy={pdpDesktop.trustMicrocopy}
            pdpDesktop={pdpDesktop}
            cartPayload={{
              id: product.id,
              title: product.title,
              price: resolvedPrice,
              image: cartImage,
              variantSelections,
            }}
            onAfterAdd={handleAfterAddToCart}
          />
        </div>
      </section>

      {/* Mobile: Sticky CTA con microcopy */}
      <div
        className={
          L
            ? "md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-neutral-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] pt-3 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            : "md:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark-base/98 backdrop-blur-md border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.4)] pt-3 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        }
      >
        <div className="max-w-full mx-auto">
          {/* Precio siempre visible en sticky */}
          <div className="mb-2 text-center">
            <p
              className={
                L
                  ? "text-2xl font-bold text-neutral-900"
                  : "text-2xl font-bold text-text-primary"
              }
            >
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
            surface={surface}
            onAfterAdd={handleAfterAddToCart}
          />

          {/* Microcopy de confianza */}
          <div
            className={
              L
                ? "mt-2.5 flex items-center justify-center gap-3 text-[10px] text-neutral-500 leading-tight"
                : "mt-2.5 flex items-center justify-center gap-3 text-[10px] text-text-muted/70 leading-tight"
            }
          >
            <span>Envíos internacionales</span>
            <span>•</span>
            <span>Devolución sin costo</span>
            <span>•</span>
            <span>Compra segura</span>
          </div>
        </div>
      </div>

      <AddedToCartModal
        open={addedToCart !== null}
        item={addedToCart}
        onClose={() => setAddedToCart(null)}
      />
    </>
  );
}
