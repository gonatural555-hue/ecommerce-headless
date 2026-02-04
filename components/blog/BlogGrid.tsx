// Client not required: no scroll animation needed for visibility.
import PostCard from "@/components/blog/PostCard";

type BlogPostItem = {
  href: string;
  title: string;
  excerpt: string;
  image: string;
};

type BlogGridProps = {
  posts: BlogPostItem[];
  ctaLabel: string;
};

export default function BlogGrid({ posts, ctaLabel }: BlogGridProps) {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard
              key={post.href}
              href={post.href}
              title={post.title}
              excerpt={post.excerpt}
              image={post.image}
              ctaLabel={ctaLabel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

