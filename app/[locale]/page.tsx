import Link from "next/link";
import FeaturedProductsSection from "@/components/sections/FeaturedProductsSection";
import FinalCTASection from "@/components/sections/FinalCTASection";
import FeaturedJournalSection from "@/components/sections/FeaturedJournalSection";
import HomeImmersiveHero from "@/components/home/HomeImmersiveHero";
import HomeCategoryCarousel from "@/components/home/HomeCategoryCarousel";
import { getProducts } from "@/lib/products";
import { getProductsByCategorySlug } from "@/lib/categories";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";

const CATEGORY_CAROUSEL_LIMIT = 16;

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

  const snowProducts = getProductsByCategorySlug("mountain-snow").slice(
    0,
    CATEGORY_CAROUSEL_LIMIT
  );
  const campingProducts = getProductsByCategorySlug("outdoor-adventure").slice(
    0,
    CATEGORY_CAROUSEL_LIMIT
  );
  const cyclingRunningProducts = getProductsByCategorySlug(
    "active-sports"
  ).slice(0, CATEGORY_CAROUSEL_LIMIT);
  const waterProducts = getProductsByCategorySlug("water-sports").slice(
    0,
    CATEGORY_CAROUSEL_LIMIT
  );

  const cardLabels = {
    viewProduct: t("common.viewProduct"),
    addToCart: t("common.addToCart"),
    noImage: t("common.noImage"),
  };

  const featuredProduct = products.find(
    (product) => product.id === "gn-outdoor-shoes-002"
  );
  const ctaHref = `/${locale}/products`;
  const journalCtaHref = `/${locale}/blog`;
  const featuredSlugs = [
    "camping-fin-de-semana-basico",
    "no-mires-para-arriba",
    "atreverse-un-poco-mas",
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
    <main className="flex flex-col bg-[#1F2D26] text-text-primary">
      <HomeImmersiveHero
        heading={t("homeImmersive.heroHeading")}
        scrollTargetId="home-categories-start"
        scrollLabel={t("homeImmersive.scrollHint")}
      />

      <div id="home-categories-start" className="scroll-mt-0" aria-hidden />

      <HomeCategoryCarousel
        title={t("homeImmersive.categories.snowMountain")}
        products={snowProducts}
        locale={locale}
        categoryHref={`/${locale}/category/mountain-snow`}
        viewCategoryLabel={t("homeImmersive.viewCategory")}
        labels={cardLabels}
      />

      <HomeCategoryCarousel
        title={t("homeImmersive.categories.camping")}
        products={campingProducts}
        locale={locale}
        categoryHref={`/${locale}/category/outdoor-adventure`}
        viewCategoryLabel={t("homeImmersive.viewCategory")}
        labels={cardLabels}
      />

      <HomeCategoryCarousel
        title={t("homeImmersive.categories.cyclingRunning")}
        products={cyclingRunningProducts}
        locale={locale}
        categoryHref={`/${locale}/category/active-sports`}
        viewCategoryLabel={t("homeImmersive.viewCategory")}
        labels={cardLabels}
      />

      <HomeCategoryCarousel
        title={t("homeImmersive.categories.waterSports")}
        products={waterProducts}
        locale={locale}
        categoryHref={`/${locale}/category/water-sports`}
        viewCategoryLabel={t("homeImmersive.viewCategory")}
        labels={cardLabels}
      />

      <FeaturedProductsSection
        products={products}
        locale={locale}
        title={t("featured.title")}
        subtitle={t("featured.subtitle")}
        labels={cardLabels}
      />

      {featuredProduct && (
        <section className="bg-dark-base py-24 md:py-32 border-t border-white/5">
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

      <FeaturedJournalSection
        title={t("homeJournal.title")}
        intro={t("homeJournal.intro")}
        ctaLabel={t("homeJournal.cta")}
        ctaHref={journalCtaHref}
        readLabel={t("common.readArticle")}
        posts={featuredPosts}
      />

      <section
        className="relative border-t border-white/5 overflow-hidden"
        aria-labelledby="home-brand-editorial-heading"
      >
        <div
          className="absolute inset-0 bg-[url('/assets/images/hero/home-image.webp')] bg-cover bg-center bg-no-repeat scale-105 motion-reduce:scale-100"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[#1F2D26]/88"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-[#1F2D26]/65 to-[#1F2D26]/95"
          aria-hidden
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 md:py-24 lg:py-28">
          <div className="max-w-2xl mx-auto text-center">
            <h2
              id="home-brand-editorial-heading"
              className="text-2xl sm:text-3xl md:text-[2rem] font-semibold tracking-tight text-[#E6E2D8] leading-snug"
            >
              {t("home.aboutTitle")}
            </h2>
            <p className="mt-6 text-base md:text-lg text-white/65 leading-relaxed">
              {t("home.aboutText1")}
            </p>
            <p className="mt-4 text-sm md:text-base text-[#C2A27A]/90 leading-relaxed">
              {t("home.aboutText2")}
            </p>
          </div>

          <div className="mt-14 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {(messages.home.benefits as { title: string; text: string }[]).map(
              (item, index) => (
              <div
                key={`home-benefit-${index}`}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-6 md:px-6 md:py-7 text-left"
              >
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[#C2A27A]/75 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-sm font-semibold tracking-wide text-[#E6E2D8] leading-snug">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm text-white/60 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 md:mt-12 flex justify-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#C2A27A]/30 bg-[#1F2D26]/50 px-4 py-2 text-xs sm:text-sm font-medium text-[#C2A27A]/95 tracking-wide">
              <span
                className="h-1 w-1 rounded-full bg-[#C2A27A]/70 shrink-0"
                aria-hidden
              />
              {t("home.shippingHighlight")}
            </p>
          </div>

          <div className="mt-14 md:mt-16 pt-10 md:pt-12 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            <div className="flex flex-col items-center text-center rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm px-5 py-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-[#C2A27A]/80 mb-3 shrink-0"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
              <h4 className="text-sm font-semibold text-[#E6E2D8]">
                {messages.home.trust[0].title}
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-white/55 leading-relaxed max-w-xs">
                {messages.home.trust[0].text}
              </p>
            </div>

            <div className="flex flex-col items-center text-center rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm px-5 py-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-[#C2A27A]/80 mb-3 shrink-0"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                />
              </svg>
              <h4 className="text-sm font-semibold text-[#E6E2D8]">
                {messages.home.trust[1].title}
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-white/55 leading-relaxed max-w-xs">
                {messages.home.trust[1].text}
              </p>
            </div>

            <div className="flex flex-col items-center text-center rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm px-5 py-6 sm:col-span-2 lg:col-span-1 w-full max-w-md mx-auto lg:max-w-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-[#C2A27A]/80 mb-3 shrink-0"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-1.135 9.232 9.232 0 003.478-3.465c.33-.921-.074-1.9-.563-2.44a2.253 2.253 0 00-1.5-1.5c-.921-.33-1.9-.074-2.44.563a2.253 2.253 0 01-1.5 1.5 9.232 9.232 0 00-3.465 3.478 9.38 9.38 0 00-.372 2.625c0 .633.135 1.25.372 1.853a2.253 2.253 0 01-1.5 1.5 9.337 9.337 0 01-4.121 1.135 9.232 9.232 0 01-3.478-3.465 2.253 2.253 0 00-1.5-1.5 9.38 9.38 0 01-.372-2.625 9.38 9.38 0 00-.372-2.625 2.253 2.253 0 011.5-1.5 9.232 9.232 0 013.478-3.465 2.253 2.253 0 011.5-1.5c.921-.33 1.9-.074 2.44.563a2.253 2.253 0 011.5 1.5 9.232 9.232 0 003.465 3.478 9.38 9.38 0 00.372 2.625c0 .633-.135 1.25-.372 1.853a2.253 2.253 0 01-1.5 1.5z"
                />
              </svg>
              <h4 className="text-sm font-semibold text-[#E6E2D8]">
                {messages.home.trust[2].title}
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-white/55 leading-relaxed max-w-xs">
                {messages.home.trust[2].text}
              </p>
            </div>
          </div>
        </div>
      </section>

      <FinalCTASection
        title={t("finalCta.title")}
        ctaLabel={t("finalCta.cta")}
        ctaHref={ctaHref}
      />
    </main>
  );
}
