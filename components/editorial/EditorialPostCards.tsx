import Link from "next/link";

type EditorialPost = {
  href: string;
  title: string;
  image: string;
  excerpt?: string;
};

type EditorialPostCardsProps = {
  title: string;
  posts: EditorialPost[];
  showExcerpt?: boolean;
};

export default function EditorialPostCards({
  title,
  posts,
  showExcerpt = false,
}: EditorialPostCardsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <h2 className="text-xl md:text-2xl font-semibold text-text-primary">
          {title}
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.href} href={post.href} className="group block space-y-4">
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
              <div className="space-y-2">
                <p className="text-base md:text-lg font-semibold text-text-primary transition-opacity duration-200 group-hover:opacity-90">
                  {post.title}
                </p>
                {showExcerpt && post.excerpt && (
                  <p className="text-sm text-text-muted leading-relaxed transition-opacity duration-200 group-hover:opacity-90">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

