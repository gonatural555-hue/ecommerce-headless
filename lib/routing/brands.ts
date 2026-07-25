import { locales, type Locale } from "@/lib/i18n/config";

export const BRAND_SEGMENTS = {
  goNatural: "go-natural",
} as const;

export type BrandId = "go-natural";

/** Locale root (`/{locale}`) — redirects to Go Natural home. */
export function localeRootPath(locale: Locale): string {
  return `/${locale}`;
}

export function goNaturalHomePath(locale: Locale): string {
  return `/${locale}/${BRAND_SEGMENTS.goNatural}`;
}

export function goNaturalCatalogPath(locale: Locale): string {
  return `/${locale}/products`;
}

/** True when pathname is exactly `/{locale}` (before redirect to Go Natural). */
export function isLocaleRootPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  return segments.length === 1 && locales.includes(segments[0] as Locale);
}

export function isGoNaturalHomePath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  return (
    segments.length === 2 &&
    locales.includes(segments[0] as Locale) &&
    segments[1] === BRAND_SEGMENTS.goNatural
  );
}

export function resolveBrandFromPath(_pathname: string): BrandId {
  return "go-natural";
}

export function isGoNaturalCheckoutPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  return (
    segments.length >= 2 &&
    locales.includes(segments[0] as Locale) &&
    segments[1] === "checkout"
  );
}

export function shouldShowGoNaturalHeader(pathname: string): boolean {
  return !isGoNaturalCheckoutPath(pathname);
}

export function shouldShowGoNaturalFooter(pathname: string): boolean {
  return !isGoNaturalCheckoutPath(pathname);
}
