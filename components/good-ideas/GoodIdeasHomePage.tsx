import GoodIdeasHomeHero from "@/components/good-ideas/GoodIdeasHomeHero";
import type { Locale } from "@/lib/i18n/config";

export default function GoodIdeasHomePage({
  locale,
  title,
  subtitle,
  eyebrow,
  cta,
  comingSoon,
  sectionAriaLabel,
}: {
  locale: Locale;
  title: string;
  subtitle: string;
  eyebrow: string;
  cta: string;
  comingSoon: string;
  sectionAriaLabel: string;
}) {
  return (
    <main className="bg-[#0B0F14] text-[#E8ECF1]">
      <GoodIdeasHomeHero
        locale={locale}
        title={title}
        subtitle={subtitle}
        eyebrow={eyebrow}
        ctaLabel={cta}
        sectionAriaLabel={sectionAriaLabel}
      />
      <section
        id="coming-soon"
        className="scroll-mt-24 border-t border-white/[0.08] px-6 py-16 sm:px-10 md:py-20"
      >
        <p className="mx-auto max-w-xl text-center font-inter text-[16px] leading-relaxed text-[rgba(232,236,241,0.72)] md:text-[17px]">
          {comingSoon}
        </p>
      </section>
    </main>
  );
}
