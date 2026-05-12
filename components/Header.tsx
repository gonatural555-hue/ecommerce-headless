"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import { useEffect, useMemo, useRef, useState } from "react";
import { getAllCategories } from "@/lib/categories";
import { locales, type Locale } from "@/lib/i18n/config";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** Isla flotante del header (crema / vidrio). */
const HEADER_ISLAND =
  "rounded-full border border-[#2E4A36]/12 bg-[#F4EBDD]/74 shadow-[0_14px_48px_-22px_rgba(46,74,54,0.2),inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-[18px]";

/** Enlaces en panel claro (móvil / mega) — TAN Nimbus (`font-display`). */
const NAV_LINK =
  "font-display text-[0.8125rem] font-semibold tracking-[0.05em] text-charcoal transition-colors duration-200 hover:text-[#C9622B] sm:text-[0.875rem]";

/** Navegación principal desktop — TAN Nimbus. */
const NAV_LINK_HEADER =
  "font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2E4A36] transition-colors duration-200 hover:text-[#C9622B] sm:text-[11px] sm:tracking-[0.16em] md:text-[11px]";

/** Enlaces de idioma en islas del header. */
const LOCALE_LINK =
  "rounded-full px-2 py-1.5 font-display text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors sm:px-2.5 sm:text-[11px]";

function userInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "?";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : parts[0]?.[1] ?? "";
  return (a + b).toUpperCase().slice(0, 2);
}

