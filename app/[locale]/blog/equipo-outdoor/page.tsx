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
  const page = messages.blogCategoryPages?.["equipo-outdoor"];
  const section = blogSections.find((item) => item.slug === "equipo-outdoor");

  return buildMetadata({
    locale,
    title: page?.seoTitle,
    description: page?.description,
    pathByLocale: {
      en: "/en/blog/equipo-outdoor",
      es: "/es/blog/equipo-outdoor",
      fr: "/fr/blog/equipo-outdoor",
      it: "/it/blog/equipo-outdoor",
    },
    ogImage: section?.image,
  });
}

export default async function BlogEquipoOutdoorPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const section = blogSections.find((item) => item.slug === "equipo-outdoor");
  const messages = await getMessages(locale);

  if (!section) {
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
      section={section}
      locale={locale}
      posts={posts}
      backLabel={messages.common.backToJournal}
    />
  );
}

