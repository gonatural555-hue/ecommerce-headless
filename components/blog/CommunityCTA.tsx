import Link from "next/link";
import ScrollReveal from "@/components/blog/ScrollReveal";

type CommunityCTAProps = {
  title: string;
  /** Línea breve bajo el título (p. ej. “Move with intention”) */
  tagline?: string;
  body: string;
  ctaLabel: string;
  href: string;
};

/**
 * Closing community invitation — strong type, quiet frame.
 */
export default function CommunityCTA({
  title,
  tagline,
  body,
  ctaLabel,
  href,
}: CommunityCTAProps) {
  return (
    <section className="border-t border-white/[0.07] bg-[#0a0e0d] py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center sm:px-10">
        <ScrollReveal>
          <h2 className="font-semibold tracking-tight text-text-primary text-[clamp(1.85rem,4vw,2.75rem)] leading-tight">
            {title}
          </h2>
          {tagline ? (
            <p className="mx-auto mt-5 max-w-lg text-[0.7rem] font-medium uppercase tracking-[0.32em] text-accent-gold/90 sm:text-xs">
              {tagline}
            </p>
          ) : null}
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-text-muted md:text-lg">
            {body}
          </p>
          <Link
            href={href}
            className="mt-10 inline-flex items-center justify-center border border-accent-gold/50 bg-transparent px-8 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-accent-gold transition duration-300 hover:border-accent-gold hover:bg-accent-gold/10"
          >
            {ctaLabel}
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
