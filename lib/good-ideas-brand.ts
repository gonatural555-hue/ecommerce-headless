import type { Locale } from "@/lib/i18n/config";

/** Acento de marca Good Products — segunda palabra del nombre. */
export const GOOD_PRODUCTS_BRAND_ACCENT = "#3B82F6";

/** Nombre visible de la marca Good Ideas → Good Products / Buenos Productos. */
export const GOOD_IDEAS_BRAND_NAME: Record<Locale, string> = {
  es: "Buenos Productos",
  en: "Good Products",
  fr: "Good Products",
  it: "Good Products",
};

export function getGoodIdeasBrandName(locale: Locale): string {
  return GOOD_IDEAS_BRAND_NAME[locale];
}

/** "Good Products" → { prefix: "Good", suffix: "Products" } */
export function splitGoodProductsBrandName(name: string): {
  prefix: string;
  suffix: string;
} {
  const trimmed = name.trim();
  const spaceIndex = trimmed.lastIndexOf(" ");
  if (spaceIndex <= 0) {
    return { prefix: trimmed, suffix: "" };
  }
  return {
    prefix: trimmed.slice(0, spaceIndex),
    suffix: trimmed.slice(spaceIndex + 1),
  };
}

export function splitGoodProductsBrandNameForLocale(locale: Locale) {
  return splitGoodProductsBrandName(getGoodIdeasBrandName(locale));
}
