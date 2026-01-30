import Link from "next/link";

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
            <Link
              key={post.href}
              href={post.href}
              className="group block space-y-5"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-dark-base/10 via-dark-base/25 to-dark-base/60" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-text-primary transition-opacity duration-200 group-hover:opacity-90">
                  {post.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed transition-opacity duration-200 group-hover:opacity-90">
                  {post.excerpt}
                </p>
                <span className="text-sm text-text-muted/80 group-hover:text-text-primary transition-colors duration-200">
                  {readLabel}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

