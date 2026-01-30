import Link from "next/link";
import type { BlogSection } from "@/lib/blog-sections";

type BlogCategoryLayoutProps = {
  section: BlogSection;
  locale: string;
  posts: { href: string; title: string; excerpt: string }[];
  backLabel: string;
};

export default function BlogCategoryLayout({
  section,
  locale,
  posts,
  backLabel,
}: BlogCategoryLayoutProps) {
  return (
    <main className="bg-dark-base">
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
            Blog
          </p>
          <h1 className="mt-4 text-3xl md:text-4xl font-semibold text-text-primary">
            {section.title}
          </h1>
        </div>
      </section>

      <section className="pb-10 md:pb-12">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16 space-y-5">
          {section.manifesto.map((line, index) =>
            line ? (
              <p
                key={`${section.slug}-line-${index}`}
                className="text-base md:text-lg text-text-muted leading-relaxed"
              >
                {line}
              </p>
            ) : (
              <div key={`${section.slug}-spacer-${index}`} className="h-3" />
            )
          )}
        </div>
      </section>

      <section className="pb-12 md:pb-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          <h2 className="sr-only">Subtopics</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {section.subtopics.map((subtopic) => (
              <div
                key={subtopic.slug}
                id={subtopic.slug}
                className="scroll-mt-28 rounded-2xl border border-white/10 bg-dark-surface/30 px-5 py-4"
              >
                <p className="text-sm font-semibold text-text-primary">
                  {subtopic.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          <h2 className="sr-only">Posts</h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.href}
                href={post.href}
                className="block rounded-2xl border border-white/10 bg-dark-surface/30 px-5 py-4 hover:border-accent-gold/50 transition-colors duration-200"
              >
                <p className="text-base font-semibold text-text-primary">
                  {post.title}
                </p>
                <p className="mt-2 text-sm text-text-muted">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center text-sm text-accent-gold transition-colors duration-200 ease-out hover:text-accent-gold/90"
          >
            {backLabel}
          </Link>
        </div>
      </section>
    </main>
  );
}

