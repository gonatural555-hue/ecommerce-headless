import Link from "next/link";
import { getProducts } from "@/lib/products";
import ProductGridSimple from "@/components/ProductGridSimple";
import { getCategoryBySlug } from "@/lib/categories";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

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
  searchParams?: { q?: string };
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const t = createTranslator(messages);
  const products = getProducts();
  const rawQuery = typeof searchParams?.q === "string" ? searchParams.q : "";
  const normalizeText = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const query = normalizeText(rawQuery.trim());
  const filteredProducts = query
    ? products.filter((product) => {
        const localized = product.translations?.[locale];
        const title = localized?.title || product.title;
        return normalizeText(title).includes(query);
      })
    : products;
  const categories = MAIN_CATEGORIES.map((slug) => getCategoryBySlug(slug)).filter(
    (cat): cat is NonNullable<typeof cat> => cat !== undefined
  );

  return (
    <main className="bg-black-50">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/images/hero/productsbanner.webp"
            alt="Productos Go Natural"
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-dark-base/75 via-dark-base/50 to-dark-base/85" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 md:py-20">
          <Breadcrumbs
            variant="light"
            items={[
              { label: t("header.nav.home"), href: `/${locale}` },
              { label: t("header.nav.products") },
            ]}
          />
          <header className="mt-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("productsPage.title")}
            </h1>
            <p className="text-white max-w-2xl">
              {t("productsPage.subtitle")}
            </p>
          </header>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 md:py-16">
        {/* Filtros de categorías */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/${locale}/category/${category.slug}`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-text-primary border border-white/10 rounded-full hover:border-accent-gold/60 hover:text-accent-gold transition-colors duration-200 whitespace-nowrap"
              >
                {t(`categories.names.${category.slug}`, category.name)}
              </Link>
            ))}
          </div>
        </div>

        <ProductGridSimple
          products={filteredProducts}
          locale={locale}
          labels={{
            viewProduct: t("common.viewProduct"),
            addToCart: t("common.addToCart"),
            noImage: t("common.noImage"),
          }}
        />
      </div>
    </main>
  );
}
