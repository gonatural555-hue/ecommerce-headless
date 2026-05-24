import GoodIdeasBlogHero from "@/components/good-ideas/GoodIdeasBlogHero";
import GoodIdeasComingSoonBlock from "@/components/good-ideas/GoodIdeasComingSoonBlock";
import GoodIdeasFeaturedStory from "@/components/good-ideas/GoodIdeasFeaturedStory";
import PostCard from "@/components/blog/PostCard";
import {
  getGoodIdeasBlogFeaturedSlug,
  getGoodIdeasBlogPosts,
  resolveGoodIdeasPostHeroImage,
} from "@/lib/good-ideas-blog";
import { GI_BLOG_POSTS_ANCHOR } from "@/lib/ui/goodideas-design";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { BRAND_SEGMENTS, goodIdeasBlogPostPath } from "@/lib/routing/brands";

const FALLBACK_IMAGE = "/assets/images/blog/blog-hero.webp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const seo = messages.seo?.goodIdeas?.blog;

  return buildMetadata({
    locale,
    title: seo?.title,
    description: seo?.description,
    pathByLocale: {
      en: `/en/${BRAND_SEGMENTS.goodIdeas}/blog`,
      es: `/es/${BRAND_SEGMENTS.goodIdeas}/blog`,
      fr: `/fr/${BRAND_SEGMENTS.goodIdeas}/blog`,
      it: `/it/${BRAND_SEGMENTS.goodIdeas}/blog`,
    },
  });
}

export default async function GoodIdeasBlogPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const t = createTranslator(messages);
  const postsMap = getGoodIdeasBlogPosts(messages);
  const slugs = Object.keys(postsMap);

  if (slugs.length === 0) {
    return (
      <main className="bg-[#0B0F14] text-[#E8ECF1]">
        <GoodIdeasBlogHero
          locale={locale}
          title={t("goodIdeas.blog.heroTitle")}
          subtitle={t("goodIdeas.blog.heroSubtitle")}
          eyebrow={t("goodIdeas.blog.eyebrow")}
          exploreCtaLabel={t("goodIdeas.blog.exploreCta")}
          scrollHint={t("goodIdeas.blog.scrollHint")}
          postsAnchorId={GI_BLOG_POSTS_ANCHOR}
          sectionAriaLabel={t("goodIdeas.blog.sectionAria")}
        />
        <GoodIdeasComingSoonBlock
          id={GI_BLOG_POSTS_ANCHOR}
          title={t("goodIdeas.blog.comingSoonTitle")}
          body={t("goodIdeas.blog.comingSoonBody")}
        />
      </main>
    );
  }

  const featuredSlug = getGoodIdeasBlogFeaturedSlug(messages);
  const entries = slugs.map((slug) => {
    const post = postsMap[slug];
    return {
      slug,
      href: goodIdeasBlogPostPath(locale, slug),
      title: post.title,
      excerpt: post.excerpt,
      image: resolveGoodIdeasPostHeroImage(post) || FALLBACK_IMAGE,
    };
  });

  const featured =
    entries.find((e) => e.slug === featuredSlug) ?? entries[0] ?? null;
  const rest = featured
    ? entries.filter((e) => e.slug !== featured.slug)
    : entries;

  return (
    <main className="bg-[#0B0F14] text-[#E8ECF1]">
      <GoodIdeasBlogHero
        locale={locale}
        title={t("goodIdeas.blog.heroTitle")}
        subtitle={t("goodIdeas.blog.heroSubtitle")}
        eyebrow={t("goodIdeas.blog.eyebrow")}
        exploreCtaLabel={t("goodIdeas.blog.exploreCta")}
        scrollHint={t("goodIdeas.blog.scrollHint")}
        postsAnchorId={GI_BLOG_POSTS_ANCHOR}
        sectionAriaLabel={t("goodIdeas.blog.sectionAria")}
      />

      {featured ? (
        <GoodIdeasFeaturedStory
          post={featured}
          eyebrow={t("goodIdeas.blog.featuredLabel")}
          ctaLabel={t("common.readArticle")}
          anchorId={GI_BLOG_POSTS_ANCHOR}
        />
      ) : null}

      {rest.length > 0 ? (
        <section className="border-t border-white/[0.06] bg-[#0B0F14] py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-12">
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-[#E8ECF1] md:text-2xl">
              {t("goodIdeas.blog.articlesLabel")}
            </h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((entry) => (
                <PostCard
                  key={entry.slug}
                  href={entry.href}
                  title={entry.title}
                  excerpt={entry.excerpt}
                  image={entry.image}
                  ctaLabel={t("common.readArticle")}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
