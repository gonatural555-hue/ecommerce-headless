import type {
  ProductImages,
  VariantImageSet,
  VariantImagesMap,
  VariantImagesValueMap,
} from "@/lib/product-images";
import type { Product, ProductVariants } from "@/lib/products";
import { getProductColorSwatches } from "@/lib/plp-card-meta";

function normalizeVariants(
  variants?: ProductVariants | ProductVariants[]
): ProductVariants[] {
  if (!variants) return [];
  return Array.isArray(variants) ? variants : [variants];
}

function getColorVariant(product: Product): ProductVariants | undefined {
  return normalizeVariants(product.variants).find(
    (v) =>
      v.type.toLowerCase().includes("color") ||
      v.label.toLowerCase().includes("color") ||
      v.label.toLowerCase().includes("colour")
  );
}

function pickFeaturedFromVariant(
  variant: VariantImageSet | string[] | undefined
): string | null {
  if (!variant) return null;
  if (Array.isArray(variant)) return variant[0] ?? null;

  const featured = variant.featured;
  if (Array.isArray(featured) && featured.length > 0) return featured[0];

  const gallery = variant.gallery;
  if (Array.isArray(gallery) && gallery.length > 0) return gallery[0];

  return null;
}

export function resolveColorFeaturedImage(
  productImages: ProductImages,
  colorValue: string,
  product?: Product
): string | null {
  const { variantImages } = productImages;
  if (!variantImages) return null;

  const colorVariant = product ? getColorVariant(product) : undefined;

  if (colorVariant?.type) {
    const typedMap = (variantImages as VariantImagesMap)[colorVariant.type];
    if (typedMap?.[colorValue]) {
      const image = pickFeaturedFromVariant(typedMap[colorValue]);
      if (image) return image;
    }
  }

  const flatMap = variantImages as VariantImagesValueMap;
  if (flatMap[colorValue]) {
    return pickFeaturedFromVariant(flatMap[colorValue]);
  }

  return null;
}

export function buildProductColorImageMap(
  product: Product,
  productImages: ProductImages
): Record<string, string> {
  const colorVariant = getColorVariant(product);
  if (!colorVariant) return {};

  const fallback =
    product.images[0] ?? productImages.featured ?? null;
  const map: Record<string, string> = {};

  for (const opt of colorVariant.options) {
    const value = opt.value ?? opt.label;
    const resolved = resolveColorFeaturedImage(productImages, value, product);
    if (resolved) {
      map[value] = resolved;
    } else if (fallback) {
      map[value] = fallback;
    }
  }

  return map;
}

export function getDefaultColorSwatchIndex(product: Product): number {
  const swatches = getProductColorSwatches(product);
  if (swatches.length === 0) return 0;

  const colorVariant = getColorVariant(product);
  const defaultValue = colorVariant?.default;
  if (!defaultValue) return 0;

  const idx = swatches.findIndex(
    (swatch) => swatch.value === defaultValue || swatch.label === defaultValue
  );
  return idx >= 0 ? idx : 0;
}
