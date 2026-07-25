import type { HeroCategoryCard } from "@/components/home/slides/HomeHeroCategorySlide";
import type { HeroProductPayload } from "@/components/home/slides/HomeHeroProductsSlide";
import type { HomeHeroCarouselProps } from "@/components/home/HomeHeroCarousel";
import type { Locale } from "@/lib/i18n/config";
import type { Product } from "@/lib/products";
import { createTranslator } from "@/lib/i18n/translate";
import { CATEGORIES } from "@/lib/categories";
import { HOME_CATEGORY_IMAGE } from "@/lib/home-category-visuals";

type Translator = ReturnType<typeof createTranslator>;

const HERO_PRODUCT_MAIN_ID = "gn-ski-snow-001-sk7a1";
const HERO_PRODUCT_STRIP_IDS = ["gn-water-007", "gn-outdoor-009", "gn-cycling-eq-001"] as const;
const FALLBACK_IMG = "/assets/images/hero/hero.webp";

function categoryDescription(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.description ?? "";
}

function heroCategoryImage(slug: string) {
  return HOME_CATEGORY_IMAGE[slug] ?? FALLBACK_IMG;
}

function toHeroProductPayload(locale: Locale, p: Product): HeroProductPayload {
  const loc = p.translations?.[locale];
  return {
    id: p.id,
    title: loc?.title ?? p.title,
    image: p.images?.[0] ?? null,
    price: p.price,
    href: `/${locale}/products/${p.id}`,
  };
}

export type HomePageHeroOverrides = {
  heroSlide2Eyebrow?: string;
  heroSlide2Headline?: string;
  heroSlide2TrekkingTitle?: string;
  heroSlide3Eyebrow?: string;
  heroSlide3Headline?: string;
  heroSlide3Subline?: string;
  heroSlide3Cta?: string;
  heroSlide3StripLabel?: string;
};

export function buildHomeHeroCarouselProps(
  locale: Locale,
  t: Translator,
  products: Product[],
  firstSlide: {
    tagline: string;
    title: string;
    subtitle: string;
    ctaProducts: string;
    ctaJournal: string;
    imageSrc: string;
    imageAlt: string;
  },
  overrides?: HomePageHeroOverrides
): HomeHeroCarouselProps {
  const h = overrides ?? {};

  const trekkingTitle =
    h.heroSlide2TrekkingTitle ??
    (locale === "es"
      ? "Trekking y camping"
      : locale === "fr"
        ? "Trekking et camping"
        : locale === "it"
          ? "Trekking e campeggio"
          : "Trekking & Camping");

  const heroCategoryCards: HeroCategoryCard[] = [
    {
      slug: "mountain-snow",
      title: t("categories.names.mountain-snow"),
      subtitle: categoryDescription("mountain-snow"),
      image: heroCategoryImage("mountain-snow"),
    },
    {
      slug: "water-sports",
      title: t("categories.names.water-sports"),
      subtitle: categoryDescription("water-sports"),
      image: heroCategoryImage("water-sports"),
    },
    {
      slug: "outdoor-adventure",
      title: trekkingTitle,
      subtitle: categoryDescription("outdoor-adventure"),
      image: heroCategoryImage("outdoor-adventure"),
    },
    {
      slug: "active-sports",
      title: t("categories.names.active-sports"),
      subtitle: categoryDescription("active-sports"),
      image: heroCategoryImage("active-sports"),
    },
  ];

  const mainProduct =
    products.find((p) => p.id === HERO_PRODUCT_MAIN_ID) ?? products[0];
  const stripProducts = HERO_PRODUCT_STRIP_IDS.map((id) =>
    products.find((p) => p.id === id)
  ).filter((p): p is Product => Boolean(p));

  const productsSlide: HomeHeroCarouselProps["productsSlide"] =
    mainProduct != null
      ? {
          eyebrow: h.heroSlide3Eyebrow ?? "Featured",
          headline:
            h.heroSlide3Headline ??
            "Built for cold starts, long approaches, and uncertain forecasts.",
          subline:
            h.heroSlide3Subline ??
            "Layers, hydration, and kit we trust when the trail outlasts the daylight.",
          ctaLabel: h.heroSlide3Cta ?? t("common.viewProduct"),
          stripLabel: h.heroSlide3StripLabel ?? "Also shop",
          main: toHeroProductPayload(locale, mainProduct),
          strip: stripProducts.map((p) => toHeroProductPayload(locale, p)),
        }
      : {
          eyebrow: "Featured",
          headline: "Gear that moves with you.",
          subline: "Explore the catalog.",
          ctaLabel: t("common.viewProduct"),
          stripLabel: "Also shop",
          main: {
            id: "fallback",
            title: "Products",
            image: FALLBACK_IMG,
            price: 0,
            href: `/${locale}/products`,
          },
          strip: [] as HeroProductPayload[],
        };

  return {
    locale,
    tagline: firstSlide.tagline,
    title: firstSlide.title,
    subtitle: firstSlide.subtitle,
    ctaProducts: firstSlide.ctaProducts,
    ctaJournal: firstSlide.ctaJournal,
    imageSrc: firstSlide.imageSrc,
    imageAlt: firstSlide.imageAlt,
    categorySlide: {
      eyebrow: h.heroSlide2Eyebrow ?? "Collections",
      headline: h.heroSlide2Headline ?? "Choose your line",
      cards: heroCategoryCards,
    },
    productsSlide,
  };
}
