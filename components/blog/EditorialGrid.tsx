import BlogCard, { type BlogCardSize } from "@/components/blog/BlogCard";
import ScrollReveal from "@/components/blog/ScrollReveal";

export type EditorialPost = {
  href: string;
  title: string;
  excerpt: string;
  image: string;
};

type EditorialGridProps = {
  posts: EditorialPost[];
  ctaLabel: string;
};

function sizeForIndex(i: number): BlogCardSize {
  const cycle = i % 7;
  if (cycle === 0) return "xl";
  if (cycle === 1 || cycle === 4) return "sm";
  if (cycle === 2 || cycle === 5) return "lg";
  return "md";
}

function gridClassForIndex(i: number): string {
  const cycle = i % 7;
  // Asymmetric 12-col rhythm on large screens
  if (cycle === 0) return "md:col-span-12 lg:col-span-8";
  if (cycle === 1) return "md:col-span-12 lg:col-span-4";
  if (cycle === 2) return "md:col-span-12 lg:col-span-5";
  if (cycle === 3) return "md:col-span-12 lg:col-span-7";
  if (cycle === 4) return "md:col-span-12 lg:col-span-4";
  if (cycle === 5) return "md:col-span-12 lg:col-span-6";
  return "md:col-span-12 lg:col-span-6";
}

/**
 * Non-uniform editorial mosaic: mixed card scales for visual rhythm.
 */
export default function EditorialGrid({ posts, ctaLabel }: EditorialGridProps) {
  if (posts.length === 0) return null;

  return (
    <section className="bg-dark-base py-8 md:py-14">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 gap-10 gap-y-14 md:grid-cols-12 md:gap-x-6 md:gap-y-16 lg:gap-x-8 lg:gap-y-20">
          {posts.map((post, i) => (
            <ScrollReveal
              key={post.href}
              delayMs={Math.min(i * 55, 400)}
              className={gridClassForIndex(i)}
            >
              <BlogCard
                href={post.href}
                title={post.title}
                excerpt={post.excerpt}
                image={post.image}
                ctaLabel={ctaLabel}
                size={sizeForIndex(i)}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
