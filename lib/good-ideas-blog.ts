import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export type GoodIdeasBlogSection = {
  heading?: string;
  paragraphs: string[];
  image?: string;
};

export type GoodIdeasBlogPost = {
  title: string;
  excerpt: string;
  subtitle?: string;
  intro?: string;
  sections?: GoodIdeasBlogSection[];
  closing?: string;
  heroImage?: string;
  relatedProductIds?: string[];
};

export type GoodIdeasBlogPostsMap = Record<string, GoodIdeasBlogPost>;

const FALLBACK_HERO = "/assets/images/blog/blog-hero.webp";

export function getGoodIdeasBlogPosts(
  messages: Record<string, unknown>
): GoodIdeasBlogPostsMap {
  const blog = (messages.goodIdeas as { blog?: { posts?: GoodIdeasBlogPostsMap } })
    ?.blog;
  const posts = blog?.posts;
  if (!posts || typeof posts !== "object") return {};
  return posts as GoodIdeasBlogPostsMap;
}

export function getGoodIdeasBlogPostSlugs(messages: Record<string, unknown>): string[] {
  return Object.keys(getGoodIdeasBlogPosts(messages));
}

export function getGoodIdeasBlogFeaturedSlug(
  messages: Record<string, unknown>
): string | undefined {
  const blog = (messages.goodIdeas as { blog?: { featuredSlug?: string } })?.blog;
  const slug = blog?.featuredSlug;
  const posts = getGoodIdeasBlogPosts(messages);
  if (slug && posts[slug]) return slug;
  const keys = Object.keys(posts);
  return keys[0];
}

export function resolveGoodIdeasPostHeroImage(post: GoodIdeasBlogPost): string {
  return (
    post.heroImage ||
    post.sections?.find((s) => s.image)?.image ||
    FALLBACK_HERO
  );
}

export async function loadGoodIdeasBlogPosts(locale: Locale) {
  const messages = await getMessages(locale);
  return getGoodIdeasBlogPosts(messages);
}
