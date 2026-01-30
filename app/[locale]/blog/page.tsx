import BlogHero from "@/components/blog/BlogHero";
import BlogGrid from "@/components/blog/BlogGrid";
import BlogSectionLinks from "@/components/blog/BlogSectionLinks";
import { blogSections } from "@/lib/blog-sections";
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
  const seo = messages.seo?.blog;

  return buildMetadata({
    locale,
    title: seo?.title,
    description: seo?.description,
    pathByLocale: {
      en: "/en/blog",
      es: "/es/blog",
      fr: "/fr/blog",
      it: "/it/blog",
    },
    ogImage: "/assets/images/blog/blog-hero.webp",
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const t = createTranslator(messages);
  const posts = Object.entries(messages.blog.posts).map(([slug, post]: any) => ({
    href: `/${locale}/blog/${slug}`,
    title: post.title,
    excerpt: post.excerpt,
    image: post.sections?.[0]?.image || "/assets/images/blog/blog-hero.webp",
  }));

  return (
    <main className="bg-dark-base">
      <BlogHero
        title={t("blog.title")}
        subtitle={t("blog.subtitle")}
        image="/assets/images/blog/blog-hero.webp"
      />

      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-lg text-text-muted">{t("blog.intro")}</p>
          <div className="mt-8">
            <BlogSectionLinks sections={blogSections} locale={locale} />
          </div>
        </div>
      </section>

      <BlogGrid posts={posts} ctaLabel={t("common.readArticle")} />
    </main>
  );
}

