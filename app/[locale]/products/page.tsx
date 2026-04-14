import Link from "next/link";
import { getProducts, type Product } from "@/lib/products";
import ProductGridSimple from "@/components/ProductGridSimple";
import { getCategoryBySlug } from "@/lib/categories";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

function interpolate(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function productMatchesQuery(
  product: Product,
  locale: Locale,
  query: string,
  norm: typeof normalizeText
): boolean {
  if (!query) return true;
  const loc = product.translations?.[locale];
  const chunks: string[] = [
    product.id,
    product.slug ?? "",
    product.title,
    loc?.title ?? "",
    product.category,
    product.description,
    loc?.description ?? "",
    product.shortDescription ?? "",
    loc?.shortDescription ?? "",
    ...(product.features ?? []),
    ...(loc?.features ?? []),
  ];
  const haystack = norm(chunks.filter(Boolean).join(" "));
  return haystack.includes(query);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const seo = messages.seo?.products;

  return buildMetadata({
    locale,
    title: seo?.title,
    description: seo?.description,
    pathByLocale: {
      en: "/en/products",
      es: "/es/products",
      fr: "/fr/products",
      it: "/it/products",
    },
    ogImage: "/assets/images/hero/productsbanner.webp",
  });
}

const MAIN_CATEGORIES = [
  "fishing",
  "water-sports",
  "mountain-snow",
  "outdoor-adventure",
  "active-sports",
];

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams?: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const t = createTranslator(messages);
  const sp = searchParams != null ? await searchParams : {};
  const rawQuery = typeof sp.q === "string" ? sp.q : "";
  const query = normalizeText(rawQuery.trim());

  const products = getProducts();
  const filteredProducts = query
    ? products.filter((product) =>
        productMatchesQuery(product, locale, query, normalizeText)
      )
    : products;

  const categories = MAIN_CATEGORIES.map((slug) => getCategoryBySlug(slug)).filter(
    (cat): cat is NonNullable<typeof cat> => cat !== undefined
  );

  const hasActiveSearch = rawQuery.trim().length > 0;

  return (
    <main className="min-h-screen bg-dark-base text-text-primary">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <img
            src="/assets/images/hero/productsbanner.webp"
            alt={t("productsPage.title")}
            className="h-full min-h-[280px] w-full object-cover object-center scale-[1.02] motion-reduce:scale-100"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-dark-base/40 via-transparent to-dark-base"
          aria-hidden
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28 min-h-[min(48vh,560px)] flex flex-col justify-end">
          <Breadcrumbs
            variant="darkHero"
            items={[
              { label: t("header.nav.home"), href: `/${locale}` },
              { label: t("header.nav.products") },
            ]}
          />
          <header className="mt-8 md:mt-10 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-[2rem] font-semibold tracking-tight text-white leading-tight">
              {t("productsPage.title")}
            </h1>
            <p className="mt-5 text-base md:text-lg text-white/70 leading-relaxed">
              {t("productsPage.subtitle")}
            </p>
            {hasActiveSearch ? (
              <p className="mt-4 text-sm font-medium text-white/90">
                {interpolate(t("productsPage.searchResultsFor", ""), {
                  query: rawQuery.trim(),
                })}
              </p>
            ) : null}
            <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#C2A27A]/30 bg-[#C2A27A]/20 px-4 py-2 text-sm font-medium text-[#E6E2D8]">
              <span
                className="h-1 w-1 shrink-0 rounded-full bg-[#C2A27A]/80"
                aria-hidden
              />
              {t("home.shippingHighlight")}
            </p>
          </header>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 md:pt-16 lg:pt-20 pb-16 md:pb-20 lg:pb-24">
        <div className="border-b border-white/5 pb-10 md:pb-12">
          <div className="flex flex-wrap gap-2.5 sm:gap-3 overflow-x-auto pb-2 scrollbar-rail-premium -mx-1 px-1">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/${locale}/category/${category.slug}`}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 transition-colors duration-200 whitespace-nowrap hover:border-white/15 hover:bg-white/10 hover:text-white"
              >
                {t(`categories.names.${category.slug}`, category.name)}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-16 md:mt-20">
          {hasActiveSearch && filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-dark-surface/60 px-6 py-12 text-center">
              <p className="text-lg font-semibold text-text-primary">
                {t("productsPage.searchNoResults", "")}
              </p>
              <p className="mt-3 text-sm text-text-muted leading-relaxed max-w-md mx-auto">
                {t("productsPage.searchNoResultsHint", "")}
              </p>
              <Link
                href={`/${locale}/products`}
                className="mt-8 inline-flex items-center justify-center rounded-xl bg-accent-gold px-6 py-3 text-sm font-semibold text-dark-base transition hover:bg-accent-gold/90"
              >
                {t("productsPage.searchViewAll", "")}
              </Link>
            </div>
          ) : (
            <ProductGridSimple
              products={filteredProducts}
              locale={locale}
              analyticsListName="all_products"
              labels={{
                viewProduct: t("common.viewProduct"),
                addToCart: t("common.addToCart"),
                noImage: t("common.noImage"),
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}
