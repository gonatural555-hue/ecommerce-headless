"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import HeroCompassCursor, { type CompassCardinalLabels } from "@/components/home/HeroCompassCursor";
import type { Locale } from "@/lib/i18n/config";
import { GN_EASE_PREMIUM } from "@/lib/ui/gonatural-design";

export type HomeBrandHeroProps = {
  locale: Locale;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  scrollHint: string;
  cardinalLabels: CompassCardinalLabels;
  compassAriaLabel: string;
};

const easeOut = GN_EASE_PREMIUM;

const primaryCtaClass =
  "group inline-flex h-[56px] min-h-[56px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#1F3527_0%,#2E4A36_50%,#3E654B_100%)] px-9 text-center font-sans text-[13px] font-bold uppercase tracking-[0.18em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),var(--gn-shadow-default)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),var(--gn-shadow-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gn-mustard/40 focus-visible:ring-offset-2 focus-visible:ring-offset-gn-cream motion-reduce:transition-none motion-reduce:hover:translate-y-0";

const secondaryCtaClass =
  "group inline-flex h-[56px] min-h-[56px] items-center justify-center rounded-full border-[1.5px] border-gn-forest/35 bg-transparent px-9 text-center font-sans text-[13px] font-bold uppercase tracking-[0.18em] text-gn-forest shadow-none transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-gn-forest/55 hover:bg-gn-cream/90 hover:shadow-[var(--gn-shadow-default)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gn-burnt/35 focus-visible:ring-offset-2 focus-visible:ring-offset-gn-cream motion-reduce:transition-none motion-reduce:hover:translate-y-0";

export default function HomeBrandHero({
  locale,
  eyebrow,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  scrollHint,
  cardinalLabels,
  compassAriaLabel,
}: HomeBrandHeroProps) {
  const reduceMotion = useReducedMotion();
  const off = reduceMotion ?? false;

  const titleLines = title.includes("\n")
    ? title.split("\n").map((l) => l.trim()).filter(Boolean)
    : [title.trim()].filter(Boolean);

  const containerVariants = {
    hidden: off ? { opacity: 1 } : { opacity: 0 },
    show: {
      opacity: 1,
      transition: off
        ? { duration: 0 }
        : { staggerChildren: 0.11, delayChildren: 0.06, ease: easeOut },
    },
  };

  const itemVariants = {
    hidden: off ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.72, ease: easeOut },
    },
  };

  return (
    <section
      className="relative isolate flex min-h-[100dvh] min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-gn-cream px-8 py-[calc(env(safe-area-inset-top,0px)+var(--gn-space-xxl))] lg:px-12 lg:py-gn-xxl"
      aria-label="Hero"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,rgba(255,255,255,0.45),transparent_55%)]"
        aria-hidden
      />

      <motion.div
        className="relative z-[1] mx-auto flex w-full max-w-gn-content flex-col items-center px-0 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.p
          variants={itemVariants}
          className="mb-gn-m font-sans text-[clamp(11px,1.15vw,13.5px)] font-semibold uppercase tracking-[0.35em] text-gn-burnt"
        >
          {eyebrow}
        </motion.p>

        <motion.h1 variants={itemVariants} className="gn-hero-title text-center">
          {titleLines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </motion.h1>

        <motion.p variants={itemVariants} className="gn-hero-subtitle mx-auto mt-gn-l text-center">
          {subtitle}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-gn-l flex w-full max-w-md flex-col items-stretch justify-center gap-gn-m sm:max-w-none sm:flex-row md:mt-[calc(var(--gn-space-l)+var(--gn-space-xs))]"
        >
          <Link href={`/${locale}/products`} className={primaryCtaClass}>
            {ctaPrimary}
          </Link>
          <Link href={`/${locale}/blog`} className={secondaryCtaClass}>
            {ctaSecondary}
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-[calc(var(--gn-space-xl)+var(--gn-space-s))] md:mt-gn-xxl">
          <HeroCompassCursor
            variant="brand"
            ariaLabel={compassAriaLabel}
            cardinalLabels={cardinalLabels}
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-gn-m flex flex-col items-center gap-gn-s md:mt-gn-l"
        >
          <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.22em] text-gn-forest">
            {scrollHint}
          </p>
          {!off ? (
            <motion.div
              className="flex flex-col items-center gap-gn-xs"
              animate={{ y: [0, 7, 0] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: [0.45, 0, 0.55, 1],
              }}
              aria-hidden
            >
              <span className="block h-8 w-5 rounded-full border border-gn-forest/35 bg-gn-cream/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.65)]" />
              <span className="block h-1.5 w-1 rounded-full bg-gn-forest/45" />
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-gn-xs" aria-hidden>
              <span className="block h-8 w-5 rounded-full border border-gn-forest/35 bg-gn-cream/60" />
              <span className="block h-1.5 w-1 rounded-full bg-gn-forest/45" />
            </div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
