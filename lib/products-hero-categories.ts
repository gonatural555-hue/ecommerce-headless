import type { CategoryHeroKind } from "@/lib/category-hero-theme";

const IMG = {
  fishing: "/assets/images/hero/products/fishing.webp",
  snow: "/assets/images/hero/products/snow.webp",
  surf: "/assets/images/hero/products/surf.webp",
  camping: "/assets/images/hero/products/camping.webp",
} as const;

export type ProductsHeroCategoryCard = {
  id: string;
  slug: string;
  titleKey: string;
  descriptionKey: string;
  ctaKey: string;
  image: string;
};

/** Carrusel hero /products — 8 tarjetas alineadas al header. */
export const PRODUCTS_HERO_CATEGORY_CARDS: ProductsHeroCategoryCard[] = [
  {
    id: "campamento-senderismo",
    slug: "campamento-senderismo",
    titleKey: "header.tabs.campHike",
    descriptionKey: "productsPage.heroCategoryCards.campamento.description",
    ctaKey: "productsPage.heroCategoryCards.campamento.cta",
    image: IMG.camping,
  },
  {
    id: "escalada",
    slug: "escalada",
    titleKey: "header.tabs.climb",
    descriptionKey: "productsPage.heroCategoryCards.escalada.description",
    ctaKey: "productsPage.heroCategoryCards.escalada.cta",
    image: IMG.snow,
  },
  {
    id: "ciclismo",
    slug: "ciclismo",
    titleKey: "header.tabs.cycle",
    descriptionKey: "productsPage.heroCategoryCards.ciclismo.description",
    ctaKey: "productsPage.heroCategoryCards.ciclismo.cta",
    image: IMG.camping,
  },
  {
    id: "agua",
    slug: "agua",
    titleKey: "header.tabs.water",
    descriptionKey: "productsPage.heroCategoryCards.agua.description",
    ctaKey: "productsPage.heroCategoryCards.agua.cta",
    image: IMG.surf,
  },
  {
    id: "running",
    slug: "running",
    titleKey: "header.tabs.run",
    descriptionKey: "productsPage.heroCategoryCards.running.description",
    ctaKey: "productsPage.heroCategoryCards.running.cta",
    image: IMG.snow,
  },
  {
    id: "nieve",
    slug: "nieve",
    titleKey: "header.tabs.snow",
    descriptionKey: "productsPage.heroCategoryCards.nieve.description",
    ctaKey: "productsPage.heroCategoryCards.nieve.cta",
    image: IMG.snow,
  },
  {
    id: "viaje",
    slug: "viaje",
    titleKey: "header.tabs.travel",
    descriptionKey: "productsPage.heroCategoryCards.viaje.description",
    ctaKey: "productsPage.heroCategoryCards.viaje.cta",
    image: IMG.camping,
  },
  {
    id: "pesca",
    slug: "fishing",
    titleKey: "header.tabs.fishing",
    descriptionKey: "productsPage.heroCategoryCards.fishing.description",
    ctaKey: "productsPage.heroCategoryCards.fishing.cta",
    image: IMG.fishing,
  },
];

/** Fondo hero por slug de categoría (mockup temporal). */
export const CATEGORY_HERO_BACKGROUND_BY_SLUG: Record<string, string> = {
  "campamento-senderismo": IMG.camping,
  escalada: IMG.snow,
  ciclismo: IMG.camping,
  agua: IMG.surf,
  running: IMG.snow,
  nieve: IMG.snow,
  viaje: IMG.camping,
  fishing: IMG.fishing,
  men: IMG.camping,
  women: IMG.camping,
  kids: IMG.camping,
  ofertas: IMG.camping,
};

const KIND_FALLBACK: Record<CategoryHeroKind, string> = {
  fishing: IMG.fishing,
  "mountain-snow": IMG.snow,
  "water-sports": IMG.surf,
  "outdoor-adventure": IMG.camping,
  "active-sports": IMG.camping,
};

export function getCategoryHeroBackgroundImage(
  kind: CategoryHeroKind,
  slug?: string
): string {
  if (slug && CATEGORY_HERO_BACKGROUND_BY_SLUG[slug]) {
    return CATEGORY_HERO_BACKGROUND_BY_SLUG[slug]!;
  }
  return KIND_FALLBACK[kind];
}
