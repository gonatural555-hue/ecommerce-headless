import type { Product } from "@/lib/products";

type BlogPost = {
  title?: string;
  excerpt?: string;
  subtitle?: string;
  intro?: string;
  heroImage?: string;
  sections?: { image?: string; paragraphs?: string[] }[];
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  water: ["water", "snorkel", "diving", "buceo", "agua"],
  snow: ["ski", "snow", "snowboard", "nieve"],
  camping: ["camp", "camping", "carpa", "campamento"],
  trekking: ["trekking", "trail", "hike", "sendero"],
  cycling: ["cycling", "bike", "cicl", "bici", "bikepacking"],
  fishing: ["fishing", "pesca"],
};

const CATEGORY_TO_BLOG_SLUGS: Record<string, string[]> = {
  "water-sports": ["edge-of-water", "snorkel-diving-familia-europa"],
  fishing: ["pesca-recreativa-apps-equipo", "salir-sin-complicarse"],
  "mountain-snow": ["winter-lines", "ski-snowboard-centros-sin-limite"],
  "outdoor-adventure": ["quiet-morning-at-camp", "salir-sin-complicarse"],
  cycling: ["calm-motion", "quiet-journeys"],
  "active-sports": ["calm-motion", "quiet-journeys"],
};

function normalizeText(text: string) {
  return text.toLowerCase();
}

function extractProductIdsFromImages(images: string[] = []) {
  const ids = images
    .map((src) => {
      const match = src.match(/\/assets\/images\/products\/([^/]+)\//);
      return match ? match[1] : null;
    })
    .filter(Boolean) as string[];
  return Array.from(new Set(ids));
}

function extractProductIdsFromParagraphs(paragraphs: string[] = []) {
  const ids = paragraphs
    .map((text) => {
      const match = text.match(/\/products\/([^"\s]+)/);
      return match ? match[1] : null;
    })
    .filter(Boolean) as string[];
  return Array.from(new Set(ids));
}

export function extractProductIdsFromPost(post: BlogPost) {
  const sectionImages = (post.sections || []).map((section) => section.image || "");
  const paragraphIds = (post.sections || [])
    .flatMap((section) => section.paragraphs || [])
    .flatMap((paragraph) => extractProductIdsFromParagraphs([paragraph]));
  const imageIds = extractProductIdsFromImages(sectionImages);
  return Array.from(new Set([...imageIds, ...paragraphIds]));
}

function inferCategoryHints(slug: string, post: BlogPost) {
  const base = [slug, post.title, post.subtitle, post.intro]
    .filter(Boolean)
    .join(" ");
  const text = normalizeText(base);
  const hints: string[] = [];

  Object.entries(CATEGORY_KEYWORDS).forEach(([key, words]) => {
    if (words.some((word) => text.includes(word))) {
      hints.push(key);
    }
  });

  return Array.from(new Set(hints));
}

function matchesCategory(product: Product, hints: string[]) {
  const category = normalizeText(product.category);
  return hints.some((hint) => category.includes(hint));
}

export function pickProductsForPost(
  slug: string,
  post: BlogPost,
  products: Product[],
  limit = 3
) {
  const directIds = extractProductIdsFromPost(post);
  const direct = products.filter((product) => directIds.includes(product.id));

  if (direct.length >= limit) {
    return direct.slice(0, limit);
  }

  const hints = inferCategoryHints(slug, post);
  const fallback = products.filter((product) => matchesCategory(product, hints));
  const combined = [...direct, ...fallback].filter(
    (product, index, all) =>
      all.findIndex((item) => item.id === product.id) === index
  );

  return combined.slice(0, limit);
}

export function pickPostsForProduct(
  product: Product,
  postsBySlug: Record<string, BlogPost>,
  limit = 3
) {
  const entries = Object.entries(postsBySlug);
  const directMatches = entries.filter(([, post]) =>
    extractProductIdsFromPost(post).includes(product.id)
  );

  if (directMatches.length >= limit) {
    return directMatches.slice(0, limit);
  }

  const hints = normalizeText(product.category);
  const keywordHits = entries.filter(([slug, post]) => {
    const text = normalizeText(`${slug} ${post.title || ""} ${post.subtitle || ""}`);
    return text.includes(hints.split(" ")[0] || "");
  });

  const combined = [...directMatches, ...keywordHits];
  const unique = combined.filter(
    ([slug], index, all) => all.findIndex(([s]) => s === slug) === index
  );

  if (unique.length >= limit) {
    return unique.slice(0, limit);
  }

  return entries.slice(0, limit);
}

export function pickPostsForCategory(
  categorySlug: string,
  postsBySlug: Record<string, BlogPost>,
  limit = 3
) {
  const slugs = CATEGORY_TO_BLOG_SLUGS[categorySlug] || [];
  const selected = slugs
    .map((slug) => [slug, postsBySlug[slug]] as const)
    .filter(([, post]) => Boolean(post));

  if (selected.length >= limit) {
    return selected.slice(0, limit);
  }

  const entries = Object.entries(postsBySlug);
  const combined = [...selected, ...entries];
  const unique = combined.filter(
    ([slug], index, all) => all.findIndex(([s]) => s === slug) === index
  );

  return unique.slice(0, limit);
}

export function pickPrimaryPostForCategory(
  categorySlug: string,
  postsBySlug: Record<string, BlogPost>
) {
  const slugs = CATEGORY_TO_BLOG_SLUGS[categorySlug] || [];
  for (const slug of slugs) {
    if (postsBySlug[slug]) {
      return { slug, post: postsBySlug[slug] };
    }
  }
  const [slug, post] = Object.entries(postsBySlug)[0] || [];
  if (!slug || !post) return null;
  return { slug, post };
}

