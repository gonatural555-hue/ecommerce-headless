import Link from "next/link";
import Hero from "@/components/hero/Hero";
import CategoriesSection from "@/components/sections/CategoriesSection";
import FeaturedProductsSection from "@/components/sections/FeaturedProductsSection";
import FinalCTASection from "@/components/sections/FinalCTASection";
import FeaturedJournalSection from "@/components/sections/FeaturedJournalSection";
import { getProducts } from "@/lib/products";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const seo = messages.seo?.home;

  return buildMetadata({
    locale,
    title: seo?.title,
    description: seo?.description,
    pathByLocale: {
      en: "/en",
      es: "/es",
      fr: "/fr",
      it: "/it",
    },
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const t = createTranslator(messages);
  const products = getProducts();
  const featuredProduct = products.find(
    (product) => product.id === "gn-outdoor-shoes-002"
  );
  const ctaHref = `/${locale}/products`;
  const journalCtaHref = `/${locale}/blog`;
  const featuredSlugs = [
    "quiet-journeys",
    "edge-of-water",
    "quiet-morning-at-camp",
  ];
  const featuredPosts = featuredSlugs
    .map((slug) => {
      const post = messages.blog?.posts?.[slug];
      if (!post) return null;
      return {
        href: `/${locale}/blog/${slug}`,
        title: post.title,
        excerpt: post.excerpt,
        image:
          post.heroImage ||
          post.sections?.[0]?.image ||
          "/assets/images/blog/blog-hero.webp",
      };
    })
    .filter(Boolean) as {
    href: string;
    title: string;
    excerpt: string;
    image: string;
  }[];
  const categoryItems = [
    {
      title: t("categoriesSection.items.mountainSnow"),
      href: `/${locale}/category/mountain-snow`,
      image: "/assets/images/categories/mountain-snow.webp",
    },
    {
      title: t("categoriesSection.items.waterSports"),
      href: `/${locale}/category/water-sports`,
      image: "/assets/images/categories/water-sports.webp",
    },
    {
      title: t("categoriesSection.items.outdoorCamping"),
      href: `/${locale}/category/outdoor-adventure`,
      image: "/assets/images/categories/outdoor-adventure.webp",
    },
    {
      title: t("categoriesSection.items.cycling"),
      href: `/${locale}/category/cycling`,
      image: "/assets/images/categories/cycling.webp",
    },
  ];
  const localizedFeatured = featuredProduct?.translations?.[locale];
  const featuredTitle =
    localizedFeatured?.title ?? featuredProduct?.title ?? "";
  const featuredDescription =
    localizedFeatured?.description ?? featuredProduct?.description ?? "";
  const featuredShortDescription =
    localizedFeatured?.shortDescription ??
    featuredProduct?.shortDescription ??
    featuredDescription;

  return (
    <main className="flex flex-col">
      {/* HERO */}
      <Hero
        titleLine1={t("hero.titleLine1")}
        titleLine2={t("hero.titleLine2")}
        subtitle={t("hero.subtitle")}
        ctaLabel={t("hero.cta")}
        ctaHref={ctaHref}
      />

      {/* FEATURED PRODUCTS */}
      <FeaturedProductsSection
        products={products}
        locale={locale}
        title={t("featured.title")}
        subtitle={t("featured.subtitle")}
        labels={{
          viewProduct: t("common.viewProduct"),
          addToCart: t("common.addToCart"),
          noImage: t("common.noImage"),
        }}
      />

      {/* CATEGORIES */}
      <CategoriesSection items={categoryItems} />

      {/* FEATURED PRODUCT */}
      {featuredProduct && (
        <section className="bg-dark-base py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid gap-12 md:gap-16 md:grid-cols-[3fr_2fr] items-center">
              <Link href={`/${locale}/products/${featuredProduct.id}`}>
                <article className="group flex h-full min-h-[320px] md:min-h-[520px] flex-col overflow-hidden rounded-2xl border border-white/5 bg-dark-surface/60 shadow-[0_6px_16px_rgba(0,0,0,0.24)] transition-shadow duration-300 ease-out hover:shadow-[0_10px_22px_rgba(0,0,0,0.28)]">
                  <div className="relative w-full flex-1 overflow-hidden bg-dark-surface">
                    <img
                      src={featuredProduct.images[0]}
                      alt={featuredTitle}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-dark-base/10 via-dark-base/20 to-dark-base/50" />
                  </div>
                  <div className="p-4 md:p-5 space-y-2">
                    <h2 className="text-base font-semibold text-text-primary line-clamp-2">
                      {featuredTitle}
                    </h2>
                    <p className="text-xs text-text-muted line-clamp-2">
                      {featuredShortDescription}
                    </p>
                    <div className="flex items-center justify-between pt-1.5">
                      <span className="text-sm text-text-primary">
                        ${featuredProduct.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-accent-gold transition-colors duration-200 ease-out group-hover:text-accent-gold/90">
                        {t("common.viewProduct")}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-4xl font-semibold text-text-primary">
                  {featuredTitle}
                </h2>
                <p className="mt-6 text-lg text-text-muted leading-relaxed">
                  {featuredDescription}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FEATURED JOURNAL */}
      <FeaturedJournalSection
        title={t("homeJournal.title")}
        intro={t("homeJournal.intro")}
        ctaLabel={t("homeJournal.cta")}
        ctaHref={journalCtaHref}
        readLabel={t("common.readArticle")}
        posts={featuredPosts}
      />

      {/* BENEFICIOS */}
      <section className="bg-black-50">
        <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center">
          <div>
            <h3 className="font-semibold text-lg">
              {messages.home.benefits[0].title}
            </h3>
            <p className="mt-2 text-sm text-text-muted">
              {messages.home.benefits[0].text}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              {messages.home.benefits[1].title}
            </h3>
            <p className="mt-2 text-sm text-text-muted">
              {messages.home.benefits[1].text}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              {messages.home.benefits[2].title}
            </h3>
            <p className="mt-2 text-sm text-text-muted">
              {messages.home.benefits[2].text}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              {messages.home.benefits[3].title}
            </h3>
            <p className="mt-2 text-sm text-text-muted">
              {messages.home.benefits[3].text}
            </p>
          </div>
        </div>
      </section>

      {/* QUÉ ES GO NATURAL */}
      <section className="relative bg-gray-50 bg-[url('/assets/images/hero/home-image.webp')] bg-cover bg-center bg-no-repeat">
        <div className="pointer-events-none absolute inset-0 bg-black/45" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white-900">
            {t("home.aboutTitle")}
          </h2>

          <p className="mt-6 text-white-800 text-lg leading-relaxed">
            {t("home.aboutText1")}
          </p>

          <p className="mt-4 text-black-500 font-semibold text-lg leading-relaxed">
            {t("home.aboutText2")}
          </p>
        </div>
      </section>

      {/* CONFIANZA */}
      <section className="bg-black-50">
        <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-text-muted/70 mb-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
            <h4 className="font-semibold">{messages.home.trust[0].title}</h4>
            <p className="mt-2 text-sm text-gray-600">
              {messages.home.trust[0].text}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-text-muted/70 mb-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
              />
            </svg>
            <h4 className="font-semibold">{messages.home.trust[1].title}</h4>
            <p className="mt-2 text-sm text-gray-600">
              {messages.home.trust[1].text}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-text-muted/70 mb-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-1.135 9.232 9.232 0 003.478-3.465c.33-.921-.074-1.9-.563-2.44a2.253 2.253 0 00-1.5-1.5c-.921-.33-1.9-.074-2.44.563a2.253 2.253 0 01-1.5 1.5 9.232 9.232 0 00-3.465 3.478 9.38 9.38 0 00-.372 2.625c0 .633.135 1.25.372 1.853a2.253 2.253 0 01-1.5 1.5 9.337 9.337 0 01-4.121 1.135 9.232 9.232 0 01-3.478-3.465 2.253 2.253 0 00-1.5-1.5 9.38 9.38 0 01-.372-2.625 9.38 9.38 0 00-.372-2.625 2.253 2.253 0 011.5-1.5 9.232 9.232 0 013.478-3.465 2.253 2.253 0 011.5-1.5c.921-.33 1.9-.074 2.44.563a2.253 2.253 0 011.5 1.5 9.232 9.232 0 003.465 3.478 9.38 9.38 0 00.372 2.625c0 .633-.135 1.25-.372 1.853a2.253 2.253 0 01-1.5 1.5z"
              />
            </svg>
            <h4 className="font-semibold">{messages.home.trust[2].title}</h4>
            <p className="mt-2 text-sm text-gray-600">
              {messages.home.trust[2].text}
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <FinalCTASection
        title={t("finalCta.title")}
        ctaLabel={t("finalCta.cta")}
        ctaHref={ctaHref}
      />
    </main>
  );
}
