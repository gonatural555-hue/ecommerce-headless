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

  const selectedVariantValue = useMemo(() => {
    if (!productVariants) return "";
    for (const variant of productVariants.variants) {
      const value = selections[variant.type];
      if (value) return value;
    }
    return "";
  }, [productVariants, selections]);

  const activeImages = useMemo(() => {
    const defaultImages = {
      featured: baseFeatured,
      gallery: baseGallery,
    };

    if (!productImages.variantImages || !selectedVariantValue) {
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
      variant = flatMap[selectedVariantValue];
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
    selectedVariantValue,
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
    <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Galería */}
      <div className="bg-dark-surface/40 rounded-2xl p-4 md:p-6">
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
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-text-primary">
            {seoH1}
          </h1>
          <p className="mt-3 text-base md:text-lg text-text-muted">
            {product.description}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <p className="text-sm text-text-muted">
              ${resolvedPrice.toFixed(2)}
            </p>
            {product.freeShipping && freeShippingLabel && (
              <span className="text-xs uppercase tracking-[0.12em] text-text-muted/80">
                {freeShippingLabel}
              </span>
            )}
          </div>
        </div>

        {productVariants && (
          <div>
            <VariantSelector
              variants={productVariants}
              onChange={setSelections}
              value={selections}
            />
          </div>
        )}

        <div>
          <AddToCartButton
            id={product.id}
            title={product.title}
            price={product.price}
            image={cartImage}
            variantSelections={variantSelections}
            label={ctaLabel}
          />
        </div>
      </div>
    </section>
  );
}

