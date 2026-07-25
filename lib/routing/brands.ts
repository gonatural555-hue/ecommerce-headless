import { locales, type Locale } from "@/lib/i18n/config";
import {
  homePath,
  LEGACY_GOOD_IDEAS_SEGMENT,
  LEGACY_GO_NATURAL_SEGMENT,
} from "@/lib/routing/paths";

export {
  homePath,
  productsPath,
  productPath,
  blogPath,
  blogPostPath,
  cartPath,
  checkoutPath,
  orderSuccessPath,
  accountPath,
  authPath,
  buildPathByLocale,
  goodIdeasHomePath,
  goodIdeasProductsPath,
  goodIdeasProductPath,
  goodIdeasBlogPath,
  goodIdeasBlogPostPath,
  goodIdeasCartPath,
  goodIdeasCheckoutPath,
  brandGatewayPath,
  isCheckoutPath,
  isOrderSuccessPath,
  shouldHideGiChrome,
} from "@/lib/routing/paths";

/** @deprecated Use `LEGACY_*` from paths or remove after migration. */
export const BRAND_SEGMENTS = {
<<<<<<< HEAD
  goNatural: "go-natural",
=======
  goNatural: LEGACY_GO_NATURAL_SEGMENT,
  goodIdeas: LEGACY_GOOD_IDEAS_SEGMENT,
>>>>>>> 8e880344766638a7513f3b6c9d14c843a23fe9c1
} as const;

export type BrandId = "go-natural";

<<<<<<< HEAD
/** Locale root (`/{locale}`) — redirects to Go Natural home. */
export function localeRootPath(locale: Locale): string {
  return `/${locale}`;
}

=======
/** @deprecated Mono-marca: siempre home. */
>>>>>>> 8e880344766638a7513f3b6c9d14c843a23fe9c1
export function goNaturalHomePath(locale: Locale): string {
  return homePath(locale);
}

/** @deprecated Mono-marca: catálogo GI en `/products`. */
export function goNaturalCatalogPath(locale: Locale): string {
  return `/${locale}/products`;
}

<<<<<<< HEAD
/** True when pathname is exactly `/{locale}` (before redirect to Go Natural). */
export function isLocaleRootPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  return segments.length === 1 && locales.includes(segments[0] as Locale);
=======
/** @deprecated Gateway eliminado — home GI. */
export function isBrandGatewayPath(_pathname: string): boolean {
  return false;
>>>>>>> 8e880344766638a7513f3b6c9d14c843a23fe9c1
}

export function isGoNaturalHomePath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  return (
    segments.length === 2 &&
    locales.includes(segments[0] as Locale) &&
    segments[1] === LEGACY_GO_NATURAL_SEGMENT
  );
}

<<<<<<< HEAD
export function resolveBrandFromPath(_pathname: string): BrandId {
  return "go-natural";
=======
export function isGoodIdeasPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length < 2 || !locales.includes(segments[0] as Locale)) {
    return false;
  }
  if (segments[1] === LEGACY_GOOD_IDEAS_SEGMENT) return true;
  return ["products", "blog", "cart", "checkout", "order-success"].includes(
    segments[1]
  );
}

export function resolveBrandFromPath(_pathname: string): BrandId {
  return "good-ideas";
>>>>>>> 8e880344766638a7513f3b6c9d14c843a23fe9c1
}

/** @deprecated Use `isCheckoutPath` from paths. */
export function isGoNaturalCheckoutPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  return (
    segments.length >= 2 &&
    locales.includes(segments[0] as Locale) &&
    segments[1] === "checkout"
  );
}

<<<<<<< HEAD
export function shouldShowGoNaturalHeader(pathname: string): boolean {
  return !isGoNaturalCheckoutPath(pathname);
}

export function shouldShowGoNaturalFooter(pathname: string): boolean {
  return !isGoNaturalCheckoutPath(pathname);
=======
/** GN chrome removed in mono-marca. */
export function shouldShowGoNaturalHeader(_pathname: string): boolean {
  return false;
}

export function shouldShowGoNaturalFooter(_pathname: string): boolean {
  return false;
>>>>>>> 8e880344766638a7513f3b6c9d14c843a23fe9c1
}
