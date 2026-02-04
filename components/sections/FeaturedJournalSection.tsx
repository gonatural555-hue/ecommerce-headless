import Link from "next/link";
import PostCard from "@/components/blog/PostCard";

type FeaturedPost = {
  href: string;
  title: string;
  excerpt: string;
  image: string;
};

type FeaturedJournalSectionProps = {
  title: string;
  intro: string;
  ctaLabel: string;
  ctaHref: string;
  readLabel: string;
  posts: FeaturedPost[];
};

export default function FeaturedJournalSection({
  title,
  intro,
  ctaLabel,
  ctaHref,
  readLabel,
  posts,
}: FeaturedJournalSectionProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-dark-base py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">
              {title}
            </h2>
            <p className="text-base md:text-lg text-text-muted leading-relaxed">
              {intro}
            </p>
          </div>
          <Link
            href={ctaHref}
            className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200"
          >
            {ctaLabel}
          </Link>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard
              key={post.href}
              href={post.href}
              title={post.title}
              excerpt={post.excerpt}
              image={post.image}
              ctaLabel={readLabel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

