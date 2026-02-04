"use client";

import { useEffect, useMemo, useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import ProductImageGallery from "@/components/ProductImageGallery";
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

type ProductSummary = {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  images: string[];
  freeShipping?: boolean;
};

type Props = {
  product: ProductSummary;
  seoH1: string;
  productImages: ProductImages;
  productVariants: ProductVariants | null;
  ctaLabel: string;
  noImageLabel: string;
  freeShippingLabel?: string;
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
}: Props) {
  const showFullImage =
    product.id === "gn-ski-snow-pants-001";
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

  return (
    <>
      <section className="grid gap-6 md:gap-8 xl:grid-cols-[3fr_2fr] items-start max-w-full pb-20 md:pb-0">
        {/* Galería */}
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

        {/* Info principal */}
        <div className="relative z-10 flex flex-col gap-4 md:gap-7 min-w-0">
          {/* Mobile: Precio primero (más grande que título) */}
          <div className="order-1 md:order-3 md:hidden">
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
          <div className="order-2 md:order-1">
            <h1 className="text-xl md:text-4xl font-semibold text-text-primary break-words">
              {seoH1}
            </h1>
          </div>

          {/* Desktop: Precio */}
          <div className="hidden md:flex order-3 items-center gap-3 pb-1.5 md:pb-3">
            <p className="text-2xl font-bold text-text-primary">
              ${resolvedPrice.toFixed(2)}
            </p>
            {product.freeShipping && freeShippingLabel && (
              <span className="text-xs uppercase tracking-[0.12em] text-text-muted/80">
                {freeShippingLabel}
              </span>
            )}
          </div>

          {/* Variantes */}
          {productVariants && (
            <div className="order-3 md:order-4 pt-1 md:pt-2.5">
              <VariantSelector
                variants={productVariants}
                onChange={setSelections}
                value={selections}
              />
            </div>
          )}

          {/* Desktop: CTA (no sticky) */}
          <div className="hidden md:block order-5 pt-1 md:pt-2.5">
            <AddToCartButton
              id={product.id}
              title={product.title}
              price={product.price}
              image={cartImage}
              variantSelections={variantSelections}
              label={ctaLabel}
              className="w-full"
            />
          </div>

          {/* Descripción - visible arriba en mobile */}
          <div className="order-4 md:order-2 min-w-0">
            <p className="text-sm md:text-lg text-text-muted break-words line-clamp-3 md:line-clamp-none">
              {product.description}
            </p>
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
            price={product.price}
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

