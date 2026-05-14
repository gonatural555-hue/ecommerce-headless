import type { Category } from "@/lib/categories";

/** Cinco familias editoriales alineadas con las categorías padre del catálogo. */
export type CategoryHeroKind =
  | "fishing"
  | "mountain-snow"
  | "water-sports"
  | "outdoor-adventure"
  | "active-sports";

const KNOWN: readonly CategoryHeroKind[] = [
  "fishing",
  "mountain-snow",
  "water-sports",
  "outdoor-adventure",
  "active-sports",
] as const;

function isKnownParent(slug: string): slug is CategoryHeroKind {
  return (KNOWN as readonly string[]).includes(slug);
}

/**
 * Resuelve la familia visual (acento + gráfica) desde la categoría actual.
 * Las subcategorías heredan el tema del padre.
 */
export function resolveCategoryHeroKind(category: {
  slug: string;
  parentSlug?: string;
}): CategoryHeroKind {
  const root = category.parentSlug ?? category.slug;
  if (isKnownParent(root)) return root;
  if (category.slug.startsWith("fishing")) return "fishing";
  if (
    category.slug.includes("snow") ||
    category.slug.includes("ski") ||
    category.slug.includes("mountain")
  ) {
    return "mountain-snow";
  }
  if (
    category.slug.includes("water") ||
    category.slug.includes("surf") ||
    category.slug.includes("diving") ||
    category.slug.includes("swim")
  ) {
    return "water-sports";
  }
  if (
    category.slug.includes("outdoor") ||
    category.slug.includes("trek") ||
    category.slug.includes("camp") ||
    category.slug.includes("lighting")
  ) {
    return "outdoor-adventure";
  }
  if (
    category.slug.includes("cycling") ||
    category.slug.includes("running") ||
    category.slug.includes("active")
  ) {
    return "active-sports";
  }
  return "outdoor-adventure";
}

/** Acento de marca por familia (CTA + gráfica). El título principal sigue en forest. */
export const CATEGORY_HERO_ACCENT: Record<CategoryHeroKind, string> = {
  fishing: "#2E4A36",
  "mountain-snow": "#2A2E4B",
  "outdoor-adventure": "#D9A441",
  "water-sports": "#6E1F28",
  "active-sports": "#C9622B",
};

/** Color de texto sobre el CTA (contraste con el acento). */
export const CATEGORY_HERO_CTA_FG: Record<CategoryHeroKind, string> = {
  fishing: "#F4EBDD",
  "mountain-snow": "#F4EBDD",
  "outdoor-adventure": "#2E4A36",
  "water-sports": "#F4EBDD",
  "active-sports": "#F4EBDD",
};
