import Image from "next/image";
import Link from "next/link";

export type BlogCardSize = "xl" | "lg" | "md" | "sm";

type BlogCardProps = {
  href: string;
  title: string;
  excerpt: string;
  image: string;
  ctaLabel: string;
  size?: BlogCardSize;
};

const sizeClasses: Record<
  BlogCardSize,
  { aspect: string; title: string; imageSizes: string }
> = {
  xl: {
    aspect: "aspect-[16/11] min-h-[240px]",
    title: "text-2xl md:text-3xl",
    imageSizes: "(max-width:768px)100vw,50vw",
  },
  lg: {
    aspect: "aspect-[4/5] min-h-[220px]",
    title: "text-xl md:text-2xl",
    imageSizes: "(max-width:768px)100vw,40vw",
  },
  md: {
    aspect: "aspect-[3/4] min-h-[200px]",
    title: "text-lg md:text-xl",
    imageSizes: "(max-width:768px)100vw,33vw",
  },
  sm: {
    aspect: "aspect-square min-h-[180px]",
    title: "text-base md:text-lg",
    imageSizes: "(max-width:768px)100vw,30vw",
  },
};

/**
 * Story-first card: image-led, quiet hover (lift + zoom), no clutter.
 */
export default function BlogCard({
  href,
  title,
  excerpt,
  image,
  ctaLabel,
  size = "md",
}: BlogCardProps) {
  const s = sizeClasses[size];

  return (
    <Link href={href} className="group block">
      <article className="flex h-full flex-col">
        <div
          className={`relative w-full overflow-hidden rounded-sm ${s.aspect}`}
        >
          <Image
            src={image}
            alt={title}
            fill
            sizes={s.imageSizes}
            className="object-cover object-center transition duration-[700ms] ease-out group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-base/85 via-dark-base/15 to-transparent" />
        </div>
        <div className="flex flex-1 flex-col pt-5">
          <h2
            className={`font-medium leading-snug tracking-tight text-text-primary ${s.title} line-clamp-3`}
          >
            {title}
          </h2>
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-text-muted">
            {excerpt}
          </p>
          <span className="mt-4 inline-flex text-xs font-medium uppercase tracking-[0.2em] text-accent-gold/90 transition duration-300 group-hover:text-accent-gold">
            {ctaLabel}
          </span>
        </div>
      </article>
    </Link>
  );
}
