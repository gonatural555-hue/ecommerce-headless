"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/config";

type HomeHeroProps = {
  locale: Locale;
  tagline: string;
  title: string;
  subtitle: string;
  ctaProducts: string;
  ctaJournal: string;
  imageSrc?: string;
  imageAlt?: string;
};

/**
 * Fullscreen cinematic hero — same language as Blog (overlay, gold accent, soft scroll fade).
 */
export default function HomeHero({
  locale,
  tagline,
  title,
  subtitle,
  ctaProducts,
  ctaJournal,
  imageSrc = "/assets/images/hero/hero.webp",
  imageAlt = "",
}: HomeHeroProps) {
  const [scroll, setScroll] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onScroll = () => setScroll(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fade = reduceMotion ? 1 : Math.max(0.35, 1 - scroll / 520);
  const lift = reduceMotion ? 0 : scroll * 0.12;

  return (
    <section className="relative h-[100dvh] min-h-[28rem] w-full overflow-hidden bg-dark-base">
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          style={
            reduceMotion
              ? undefined
              : {
                  transform: `scale(1.06) translateY(${scroll * 0.1}px)`,
                }
          }
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-base/78 via-dark-base/48 to-dark-base/93" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(11,15,14,0.5)_100%)]" />
      </div>

      <div
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 pb-16 text-center sm:px-10"
        style={{
          opacity: fade,
          transform: reduceMotion ? undefined : `translateY(${lift}px)`,
        }}
      >
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.35em] text-accent-gold/90 sm:text-xs">
          {tagline}
        </p>
        <h1 className="mt-5 max-w-4xl font-semibold tracking-tight text-text-primary text-[clamp(2.35rem,6.5vw,4.25rem)] leading-[1.06]">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
          {subtitle}
        </p>

        <div className="mt-10 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center justify-center border border-accent-gold/45 bg-transparent px-8 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.22em] text-accent-gold transition duration-300 hover:border-accent-gold hover:bg-accent-gold/10"
          >
            {ctaProducts}
          </Link>
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center justify-center border border-white/15 bg-white/[0.04] px-8 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-text-primary transition duration-300 hover:border-white/25 hover:bg-white/[0.07]"
          >
            {ctaJournal}
          </Link>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 motion-reduce:hidden"
        style={{ opacity: fade }}
        aria-hidden
      >
        <div className="flex h-11 w-6 justify-center rounded-full border border-white/18">
          <div className="mt-2 h-1.5 w-px animate-pulse rounded-full bg-white/45" />
        </div>
      </div>
    </section>
  );
}
