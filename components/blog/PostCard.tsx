import Link from "next/link";

type PostCardProps = {
  href: string;
  title: string;
  excerpt: string;
  image: string;
  ctaLabel: string;
};

export default function PostCard({
  href,
  title,
  excerpt,
  image,
  ctaLabel,
}: PostCardProps) {
  return (
    <Link href={href} className="group block">
      <article className="overflow-hidden rounded-2xl border border-white/5 bg-dark-surface/60 shadow-[0_8px_22px_rgba(0,0,0,0.28)] transition-all duration-300 ease-out hover:shadow-[0_12px_30px_rgba(0,0,0,0.34)] hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-base/70 via-dark-base/10 to-transparent" />
        </div>
        <div className="p-6 md:p-7 space-y-2">
          <h2 className="text-lg font-semibold text-text-primary line-clamp-2">
            {title}
          </h2>
          <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
            {excerpt}
          </p>
          <span className="inline-flex text-sm text-accent-gold transition-colors duration-200 ease-out group-hover:text-accent-gold/90">
            {ctaLabel}
          </span>
        </div>
      </article>
    </Link>
  );
}

