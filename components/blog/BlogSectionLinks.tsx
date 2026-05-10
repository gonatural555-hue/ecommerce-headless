import Link from "next/link";
import type { BlogSection } from "@/lib/blog-sections";

type BlogSectionLinksProps = {
  sections: BlogSection[];
  locale: string;
  variant?: "inline" | "stack";
};

export default function BlogSectionLinks({
  sections,
  locale,
  variant = "inline",
}: BlogSectionLinksProps) {
  const containerClass =
    variant === "inline"
      ? "flex flex-wrap gap-3"
      : "grid gap-4 md:grid-cols-2";

  return (
    <div className={containerClass}>
      {sections.map((section) => (
        <Link
          key={section.slug}
          href={`/${locale}/blog/${section.slug}`}
          className="inline-flex items-center rounded-full border border-earth-brown/25 px-4 py-2 text-sm font-medium text-dark-base transition-colors duration-200 hover:border-accent-gold/60 hover:text-accent-gold"
        >
          {section.title}
        </Link>
      ))}
    </div>
  );
}

