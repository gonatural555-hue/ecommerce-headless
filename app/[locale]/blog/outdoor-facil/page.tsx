import { notFound } from "next/navigation";
import BlogCategoryLayout from "@/components/blog/BlogCategoryLayout";
import { blogSections } from "@/lib/blog-sections";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const page = messages.blogCategoryPages?.["outdoor-facil"];
  const section = blogSections.find((item) => item.slug === "outdoor-facil");

  return buildMetadata({
    locale,
    title: page?.seoTitle,
    description: page?.description,
    pathByLocale: {
      en: "/en/blog/outdoor-facil",
      es: "/es/blog/outdoor-facil",
      fr: "/fr/blog/outdoor-facil",
      it: "/it/blog/outdoor-facil",
    },
    ogImage: section?.image,
  });
}

export default async function BlogOutdoorFacilPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const section = blogSections.find((item) => item.slug === "outdoor-facil");
  const messages = await getMessages(locale);
  const page = messages.blogCategoryPages?.["outdoor-facil"];
  const localizedSection = section
    ? {
        ...section,
        title: page?.title ?? section.title,
        manifesto: page?.manifesto ?? section.manifesto,
        subtopics: section.subtopics.map((subtopic) => ({
          ...subtopic,
          label:
            messages.blogSections?.["outdoor-facil"]?.subtopics?.[subtopic.slug] ??
            subtopic.label,
        })),
      }
    : null;

  if (!section || !localizedSection) {
    notFound();
  }

  const posts = Object.entries(messages.blog.posts)
    .filter(([slug]) => !section.postSlugs || section.postSlugs.includes(slug))
    .map(([slug, post]: any) => ({
      href: `/${locale}/blog/${slug}`,
      title: post.title,
      excerpt: post.excerpt,
    }));

  return (
    <BlogCategoryLayout
      section={localizedSection}
      locale={locale}
      posts={posts}
      backLabel={messages.common.backToJournal}
    />
  );
}

