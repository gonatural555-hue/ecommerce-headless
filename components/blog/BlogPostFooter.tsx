import Link from "next/link";

type BlogPostFooterProps = {
  href?: string;
  label?: string;
};

export default function BlogPostFooter({
  href = "/blog",
  label = "Back to journal",
}: BlogPostFooterProps) {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-16">
        <Link
          href={href}
          className="inline-flex items-center text-sm text-accent-gold transition-colors duration-200 ease-out hover:text-accent-gold/90"
        >
          {label}
        </Link>
      </div>
    </section>
  );
}

