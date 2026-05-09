import Link from "next/link";
import ScrollReveal from "@/components/blog/ScrollReveal";
import { premiumPrimaryCtaClass } from "@/lib/ui/premium-cta-classes";
import { premiumOutdoorPrimaryCtaClass } from "@/lib/ui/premium-outdoor-classes";

type CommunityCTAProps = {
  title: string;
  /** Línea breve bajo el título (p. ej. “Move with intention”) */
  tagline?: string;
  body: string;
  ctaLabel: string;
  href: string;
  premiumOutdoorBranding?: boolean;
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
  premiumOutdoorBranding = false,
}: CommunityCTAProps) {
  const ctaClass = premiumOutdoorBranding
    ? premiumOutdoorPrimaryCtaClass
    : premiumPrimaryCtaClass;

  return (
    <section
      className={
        premiumOutdoorBranding
          ? "border-t border-[color-mix(in_srgb,var(--brand-warm-sand)_10%,transparent)] bg-brand-charcoal py-20 md:py-28 lg:py-32"
          : "border-t border-white/[0.07] bg-[#0a0e0d] py-20 md:py-28 lg:py-32"
      }
    >
      <div className="mx-auto max-w-3xl px-6 text-center sm:px-10">
        <ScrollReveal>
          <h2
            className={
              premiumOutdoorBranding
                ? "heading-lg text-brand-warm-sand text-[clamp(1.85rem,4vw,2.75rem)]"
                : "font-bold tracking-tight text-text-primary text-[clamp(1.85rem,4vw,2.75rem)] leading-tight"
            }
          >
            {title}
          </h2>
          {tagline ? (
            <p
              className={
                premiumOutdoorBranding
                  ? "mx-auto mt-5 max-w-lg text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-brand-sun-amber drop-shadow-[0_1px_10px_rgba(0,0,0,0.35)] sm:text-xs"
                  : "mx-auto mt-5 max-w-lg text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-accent-gold drop-shadow-[0_1px_10px_rgba(0,0,0,0.35)] sm:text-xs"
              }
            >
              {tagline}
            </p>
          ) : null}
          <p
            className={
              premiumOutdoorBranding
                ? "body-base mx-auto mt-6 max-w-xl text-[color-mix(in_srgb,var(--brand-warm-sand)_88%,transparent)] md:text-lg"
                : "mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/[0.88] md:text-lg"
            }
          >
            {body}
          </p>
          <Link href={href} className={`${ctaClass} mt-10`}>
            {ctaLabel}
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
