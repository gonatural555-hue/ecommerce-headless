import {
  getProductsByCategorySlug,
  resolveProductsCategoryParam,
} from "@/lib/categories";
import type { Product } from "@/lib/products";
import type { Locale } from "@/lib/i18n/config";

export type ProductSegment =
  | "all"
  | "hombre"
  | "mujer"
  | "outdoor"
  | "equipamiento";

export function parseSegment(raw: string | undefined): ProductSegment {
  const s = (raw ?? "").toLowerCase();
  if (
    s === "hombre" ||
    s === "mujer" ||
    s === "outdoor" ||
    s === "equipamiento"
  ) {
    return s;
  }
  return "all";
}

/** Catálogo sin metadata de género: hombre/mujer muestran todo el surtido. */
export function getProductsForSegment(
  segment: ProductSegment,
  allProducts: Product[]
): Product[] {
  if (segment === "outdoor") {
    return getProductsByCategorySlug("outdoor-adventure");
  }
  if (segment === "equipamiento") {
    const byId = new Map<string, Product>();
    for (const slug of ["active-sports", "mountain-snow", "fishing"] as const) {
      getProductsByCategorySlug(slug).forEach((p) => byId.set(p.id, p));
    }
    return [...byId.values()];
  }
  return allProducts;
}

export function sortProductsList(
  products: Product[],
  sortKey: string | undefined,
  locale: Locale
): Product[] {
  const copy = [...products];
  const titleOf = (p: Product) =>
    p.translations?.[locale]?.title ?? p.title;

  switch (sortKey) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "name-asc":
      return copy.sort((a, b) =>
        titleOf(a).localeCompare(titleOf(b), locale, { sensitivity: "base" })
      );
    default:
      return copy;
  }
}

/** Valores de `?category=` en /products (misma convención que la home) */
export const PRODUCT_PAGE_CATEGORY_PARAMS = [
  "fishing",
  "mountain-snow",
  "outdoor",
  "water-sports",
] as const;

export type ProductPageCategoryParam =
  (typeof PRODUCT_PAGE_CATEGORY_PARAMS)[number];

export function buildProductsListHref(
  locale: string,
  opts: {
    q?: string;
    sort?: string;
    /** Slug o alias (p. ej. `outdoor` → outdoor-adventure) */
    category?: string;
  }
): string {
  const params = new URLSearchParams();
  if (opts.q?.trim()) params.set("q", opts.q.trim());
  if (opts.category?.trim()) {
    if (resolveProductsCategoryParam(opts.category.trim())) {
      params.set("category", opts.category.trim());
    }
  }
  if (opts.sort && opts.sort !== "featured") params.set("sort", opts.sort);
  const qs = params.toString();
  return `/${locale}/products${qs ? `?${qs}` : ""}`;
}
