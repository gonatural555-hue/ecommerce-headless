"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import { useEffect, useMemo, useRef, useState } from "react";
import { getAllCategories } from "@/lib/categories";
import { blogSections } from "@/lib/blog-sections";
import { locales, type Locale } from "@/lib/i18n/config";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Header() {
  const { totalItems } = useCart();
  const { isLoggedIn, user } = useUser();
  const { authOpen, setAuthOpen, openAuthModal, initialTab } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const productsCloseTimeout = useRef<NodeJS.Timeout | null>(null);
  const [blogOpen, setBlogOpen] = useState(false);
  const blogCloseTimeout = useRef<NodeJS.Timeout | null>(null);
  const [mobileBlogOpen, setMobileBlogOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const currentQuery = searchParams.get("q") || "";
    setSearchQuery(currentQuery);
  }, [searchParams]);

  const openProductsMenu = () => {
    if (productsCloseTimeout.current) {
      clearTimeout(productsCloseTimeout.current);
      productsCloseTimeout.current = null;
    }
    setProductsOpen(true);
  };

  const closeProductsMenu = () => {
    if (productsCloseTimeout.current) {
      clearTimeout(productsCloseTimeout.current);
    }
    productsCloseTimeout.current = setTimeout(() => {
      setProductsOpen(false);
    }, 200);
  };

  const openBlogMenu = () => {
    if (blogCloseTimeout.current) {
      clearTimeout(blogCloseTimeout.current);
      blogCloseTimeout.current = null;
    }
    setBlogOpen(true);
  };

  const closeBlogMenu = () => {
    if (blogCloseTimeout.current) {
      clearTimeout(blogCloseTimeout.current);
    }
    blogCloseTimeout.current = setTimeout(() => {
      setBlogOpen(false);
    }, 200);
  };

  const navLinks = [
    { href: `/${locale}`, label: t("header.nav.home") },
    { href: `/${locale}/products`, label: t("header.nav.products") },
    { href: `/${locale}/blog`, label: t("header.nav.blog") },
    { href: `/${locale}/cart`, label: t("header.nav.cart") },
    { href: `/${locale}/about`, label: t("header.nav.about") },
    { href: `/${locale}/contact`, label: t("header.nav.contact") },
  ];

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
  };

  /** PDP usa el mismo header oscuro que el resto del sitio. */
  const isProductDetailPage = false;

  const navLinkClass = isProductDetailPage
    ? "text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors duration-200"
    : "text-sm font-medium text-white hover:text-white/80 transition-colors duration-200";

  const megaProductsPanel = [
    "absolute left-0 top-full mt-4 w-[900px] max-w-[92vw] rounded-2xl transition-all duration-200 ease-out",
    isProductDetailPage
      ? "border border-neutral-200/90 bg-white/98 backdrop-blur-md shadow-[0_14px_40px_rgba(0,0,0,0.1)]"
      : "border border-white/10 bg-dark-base/95 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.35)]",
  ].join(" ");

  const megaBlogPanel = [
    "absolute left-0 top-full mt-4 w-[760px] max-w-[92vw] rounded-2xl transition-all duration-200 ease-out",
    isProductDetailPage
      ? "border border-neutral-200/90 bg-white/98 backdrop-blur-md shadow-[0_14px_40px_rgba(0,0,0,0.1)]"
      : "border border-white/10 bg-dark-base/95 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.35)]",
  ].join(" ");

  const megaCatTitle = isProductDetailPage
    ? "text-sm font-semibold tracking-[0.02em] text-neutral-900 hover:text-accent-gold transition-colors duration-200"
    : "text-sm font-semibold tracking-[0.02em] text-white hover:text-accent-gold transition-colors duration-200";

  const megaCatSub = isProductDetailPage
    ? "mb-2 block break-inside-avoid text-sm text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
    : "mb-2 block break-inside-avoid text-sm text-white/75 hover:text-white transition-colors duration-200";

  return (
    <header
      className={[
        "fixed top-0 z-50 w-full transition-all duration-300 ease-out",
        isScrolled
          ? isProductDetailPage
            ? "bg-white/92 backdrop-blur-md border-b border-neutral-200/80"
            : "bg-dark-base/80 backdrop-blur-md"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div
          className={[
            "grid h-16 items-center gap-x-2 sm:gap-x-3",
            "grid-cols-[auto_minmax(0,1fr)_auto]",
            "md:h-20 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-x-4 lg:gap-x-5",
          ].join(" ")}
        >
          {/* Columna izquierda: hamburguesa (móvil) + nav pegado al centro / logo */}
          <div className="flex min-w-0 items-center justify-start gap-2 md:justify-end md:pr-2 lg:pr-3">
            <button
              type="button"
              className={[
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/50 md:hidden",
                isProductDetailPage
                  ? "text-neutral-900 hover:text-neutral-600"
                  : "text-white hover:text-white/80",
              ].join(" ")}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>

            <nav className="hidden min-w-0 items-center justify-end gap-3 md:flex lg:gap-4 xl:gap-5">
            {navLinks.map((link) => {
              if (link.href === `/${locale}/products`) {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={openProductsMenu}
                    onMouseLeave={closeProductsMenu}
                  >
                    <Link
                      href={link.href}
                      className={navLinkClass}
                      onFocus={openProductsMenu}
                      onBlur={closeProductsMenu}
                      aria-haspopup="true"
                      aria-expanded={productsOpen}
                    >
                      {link.label}
                    </Link>
                    <div
                      className={[
                        megaProductsPanel,
                        productsOpen
                          ? "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 translate-y-2 pointer-events-none",
                      ].join(" ")}
                    >
                      <div className="p-10 columns-2 gap-16">
                        {mainCategories.map((category) => (
                          <div
                            key={category.slug}
                            className="mb-10 break-inside-avoid"
                          >
                            <Link
                              href={`/${locale}/category/${category.slug}`}
                              className={megaCatTitle}
                              onClick={() => setProductsOpen(false)}
                            >
                              {t(
                                `categories.names.${category.slug}`,
                                category.name
                              )}
                            </Link>
                            <div className="mt-3 columns-2 gap-10">
                              {(subCategoriesByParent[category.slug] || []).map(
                                (sub) => (
                                  <Link
                                    key={sub.slug}
                                    href={`/${locale}/category/${sub.slug}`}
                                    className={megaCatSub}
                                    onClick={() => setProductsOpen(false)}
                                  >
                                    {t(`categories.names.${sub.slug}`, sub.name)}
                                  </Link>
                                )
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              if (link.href === `/${locale}/blog`) {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={openBlogMenu}
                    onMouseLeave={closeBlogMenu}
                  >
                    <Link
                      href={link.href}
                      className={navLinkClass}
                      onFocus={openBlogMenu}
                      onBlur={closeBlogMenu}
                      aria-haspopup="true"
                      aria-expanded={blogOpen}
                    >
                      {link.label}
                    </Link>
                    <div
                      className={[
                        megaBlogPanel,
                        blogOpen
                          ? "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 translate-y-2 pointer-events-none",
                      ].join(" ")}
                    >
                      <div className="p-10 columns-2 gap-16">
                        {blogSections.map((section) => (
                          <div
                            key={section.slug}
                            className="mb-10 break-inside-avoid"
                          >
                            <Link
                              href={`/${locale}/blog/${section.slug}`}
                              className={megaCatTitle}
                              onClick={() => setBlogOpen(false)}
                            >
                              {t(
                                `blogSections.${section.slug}.title`,
                                section.title
                              )}
                            </Link>
                            <div className="mt-3 columns-2 gap-10">
                              {section.subtopics.map((subtopic) => (
                                <Link
                                  key={subtopic.slug}
                                  href={`/${locale}/blog/${section.slug}#${subtopic.slug}`}
                                  className={megaCatSub}
                                  onClick={() => setBlogOpen(false)}
                                >
                                  {t(
                                    `blogSections.${section.slug}.subtopics.${subtopic.slug}`,
                                    subtopic.label
                                  )}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={navLinkClass}
                >
                  {link.label}
                </Link>
              );
            })}
            </nav>
          </div>

          {/* Columna central: logo (celda propia = sin solaparse con nav ni buscador) */}
          <div className="flex min-w-0 justify-center justify-self-center px-1 sm:px-2">
            <Link
              href={`/${locale}`}
              className="group flex shrink-0 items-center"
              aria-label="Go Natural"
            >
              <img
                src="/assets/images/logo/logo.webp"
                alt="Go Natural"
                className="h-11 w-auto opacity-95 transition-transform duration-300 ease-out group-hover:scale-[1.06] sm:h-12 md:h-14 lg:h-16"
                loading="lazy"
                decoding="async"
              />
            </Link>
          </div>

          {/* Columna derecha: búsqueda acotada (md+) + idiomas + cuenta + carrito, pegados al logo */}
          <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-2.5 md:justify-start md:gap-3 md:pl-2 lg:gap-4">
            <form
              className="hidden w-[min(100%,11rem)] shrink-0 sm:w-[min(100%,12.5rem)] md:flex md:w-[min(100%,13rem)] md:items-center lg:w-[min(100%,14rem)]"
              onSubmit={(event) => {
                event.preventDefault();
                submitSearch();
              }}
              role="search"
            >
              <label htmlFor="header-search" className="sr-only">
                {t("common.searchLabel")}
              </label>
              <div className="relative w-full">
                <span
                  className={
                    isProductDetailPage
                      ? "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                      : "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6.65 6.65a7.5 7.5 0 0 0 10.6 10.6Z"
                    />
                  </svg>
                </span>
                <input
                  id="header-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={t("common.searchPlaceholder")}
                  className={
                    isProductDetailPage
                      ? "w-full rounded-full border border-neutral-200 bg-white/90 py-2.5 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors duration-200 ease-out focus:border-accent-gold/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/40"
                      : "w-full rounded-full border border-white/15 bg-dark-base/80 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/45 transition-colors duration-200 ease-out focus:border-accent-gold/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/40"
                  }
                />
              </div>
            </form>

            <div className="hidden items-center gap-2 md:flex md:gap-3">
              {locales.map((lang) => (
                <Link
                  key={lang}
                  href={buildLocaleHref(lang)}
                  className={`text-xs font-semibold tracking-[0.12em] transition-colors duration-200 ${
                    lang === locale
                      ? "text-accent-gold"
                      : isProductDetailPage
                        ? "text-neutral-500 hover:text-neutral-800"
                        : "text-white/70 hover:text-white"
                  }`}
                >
                  {lang.toUpperCase()}
                </Link>
              ))}
            </div>
            {isLoggedIn && user ? (
              <Link
                href={`/${locale}/account`}
                className={
                  isProductDetailPage
                    ? "hidden text-sm font-semibold text-neutral-900 transition-colors hover:text-accent-gold md:inline"
                    : "hidden text-sm font-semibold text-white transition-colors hover:text-accent-gold md:inline"
                }
              >
                {t("header.greeting")}, {user.name}
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => openAuthModal("login")}
                  className={
                    isProductDetailPage
                      ? "hidden text-sm font-semibold text-neutral-900 transition-colors hover:text-accent-gold md:inline"
                      : "hidden text-sm font-semibold text-white transition-colors hover:text-accent-gold md:inline"
                  }
                >
                  {t("header.account")}
                </button>
                <Link
                  href={`/${locale}/auth?tab=login`}
                  className={
                    isProductDetailPage
                      ? "md:hidden text-xs font-semibold text-neutral-900 transition-colors hover:text-neutral-600"
                      : "md:hidden text-xs font-semibold text-white transition-colors hover:text-white/80"
                  }
                >
                  {t("header.account")}
                </Link>
              </>
            )}
            <Link
              href={`/${locale}/cart`}
              className={
                isProductDetailPage
                  ? "relative flex h-10 w-10 shrink-0 items-center justify-center text-neutral-900 transition-colors hover:text-neutral-600"
                  : "relative flex h-10 w-10 shrink-0 items-center justify-center text-white transition-colors hover:text-white/80"
              }
              aria-label={`Cart with ${totalItems} items`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.277M7.5 14.25l13.5-5.25M5.106 5.277c.194-1.01.937-1.777 1.936-1.777h13.916c.999 0 1.742.767 1.936 1.777M5.106 5.277L2.25 3m0 0h18.75M2.25 3v18m18.75-18v18"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent-gold px-1.5 text-xs font-medium text-dark-base">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>
            {!isLoggedIn && (
                <Link
                  href={`/${locale}/auth?tab=login`}
                  className={
                    isProductDetailPage
                      ? "flex h-10 w-10 shrink-0 items-center justify-center text-neutral-900 transition-colors hover:text-neutral-600 md:hidden"
                      : "flex h-10 w-10 shrink-0 items-center justify-center text-white transition-colors hover:text-white/80 md:hidden"
                  }
                  aria-label={t("header.account")}
                >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0v.75H4.5v-.75Z"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav
            className={
              isProductDetailPage
                ? "md:hidden pb-4 mt-2 pt-4 bg-white/95 backdrop-blur-md rounded-b-2xl border border-neutral-200/80 shadow-sm"
                : "md:hidden pb-4 mt-2 pt-4 bg-dark-base/95 backdrop-blur-md rounded-b-2xl"
            }
          >
            <div className="flex flex-col gap-3">
              <form
                className="flex items-center gap-2 px-1"
                onSubmit={(event) => {
                  event.preventDefault();
                  submitSearch();
                }}
                role="search"
              >
                <label htmlFor="header-search-mobile" className="sr-only">
                  {t("common.searchLabel")}
                </label>
                <div className="relative flex-1">
                  <span
                    className={
                      isProductDetailPage
                        ? "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                        : "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6.65 6.65a7.5 7.5 0 0 0 10.6 10.6Z"
                      />
                    </svg>
                  </span>
                  <input
                    id="header-search-mobile"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={t("common.searchPlaceholder")}
                    className={
                      isProductDetailPage
                        ? "w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-accent-gold/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/40"
                        : "w-full rounded-full border border-white/15 bg-dark-base/80 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/45 focus:border-accent-gold/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/40"
                    }
                  />
                </div>
              </form>
              {navLinks.map((link) =>
                link.href === `/${locale}/blog` ? (
                  <div key={link.href} className="flex flex-col gap-2">
                    <button
                      type="button"
                      className={
                        isProductDetailPage
                          ? "flex items-center justify-between rounded-md py-2 px-2 text-base font-medium text-neutral-900 transition-colors hover:text-neutral-600"
                          : "flex items-center justify-between rounded-md py-2 px-2 text-base font-medium text-white transition-colors hover:text-white/85"
                      }
                      onClick={() => setMobileBlogOpen((open) => !open)}
                      aria-expanded={mobileBlogOpen}
                      aria-controls="mobile-blog-menu"
                    >
                      <span>{link.label}</span>
                      <span
                        className={
                          isProductDetailPage
                            ? "text-sm text-neutral-500"
                            : "text-sm text-white/60"
                        }
                      >
                        {mobileBlogOpen ? "−" : "+"}
                      </span>
                    </button>
                    {mobileBlogOpen && (
                      <div
                        id="mobile-blog-menu"
                        className={
                          isProductDetailPage
                            ? "pl-3 border-l border-neutral-200 space-y-3"
                            : "pl-3 border-l border-white/10 space-y-3"
                        }
                      >
                        {blogSections.map((section) => (
                          <div key={section.slug} className="space-y-2">
                            <Link
                              href={`/${locale}/blog/${section.slug}`}
                              className={
                                isProductDetailPage
                                  ? "text-sm font-semibold text-neutral-900 transition-colors hover:text-accent-gold"
                                  : "text-sm font-semibold text-white transition-colors hover:text-accent-gold"
                              }
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {t(
                                `blogSections.${section.slug}.title`,
                                section.title
                              )}
                            </Link>
                            <div className="flex flex-col gap-1">
                              {section.subtopics.map((subtopic) => (
                                <Link
                                  key={subtopic.slug}
                                  href={`/${locale}/blog/${section.slug}#${subtopic.slug}`}
                                  className={
                                    isProductDetailPage
                                      ? "text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                                      : "text-sm text-white/75 transition-colors hover:text-white"
                                  }
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {t(
                                    `blogSections.${section.slug}.subtopics.${subtopic.slug}`,
                                    subtopic.label
                                  )}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={
                      isProductDetailPage
                        ? "rounded-md py-2 px-2 text-base font-medium text-neutral-900 transition-colors hover:text-neutral-600"
                        : "rounded-md py-2 px-2 text-base font-medium text-white transition-colors hover:text-white/85"
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div
                className={
                  isProductDetailPage
                    ? "flex flex-wrap items-center gap-3 border-t border-neutral-200 pt-3"
                    : "flex flex-wrap items-center gap-3 border-t border-white/10 pt-3"
                }
              >
                {locales.map((lang) => (
                  <Link
                    key={lang}
                    href={buildLocaleHref(lang)}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      lang === locale
                        ? "text-accent-gold"
                        : isProductDetailPage
                          ? "text-neutral-500 hover:text-neutral-800"
                          : "text-white/70 hover:text-white"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </Link>
                ))}
                {isLoggedIn && user ? (
                  <Link
                    href={`/${locale}/account`}
                    className={
                      isProductDetailPage
                        ? "text-sm font-semibold text-neutral-900 transition-colors hover:text-accent-gold"
                        : "text-sm font-semibold text-white transition-colors hover:text-accent-gold"
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("header.greeting")}, {user.name}
                  </Link>
                ) : (
                  <Link
                    href={`/${locale}/auth?tab=login`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={
                      isProductDetailPage
                        ? "text-sm font-semibold text-neutral-900 transition-colors hover:text-accent-gold"
                        : "text-sm font-semibold text-white transition-colors hover:text-accent-gold"
                    }
                  >
                    {t("header.account")}
                  </Link>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialTab={initialTab} />
    </header>
  );
}
