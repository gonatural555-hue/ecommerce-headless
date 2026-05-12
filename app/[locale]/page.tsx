import HomeHero from "@/components/home/HomeHero";
import HomeCompassCategories from "@/components/home/HomeCompassCategories";
import BrandStatement from "@/components/home/BrandStatement";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ImageStorySection from "@/components/home/ImageStorySection";
import CategoryGrid from "@/components/home/CategoryGrid";
import BlogPreview from "@/components/home/BlogPreview";
import CommunityCTA from "@/components/blog/CommunityCTA";
import { getProducts } from "@/lib/products";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import type { HeroCategoryCard } from "@/components/home/slides/HomeHeroCategorySlide";
import { buildHomeHeroCarouselProps } from "@/lib/build-home-hero-carousel-props";
import { LUMINOUS_EDGE_LIGHT } from "@/lib/ui/luminous-edge";

type HomePageMessages = {
  heroTagline: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaProducts: string;
  ctaJournal: string;
  brandStatement: string;
  essentialTitle: string;
  essentialSubtitle: string;
  imageStoryTitle: string;
  imageStoryAria: string;
  categoriesTitle: string;
  categoriesSubtitle: string;
  categoryCards: {
    label: string;
    slug?: string;
    path?: string;
    imageKey?: string;
  }[];
  journalTitle: string;
  journalIntro: string;
  journalCta: string;
  communityTitle: string;
  communityTagline?: string;
  communityBody: string;
  communityCta: string;
  heroImageAlt: string;
  /** Carrusel hero — slide categorías / productos (opcional, hay fallback en página) */
  heroSlide2Eyebrow?: string;
  heroSlide2Headline?: string;
  heroSlide2TrekkingTitle?: string;
  heroSlide3Eyebrow?: string;
  heroSlide3Headline?: string;
  heroSlide3Subline?: string;
  heroSlide3Cta?: string;
  heroSlide3StripLabel?: string;
};

const JOURNAL_PREVIEW_SLUGS = [
  "edge-of-water",
  "winter-lines",
  "calm-motion",
] as const;

const FALLBACK_IMG = "/assets/images/hero/hero.webp";

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

  const hp = (messages as { homePage?: HomePageMessages }).homePage;
  const h = hp ?? ({} as Partial<HomePageMessages>);

  const cardLabels = {
    viewProduct: t("common.viewProduct"),
    addToCart: t("common.addToCart"),
    noImage: t("common.noImage"),
  };

  const journalCtaHref = `/${locale}/blog`;
  const featuredPosts = JOURNAL_PREVIEW_SLUGS.map((slug) => {
    const post = messages.blog?.posts?.[slug];
    if (!post) return null;
    return {
      href: `/${locale}/blog/${slug}`,
      title: post.title,
      excerpt: post.excerpt,
      image:
        (post as { heroImage?: string }).heroImage ||
        post.sections?.[0]?.image ||
        "/assets/images/blog/blog-hero.webp",
    };
  }).filter(Boolean) as {
    href: string;
    title: string;
    excerpt: string;
    image: string;
  }[];

  const categoryCards = Array.isArray(h.categoryCards)
    ? h.categoryCards
    : [];

  const heroProps = buildHomeHeroCarouselProps(
    locale,
    t,
    products,
    {
      tagline: h.heroTagline ?? "Go Natural",
      title: h.heroTitle ?? t("homeImmersive.heroHeading"),
      subtitle: h.heroSubtitle ?? t("hero.subtitle"),
      ctaProducts: h.ctaProducts ?? t("hero.cta"),
      ctaJournal: h.ctaJournal ?? t("homeJournal.cta"),
      imageSrc: "/assets/images/hero/hero.webp",
      imageAlt: h.heroImageAlt ?? "",
    },
    {
      heroSlide2Eyebrow: h.heroSlide2Eyebrow,
      heroSlide2Headline: h.heroSlide2Headline,
      heroSlide2TrekkingTitle: h.heroSlide2TrekkingTitle,
      heroSlide3Eyebrow: h.heroSlide3Eyebrow,
      heroSlide3Headline: h.heroSlide3Headline,
      heroSlide3Subline: h.heroSlide3Subline,
      heroSlide3Cta: h.heroSlide3Cta,
      heroSlide3StripLabel: h.heroSlide3StripLabel,
    }
  );

  const heroCategoryCards: HeroCategoryCard[] = heroProps.categorySlide.cards;

  return (
    <main className={`flex min-h-screen flex-col bg-[#FFFFFF] text-dark-base ${LUMINOUS_EDGE_LIGHT}`}>
      <HomeHero {...heroProps} />

      <HomeCompassCategories
        locale={locale}
        cards={heroCategoryCards}
        cardinalLabels={{
          north: t("homeCompass.north"),
          south: t("homeCompass.south"),
          east: t("homeCompass.east"),
          west: t("homeCompass.west"),
        }}
        compassAriaLabel={t("homeCompass.compassAria")}
      />

      <BrandStatement text={h.brandStatement ?? t("story.title")} />

      <FeaturedProducts
        products={products}
        locale={locale}
        title={h.essentialTitle ?? t("featured.title")}
        subtitle={h.essentialSubtitle ?? t("featured.subtitle")}
        labels={cardLabels}
      />

      <ImageStorySection
        imageSrc="/assets/images/hero/trekking.webp"
        imageAlt={h.imageStoryAria ?? ""}
        title={h.imageStoryTitle ?? t("story.lines.0")}
      />

      {categoryCards.length > 0 ? (
        <CategoryGrid
          locale={locale}
          title={h.categoriesTitle ?? t("homePage.categoriesTitle")}
          subtitle={h.categoriesSubtitle ?? t("homePage.categoriesSubtitle")}
          cards={categoryCards}
        />
      ) : null}

      <BlogPreview
        title={h.journalTitle ?? t("homeJournal.title")}
        intro={h.journalIntro ?? t("homeJournal.intro")}
        ctaLabel={h.journalCta ?? t("homeJournal.cta")}
        ctaHref={journalCtaHref}
        readLabel={t("common.readArticle")}
        posts={featuredPosts}
      />

      <CommunityCTA
        title={h.communityTitle ?? t("blog.journal.communityTitle")}
        tagline={h.communityTagline}
        body={h.communityBody ?? t("blog.journal.communityBody")}
        ctaLabel={h.communityCta ?? t("blog.journal.communityCta")}
        href={`/${locale}/contact`}
      />
    </main>
  );
}
