"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import GoodProductsBrandName from "@/components/good-ideas/GoodProductsBrandName";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { GN_EASE_PREMIUM } from "@/lib/ui/gonatural-design";
import BrandHeroContent from "@/components/gateway/BrandHeroContent";

const PANEL_EASE = GN_EASE_PREMIUM;

export type GoodIdeasEditorialColumnProps = {
  title: string;
  tagline: string;
  cta: string;
  href: string;
  isActive: boolean;
};

export default function GoodIdeasEditorialColumn({
  title: _title,
  tagline,
  cta,
  href,
  isActive,
}: GoodIdeasEditorialColumnProps) {
  const locale = useLocale();
  return (
    <BrandHeroContent isActive={isActive}>
      <p className="w-full font-inter text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgba(232,236,241,0.5)]">
        Lifestyle & Tech
      </p>

      <h2 className="mx-auto max-w-[14ch] font-display text-[clamp(2.25rem,5vw,3.75rem)] font-normal leading-[0.95] tracking-[-0.02em]">
        <GoodProductsBrandName locale={locale} />
      </h2>

      <p className="max-w-md font-inter text-[15px] leading-relaxed text-[rgba(232,236,241,0.72)] md:text-[16px]">
        {tagline}
      </p>

      <motion.div
        className="flex w-full justify-center"
        initial={false}
        animate={{ opacity: isActive ? 1 : 0.82 }}
        transition={{ duration: 0.6, ease: PANEL_EASE }}
      >
        <Link
          href={href}
          className="group inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#E8ECF1] px-8 font-inter text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0B0F14] shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-[transform,box-shadow,background-color] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50 focus-visible:ring-offset-[#0B0F14] motion-reduce:transition-none"
        >
          <span className="flex items-center gap-2">
            {cta}
            <span
              className="inline-block transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5"
              aria-hidden
            >
              →
            </span>
          </span>
        </Link>
      </motion.div>
    </BrandHeroContent>
  );
}