export default function Header() {
  const { totalItems } = useCart();
  const { isLoggedIn, user } = useUser();
  const { authOpen, setAuthOpen, openAuthModal, initialTab } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const categoriesCloseTimeout = useRef<NodeJS.Timeout | null>(null);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const currentQuery = searchParams.get("q") || "";
    setSearchQuery(currentQuery);
  }, [searchParams]);

  const openCategoriesMenu = () => {
    if (categoriesCloseTimeout.current) {
      clearTimeout(categoriesCloseTimeout.current);
      categoriesCloseTimeout.current = null;
    }
    setCategoriesOpen(true);
  };

  const scheduleCloseCategories = () => {
    if (categoriesCloseTimeout.current) {
      clearTimeout(categoriesCloseTimeout.current);
    }
    categoriesCloseTimeout.current = setTimeout(() => {
      setCategoriesOpen(false);
    }, 200);
  };

  const closeCategoriesMenu = () => {
    if (categoriesCloseTimeout.current) {
      clearTimeout(categoriesCloseTimeout.current);
      categoriesCloseTimeout.current = null;
    }
    setCategoriesOpen(false);
  };

  useEffect(() => {
    if (!categoriesOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [categoriesOpen]);

  const { mainCategories, subCategoriesByParent } = useMemo(() => {
    const all = getAllCategories();
    const mains = all.filter((cat) => !cat.parentSlug);
    const subsByParent: Record<string, typeof all> = {};
    all.filter((cat) => cat.parentSlug).forEach((sub) => {
      const key = sub.parentSlug || "";
      if (!subsByParent[key]) {
        subsByParent[key] = [];
      }
      subsByParent[key].push(sub);
    });
    return { mainCategories: mains, subCategoriesByParent: subsByParent };
  }, []);

  const buildLocaleHref = (nextLocale: Locale) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return `/${nextLocale}`;
    if (locales.includes(segments[0] as Locale)) {
      segments[0] = nextLocale;
    } else {
      segments.unshift(nextLocale);
    }
    const query = searchParams.toString();
    return `/${segments.join("/")}${query ? `?${query}` : ""}`;
  };

  const submitSearch = () => {
    const trimmed = searchQuery.trim();
    router.push(
      trimmed
        ? `/${locale}/products?q=${encodeURIComponent(trimmed)}`
        : `/${locale}/products`
    );
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  };

  const mobileNavLinkClass = `${NAV_LINK} rounded-md py-2 px-2`;

  const megaCatTitle =
    "font-display text-[calc(1rem*1.05)] font-semibold tracking-[0.05em] text-dark-base hover:text-accent-gold transition-colors duration-200";

  const megaCatSub =
    "mb-2 block break-inside-avoid font-display text-[calc(0.875rem*1.05)] font-medium tracking-[0.02em] text-muted-gray hover:text-dark-base transition-colors duration-200";

  const categoriesBackdropClass = "bg-black/45 backdrop-blur-sm";

  const categoriesPanelShell =
    "border-earth-brown/15 bg-soft-stone/98 shadow-[0_24px_56px_-20px_rgba(17,23,19,0.18)] ring-1 ring-earth-brown/10 backdrop-blur-md supports-[backdrop-filter]:bg-soft-stone/95";

  const magnifierIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-[18px] w-[18px]"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6.65 6.65a7.5 7.5 0 0 0 10.6 10.6Z"
      />
    </svg>
  );

  const cartIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.65}
      stroke="currentColor"
      className="h-[1.25rem] w-[1.25rem]"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.277M7.5 14.25l13.5-5.25M5.106 5.277c.194-1.01.937-1.777 1.936-1.777h13.916c.999 0 1.742.767 1.936 1.777M5.106 5.277L2.25 3m0 0h18.75M2.25 3v18m18.75-18v18"
      />
    </svg>
  );

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-3 md:px-5 md:pt-3.5">
      {/* Desktop — idiomas izquierda | páginas centradas | búsqueda + carrito + cuenta */}
      <div className="pointer-events-auto hidden w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 md:grid lg:gap-3">
        <nav
          className={`${HEADER_ISLAND} flex shrink-0 items-center gap-0.5 px-1.5 py-1`}
          aria-label={t("header.localeNavAria")}
        >
          {locales.map((lang) => (
            <Link
              key={lang}
              href={buildLocaleHref(lang)}
              className={`${LOCALE_LINK} ${
                lang === locale
                  ? "bg-[#2E4A36] text-[#F4EBDD]"
                  : "text-[#2E4A36]/65 hover:bg-white/90 hover:text-[#2E4A36]"
              }`}
            >
              {lang.toUpperCase()}
            </Link>
          ))}
        </nav>

        <div className="flex min-w-0 justify-center px-1">
          <nav
            className={`${HEADER_ISLAND} relative z-10 flex max-w-full flex-wrap items-center justify-center gap-0.5 px-2.5 py-1.5 sm:gap-1 sm:px-3 sm:py-2`}
            aria-label="Principal"
          >
            <Link href={`/${locale}`} className={`${NAV_LINK_HEADER} whitespace-nowrap rounded-full px-2 py-2`}>
              {t("header.nav.home")}
            </Link>
            <Link href={`/${locale}/products`} className={`${NAV_LINK_HEADER} whitespace-nowrap rounded-full px-2 py-2`}>
              {t("header.nav.products")}
            </Link>
            <Link href={`/${locale}/blog`} className={`${NAV_LINK_HEADER} whitespace-nowrap rounded-full px-2 py-2`}>
              {t("header.nav.blog")}
            </Link>
            <div className="relative" onMouseEnter={openCategoriesMenu} onMouseLeave={scheduleCloseCategories}>
              <button
                type="button"
                className={`${NAV_LINK_HEADER} cursor-pointer whitespace-nowrap rounded-full border-0 bg-transparent px-2 py-2 text-left`}
                aria-expanded={categoriesOpen}
                aria-haspopup="true"
                aria-controls="header-categories-mega"
                onFocus={openCategoriesMenu}
                onBlur={scheduleCloseCategories}
              >
                {t("header.nav.categories")}
              </button>
            </div>
          </nav>
        </div>

        <div className="relative z-10 flex min-w-0 shrink-0 items-center justify-end gap-2 lg:gap-2.5">
          <form
            className={`${HEADER_ISLAND} hidden min-w-0 max-w-[12rem] shrink-0 flex-row items-stretch py-1 pl-3 pr-1 md:flex lg:max-w-[15rem] xl:max-w-[17rem]`}
            onSubmit={(e) => {
              e.preventDefault();
              submitSearch();
            }}
            role="search"
          >
            <label htmlFor="header-search" className="sr-only">
              {t("common.searchLabel")}
            </label>
            <div className="flex w-full min-h-[36px] items-center gap-1">
              <input
                id="header-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("common.searchPlaceholder")}
                className="min-h-[36px] min-w-0 flex-1 border-0 bg-transparent font-sans text-[12px] text-[#2E4A36] placeholder:text-[#2E4A36]/45 outline-none focus:ring-0"
              />
              <button
                type="submit"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2E4A36] text-[#F4EBDD] transition hover:bg-[#6E1F28] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9622B]/45"
                aria-label={t("common.searchLabel")}
              >
                {magnifierIcon}
              </button>
            </div>
          </form>

          <Link
            href={`/${locale}/cart`}
            className={`${HEADER_ISLAND} relative flex h-10 w-10 shrink-0 items-center justify-center text-[#2E4A36] transition hover:text-[#C9622B]`}
            aria-label={`Cart with ${totalItems} items`}
          >
            {cartIcon}
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#D9A441] px-0.5 font-sans text-[9px] font-semibold text-[#2E4A36]">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {isLoggedIn && user ? (
            <Link
              href={`/${locale}/account`}
              className={`${HEADER_ISLAND} flex max-w-[10rem] shrink-0 items-center gap-2 pl-2.5 pr-1.5 py-1`}
            >
              <span className="truncate font-display text-[11px] font-semibold tracking-[0.04em] text-[#2E4A36] sm:text-[12px]">
                {user.name}
              </span>
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2E4A36] to-[#1e3228] font-display text-[10px] font-semibold uppercase tracking-wide text-[#F4EBDD] shadow-inner"
                aria-hidden
              >
                {userInitials(user.name)}
              </span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className={`${HEADER_ISLAND} shrink-0 px-3.5 py-2 font-display text-[11px] font-semibold tracking-[0.06em] text-[#2E4A36] transition hover:bg-white/40 sm:px-4 sm:text-[12px]`}
            >
              {t("header.account")}
            </button>
          )}
        </div>
      </div>

      {/* Mobile — idiomas izquierda | menú | búsqueda + carrito a la derecha */}
      <div className="pointer-events-auto flex w-full items-center gap-2 md:hidden">
        <nav
          className={`${HEADER_ISLAND} flex shrink-0 items-center gap-0.5 px-1.5 py-1`}
          aria-label={t("header.localeNavAria")}
        >
          {locales.map((lang) => (
            <Link
              key={lang}
              href={buildLocaleHref(lang)}
              className={`${LOCALE_LINK} ${
                lang === locale
                  ? "bg-[#2E4A36] text-[#F4EBDD]"
                  : "text-[#2E4A36]/65 hover:bg-white/90 hover:text-[#2E4A36]"
              }`}
            >
              {lang.toUpperCase()}
            </Link>
          ))}
        </nav>

        <div className="min-w-0 flex-1" aria-hidden />

        <button
          type="button"
          className={`${HEADER_ISLAND} flex h-10 w-10 shrink-0 items-center justify-center text-[#2E4A36] transition hover:text-[#C9622B]`}
          onClick={() => {
            setMobileMenuOpen((o) => !o);
            setMobileSearchOpen(false);
          }}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
        </button>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className={`${HEADER_ISLAND} flex h-10 w-10 items-center justify-center text-[#2E4A36] transition hover:text-[#C9622B]`}
            onClick={() => {
              setMobileSearchOpen((o) => !o);
              setMobileMenuOpen(false);
            }}
            aria-label={t("common.searchLabel")}
            aria-expanded={mobileSearchOpen}
          >
            {magnifierIcon}
          </button>
          <Link
            href={`/${locale}/cart`}
            className={`${HEADER_ISLAND} relative flex h-10 w-10 items-center justify-center text-[#2E4A36] transition hover:text-[#C9622B]`}
            aria-label={`Cart with ${totalItems} items`}
          >
            {cartIcon}
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#D9A441] px-0.5 font-sans text-[9px] font-semibold text-[#2E4A36]">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {mobileSearchOpen ? (
        <form
          className={`${HEADER_ISLAND} pointer-events-auto mt-2 flex w-full flex-col gap-0 py-1 pl-3 pr-1 md:hidden`}
          onSubmit={(e) => {
            e.preventDefault();
            submitSearch();
          }}
          role="search"
        >
          <label htmlFor="header-search-mobile-bar" className="sr-only">
            {t("common.searchLabel")}
          </label>
          <div className="flex w-full items-center gap-1">
            <input
              id="header-search-mobile-bar"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("common.searchPlaceholder")}
              className="font-sans min-h-[40px] min-w-0 flex-1 border-0 bg-transparent text-sm text-charcoal placeholder:text-muted-gray outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/40"
              aria-label={t("common.searchLabel")}
            >
              {magnifierIcon}
            </button>
          </div>
        </form>
      ) : null}

      {/* Mega menu backdrop */}
      <div
          className={[
            "pointer-events-auto fixed inset-0 z-[38] transition-all duration-200 ease-out",
            categoriesBackdropClass,
            categoriesOpen ? "opacity-100" : "pointer-events-none invisible opacity-0",
          ].join(" ")}
          aria-hidden={!categoriesOpen}
          onClick={closeCategoriesMenu}
        />

        <div
          id="header-categories-mega"
          className={[
            "pointer-events-auto fixed inset-x-0 bottom-0 z-40 border-t transition-all duration-200 ease-out",
            "top-[5.85rem] sm:top-[6.1rem] md:top-[6.35rem]",
            "overflow-y-auto overscroll-contain",
            categoriesPanelShell,
            categoriesOpen ? "opacity-100" : "pointer-events-none invisible opacity-0",
          ].join(" ")}
          onMouseEnter={openCategoriesMenu}
          onMouseLeave={scheduleCloseCategories}
          aria-hidden={!categoriesOpen}
        >
          <div className="mx-auto w-full max-w-[min(100%,1600px)] px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
            <div className="columns-1 gap-x-16 gap-y-10 sm:columns-2 lg:columns-3 xl:columns-4">
              {mainCategories.map((category) => (
                <div key={category.slug} className="mb-10 break-inside-avoid">
                  <Link
                    href={`/${locale}/category/${category.slug}`}
                    className={megaCatTitle}
                    onClick={closeCategoriesMenu}
                  >
                    {t(`categories.names.${category.slug}`, category.name)}
                  </Link>
                  <div className="mt-3 space-y-2">
                    {(subCategoriesByParent[category.slug] || []).map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/${locale}/category/${sub.slug}`}
                        className={megaCatSub}
                        onClick={closeCategoriesMenu}
                      >
                        {t(`categories.names.${sub.slug}`, sub.name)}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile sheet menu */}
        {mobileMenuOpen ? (
          <nav className="pointer-events-auto mt-2 rounded-2xl border border-earth-brown/18 bg-soft-stone/98 p-4 shadow-[0_20px_50px_-24px_rgba(17,23,19,0.2)] ring-1 ring-earth-brown/10 backdrop-blur-md md:hidden">
            <div className="flex flex-col gap-3">
              <Link href={`/${locale}`} className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
                {t("header.nav.home")}
              </Link>
              <Link href={`/${locale}/products`} className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
                {t("header.nav.products")}
              </Link>
              <Link href={`/${locale}/blog`} className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
                {t("header.nav.blog")}
              </Link>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className={`flex w-full items-center justify-between ${mobileNavLinkClass}`}
                  onClick={() => setMobileCategoriesOpen((open) => !open)}
                  aria-expanded={mobileCategoriesOpen}
                  aria-controls="mobile-categories-menu"
                >
                  <span>{t("header.nav.categories")}</span>
                  <span className="font-display text-[13px] font-semibold tracking-[0.04em] text-muted-gray">{mobileCategoriesOpen ? "−" : "+"}</span>
                </button>
                {mobileCategoriesOpen ? (
                  <div id="mobile-categories-menu" className="space-y-4 border-l border-earth-brown/20 pl-3">
                    {mainCategories.map((category) => (
                      <div key={category.slug} className="space-y-2">
                        <Link
                          href={`/${locale}/category/${category.slug}`}
                          className="font-display text-[13px] font-semibold tracking-[0.04em] text-dark-base hover:text-accent-gold"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {t(`categories.names.${category.slug}`, category.name)}
                        </Link>
                        <div className="flex flex-col gap-1">
                          {(subCategoriesByParent[category.slug] || []).map((sub) => (
                            <Link
                              key={sub.slug}
                              href={`/${locale}/category/${sub.slug}`}
                              className="font-display text-[13px] font-medium tracking-[0.02em] text-muted-gray hover:text-dark-base"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {t(`categories.names.${sub.slug}`, sub.name)}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-3 border-t border-earth-brown/20 pt-3">
                {locales.map((lang) => (
                  <Link
                    key={lang}
                    href={buildLocaleHref(lang)}
                    className={`font-display text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                      lang === locale ? "text-accent-gold" : "text-muted-gray hover:text-dark-base"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </Link>
                ))}
                {isLoggedIn && user ? (
                  <Link
                    href={`/${locale}/account`}
                    className={`${mobileNavLinkClass} font-semibold`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("header.greeting")}, {user.name}
                  </Link>
                ) : (
                  <Link
                    href={`/${locale}/auth?tab=login`}
                    className={`${mobileNavLinkClass} font-semibold`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("header.account")}
                  </Link>
                )}
              </div>
            </div>
          </nav>
        ) : null}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialTab={initialTab} />
    </header>
  );
}
