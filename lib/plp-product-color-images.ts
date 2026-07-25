import { getProductImages } from "@/lib/product-images";
import { buildProductColorImageMap } from "@/lib/plp-color-images";
import { getProductColorSwatches } from "@/lib/plp-card-meta";
import type { Product } from "@/lib/products";

export async function getColorImageMapsForProducts(
  products: Product[]
): Promise<Record<string, Record<string, string>>> {
  const entries = await Promise.all(
    products.map(async (product) => {
      const swatches = getProductColorSwatches(product);
      if (swatches.length <= 1) {
        return [product.id, {}] as const;
      }

      const productImages = await getProductImages(product.id);
      const map = buildProductColorImageMap(product, productImages);
      return [product.id, map] as const;
    })
  );

  return Object.fromEntries(entries);
}
