"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import HeroCompassCursor, { type CompassCardinalLabels } from "@/components/home/HeroCompassCursor";
import type { Locale } from "@/lib/i18n/config";

export type HomeBrandHeroProps = {
  locale: Locale;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  cardinalLabels: CompassCardinalLabels;
  compassAriaLabel: string;
};

const easeOut = [0.22, 1, 0.36, 1] as const;

const primaryCtaClass =
  "group inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#2E4A36]/15 bg-[#2E4A36] px-7 py-3 text-center font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#F4EBDD] shadow-[0_10px_36px_-14px_rgba(46,74,54,0.4)] transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#6E1F28] hover:shadow-[0_14px_40px_-12px_rgba(110,31,40,0.38)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9622B]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4EBDD] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:px-9 sm:text-[11px]";

const secondaryCtaClass =
  "group inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-[#2E4A36]/90 bg-transparent px-7 py-3 text-center font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2E4A36] transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#2E4A36] hover:text-[#F4EBDD] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9622B]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4EBDD] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:px-9 sm:text-[11px]";

export default function HomeBrandHero({
  locale,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  cardinalLabels,
  compassAriaLabel,
}: HomeBrandHeroProps) {
  const reduceMotion = useReducedMotion();
  const off = reduceMotion ?? false;
  const tEnter = { duration: off ? 0 : 0.7, ease: easeOut };
  const tCompass = { duration: off ? 0 : 0.85, ease: easeOut, delay: off ? 0 : 0.18 };

  const titleWords = title.trim().split(/\s+/).filter(Boolean);

  const wordPopClass =
    "relative z-0 inline-block origin-[center_85%] cursor-default rounded-sm px-[0.06em] py-0.5 transition-[transform,color,filter] duration-200 ease-[cubic-bezier(0.34,1.45,0.64,1)] will-change-transform hover:z-10 hover:-translate-y-2 hover:scale-[1.12] hover:text-[#1a2e22] hover:drop-shadow-[0_10px_20px_rgba(46,74,54,0.22)] motion-reduce:transition-none motion-reduce:hover:z-0 motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 motion-reduce:hover:drop-shadow-none";

  return (
    <section
      className="relative isolate min-h-[min(100dvh,44rem)] w-full overflow-hidden bg-[#F4EBDD]"
      aria-label="Hero"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,rgba(255,255,255,0.55),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(201,98,43,0.07),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(110,31,40,0.05),transparent_42%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute bottom-[12%] left-1/2 h-[min(42vw,14rem)] w-[min(92vw,26rem)] -translate-x-1/2 rounded-t-full bg-gradient-to-t from-[#C9622B]/[0.07] via-[#D9A441]/[0.04] to-transparent sm:bottom-[14%] md:h-[min(36vw,15rem)] md:w-[min(80vw,28rem)]"
        aria-hidden
      />

      <motion.div
        className="relative z-[1] mx-auto flex max-w-3xl flex-col items-center px-5 pb-16 pt-[calc(env(safe-area-inset-top,0px)+5.75rem)] text-center sm:px-8 sm:pb-20 sm:pt-[calc(env(safe-area-inset-top,0px)+6.25rem)] md:max-w-4xl md:pb-24 lg:max-w-5xl"
        initial={off ? undefined : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={tEnter}
      >
        <h1 className="hero-display flex max-w-[22ch] flex-wrap justify-center gap-x-[0.22em] gap-y-1 text-balance text-[clamp(2rem,5.5vw,3.75rem)] font-semibold leading-[1.12] tracking-tight text-[#2E4A36] sm:max-w-none md:text-[clamp(2.35rem,4.8vw,4rem)] md:leading-[1.1]">
          {titleWords.map((word, i) => (
            <span key={`${i}-${word}`} className={wordPopClass}>
              {word}
            </span>
          ))}
        </h1>

        <p className="mt-5 max-w-xl text-pretty font-sans text-[0.95rem] leading-relaxed text-[#D9A441] sm:mt-6 sm:max-w-2xl sm:text-lg md:text-[1.05rem]">
          {subtitle}
        </p>

        <motion.div
          className="relative mt-10 flex justify-center sm:mt-12 md:mt-14"
          initial={off ? undefined : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={tCompass}
        >
          <HeroCompassCursor
            variant="brand"
            ariaLabel={compassAriaLabel}
            cardinalLabels={cardinalLabels}
          />
        </motion.div>

        <motion.div
          className="mt-10 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:mt-12 sm:max-w-lg sm:flex-row sm:gap-4 md:mt-14"
          initial={off ? undefined : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...tEnter, delay: off ? 0 : 0.28 }}
        >
          <Link href={`/${locale}/products`} className={primaryCtaClass}>
            {ctaPrimary}
          </Link>
          <Link href={`/${locale}/blog`} className={secondaryCtaClass}>
            {ctaSecondary}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
