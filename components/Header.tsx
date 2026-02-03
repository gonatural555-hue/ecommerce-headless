"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
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

  return (
    <header
      className={[
        "fixed top-0 z-50 w-full transition-all duration-300 ease-out",
        isScrolled
          ? "bg-dark-base/80 backdrop-blur-md"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo / Brand */}
          <Link 
            href={`/${locale}`}
            className="group flex items-center"
            aria-label="Go Natural"
          >
            <img
              src="/assets/images/logo/logo.webp"
              alt="Go Natural"
              className="h-16 md:h-22 w-auto opacity-90 transition-transform duration-300 ease-out group-hover:scale-[1.06]"
              loading="lazy"
              decoding="async"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
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
                      className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors duration-200"
                      onFocus={openProductsMenu}
                      onBlur={closeProductsMenu}
                      aria-haspopup="true"
                      aria-expanded={productsOpen}
                    >
                      Products
                    </Link>
                    <div
                      className={[
                        "absolute left-0 top-full mt-4 w-[900px] max-w-[92vw] rounded-2xl border border-white/10 bg-dark-base/95 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition-all duration-200 ease-out",
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
                              className="text-sm font-semibold tracking-[0.02em] text-text-primary hover:text-accent-gold transition-colors duration-200"
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
                                    className="mb-2 block break-inside-avoid text-sm text-text-muted hover:text-text-primary transition-colors duration-200"
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
                      className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors duration-200"
                      onFocus={openBlogMenu}
                      onBlur={closeBlogMenu}
                      aria-haspopup="true"
                      aria-expanded={blogOpen}
                    >
                      {link.label}
                    </Link>
                    <div
                      className={[
                        "absolute left-0 top-full mt-4 w-[760px] max-w-[92vw] rounded-2xl border border-white/10 bg-dark-base/95 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition-all duration-200 ease-out",
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
                              className="text-sm font-semibold tracking-[0.02em] text-text-primary hover:text-accent-gold transition-colors duration-200"
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
                                  className="mb-2 block break-inside-avoid text-sm text-text-muted hover:text-text-primary transition-colors duration-200"
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
                  className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors duration-200"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Search */}
          <form
            className="hidden lg:flex items-center flex-1 max-w-xs mx-6"
            onSubmit={(event) => {
              event.preventDefault();
              const trimmed = searchQuery.trim();
              router.push(
                trimmed
                  ? `/${locale}/products?q=${encodeURIComponent(trimmed)}`
                  : `/${locale}/products`
              );
            }}
            role="search"
          >
            <label htmlFor="header-search" className="sr-only">
              {t("common.searchLabel")}
            </label>
            <div className="relative w-full">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
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
                className="w-full rounded-full border border-white/10 bg-dark-base/70 py-2.5 pl-9 pr-4 text-sm text-text-primary placeholder:text-text-muted/70 transition-colors duration-200 ease-out focus:border-accent-gold/60 focus:outline-none"
              />
            </div>
          </form>

          {/* Cart Icon + Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              {locales.map((lang) => (
                <Link
                  key={lang}
                  href={buildLocaleHref(lang)}
                  className={`text-xs font-semibold tracking-[0.12em] transition-colors duration-200 ${
                    lang === locale
                      ? "text-accent-gold"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {lang.toUpperCase()}
                </Link>
              ))}
            </div>
            {isLoggedIn && user ? (
              <Link
                href={`/${locale}/account`}
                className="hidden md:inline text-sm font-semibold text-text-primary hover:text-accent-gold transition-colors duration-200"
              >
                {t("header.greeting")}, {user.name}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="hidden md:inline text-sm font-semibold text-text-primary hover:text-accent-gold transition-colors duration-200"
              >
                {t("header.account")}
              </button>
            )}
            {/* Cart Icon with Badge */}
            <Link
              href={`/${locale}/cart`}
              className="relative flex items-center justify-center w-10 h-10 text-text-muted hover:text-text-primary transition-colors duration-200"
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
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-medium text-dark-base bg-accent-gold rounded-full">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden flex items-center justify-center w-10 h-10 text-text-muted hover:text-text-primary transition-colors duration-200"
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
            {!isLoggedIn && (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="md:hidden flex items-center justify-center w-10 h-10 text-text-muted hover:text-text-primary transition-colors duration-200"
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
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 mt-2 pt-4 bg-dark-base/95 backdrop-blur-md rounded-b-2xl">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) =>
                link.href === `/${locale}/blog` ? (
                  <div key={link.href} className="flex flex-col gap-2">
                    <button
                      type="button"
                      className="flex items-center justify-between text-base font-medium text-text-primary hover:text-accent-gold transition-colors duration-200 py-2 px-2 rounded-md"
                      onClick={() => setMobileBlogOpen((open) => !open)}
                      aria-expanded={mobileBlogOpen}
                      aria-controls="mobile-blog-menu"
                    >
                      <span>{link.label}</span>
                      <span className="text-sm text-text-muted">
                        {mobileBlogOpen ? "−" : "+"}
                      </span>
                    </button>
                    {mobileBlogOpen && (
                      <div
                        id="mobile-blog-menu"
                        className="pl-3 border-l border-white/10 space-y-3"
                      >
                        {blogSections.map((section) => (
                          <div key={section.slug} className="space-y-2">
                            <Link
                              href={`/${locale}/blog/${section.slug}`}
                              className="text-sm font-semibold text-text-primary hover:text-accent-gold transition-colors duration-200"
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
                                  className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200"
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
                    className="text-base font-medium text-text-primary hover:text-accent-gold transition-colors duration-200 py-2 px-2 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="flex items-center gap-3 pt-2">
                {locales.map((lang) => (
                  <Link
                    key={lang}
                    href={buildLocaleHref(lang)}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      lang === locale
                        ? "text-accent-gold"
                        : "text-text-muted hover:text-text-primary"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </Link>
                ))}
                {isLoggedIn && user ? (
                  <Link
                    href={`/${locale}/account`}
                    className="text-sm font-semibold text-text-primary hover:text-accent-gold transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("header.greeting")}, {user.name}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-semibold text-text-primary hover:text-accent-gold transition-colors duration-200"
                  >
                    {t("header.account")}
                  </button>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
