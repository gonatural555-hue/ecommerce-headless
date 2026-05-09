import ScrollReveal from "@/components/blog/ScrollReveal";

type BrandStatementProps = {
  text: string;
  premiumOutdoorBranding?: boolean;
};

export default function BrandStatement({
  text,
  premiumOutdoorBranding = false,
}: BrandStatementProps) {
  return (
    <section
      className={
        premiumOutdoorBranding
          ? "border-y border-[color-mix(in_srgb,var(--brand-warm-sand)_10%,transparent)] bg-brand-forest-black py-20 md:py-28 lg:py-32"
          : "border-y border-white/[0.06] bg-dark-base py-20 md:py-28 lg:py-32"
      }
    >
      <ScrollReveal>
        <p
          className={
            premiumOutdoorBranding
              ? "font-body mx-auto max-w-4xl px-6 text-center font-light leading-[1.15] tracking-tight text-brand-warm-sand text-[clamp(1.65rem,4.2vw,2.85rem)] md:leading-tight"
              : "mx-auto max-w-4xl px-6 text-center font-light leading-[1.15] tracking-tight text-text-primary text-[clamp(1.65rem,4.2vw,2.85rem)] md:leading-tight"
          }
        >
          {text}
        </p>
      </ScrollReveal>
    </section>
  );
}
