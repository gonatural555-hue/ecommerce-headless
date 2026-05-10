"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import PremiumImageOverlay from "@/components/ui/PremiumImageOverlay";
import {
  premiumPrimaryCtaClass,
  premiumSecondaryCtaClass,
} from "@/lib/ui/premium-cta-classes";

type HomeHeroProps = {
  locale: Locale;
  tagline: string;
  title: string;
  subtitle: string;
  ctaProducts: string;
  ctaJournal: string;
  /** Poster / fallback estático (LCP y prefers-reduced-motion) */
  imageSrc?: string;
  imageAlt?: string;
  /** Vídeo en loop en desktop (desde 768px, breakpoint `md`) */
  videoSrc?: string;
  /** Vídeo en loop en móvil (por debajo de 768px) */
  videoSrcMobile?: string;
};

/**
 * Hero con marco centrado: vídeo + overlay y copy viven en el mismo contenedor (no ancho completo).
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
  videoSrc = "/assets/images/hero/hero-home.mp4",
  videoSrcMobile = "/assets/images/hero/hero-home-mobile.mp4",
}: HomeHeroProps) {
  const [scroll, setScroll] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  /** Alineado con Tailwind `md` (768px): móvil si el ancho es menor */
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobileViewport(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onScroll = () => setScroll(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeVideoSrc = isMobileViewport ? videoSrcMobile : videoSrc;

  const fade = reduceMotion ? 1 : Math.max(0.35, 1 - scroll / 520);
  const lift = reduceMotion ? 0 : scroll * 0.12;

  return (
    <section className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-dark-base px-4 py-24 sm:px-6 sm:py-28 md:py-24">
      {/* Marco único: vídeo + overlay + titular y CTAs */}
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-2xl shadow-[0_24px_80px_-20px_rgba(0,0,0,0.55)] ring-1 ring-white/10 lg:max-w-6xl"
        style={{
          opacity: fade,
          transform: reduceMotion ? undefined : `translateY(${lift}px)`,
        }}
      >
        <div className="relative aspect-[4/5] min-h-[min(72vh,640px)] w-full sm:aspect-[16/10] sm:min-h-[min(68vh,560px)]">
          <div
            className="absolute inset-0 overflow-hidden"
            style={
              reduceMotion
                ? undefined
                : {
                    transform: `scale(1.06) translateY(${scroll * 0.1}px)`,
                  }
            }
          >
            {reduceMotion ? (
              <Image
                src={imageSrc}
                alt={imageAlt || ""}
                fill
                priority
                sizes="(max-width:1024px) 92vw, 72rem"
                className="object-cover object-center"
              />
            ) : (
              <video
                key={activeVideoSrc}
                className="absolute inset-0 h-full w-full object-cover object-center opacity-90 grayscale"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster={imageSrc}
                aria-hidden
              >
                <source src={activeVideoSrc} type="video/mp4" />
              </video>
            )}
          </div>
          <PremiumImageOverlay />

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-5 pb-8 pt-12 text-center sm:px-10 sm:pb-10 sm:pt-14">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-accent-gold drop-shadow-[0_1px_12px_rgba(0,0,0,0.55)] sm:text-xs">
              {tagline}
            </p>
            <h1 className="font-display mt-4 max-w-full font-bold leading-[1.06] tracking-tight text-white text-[clamp(1.85rem,5.2vw,3.35rem)] [text-shadow:0_2px_32px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.45)] sm:mt-5 sm:max-w-3xl md:text-[clamp(2.1rem,4.2vw,3.75rem)]">
              {title}
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/92 drop-shadow-[0_1px_14px_rgba(0,0,0,0.45)] sm:mt-5 sm:max-w-xl sm:text-base md:text-lg">
              {subtitle}
            </p>

            <div className="mt-8 flex w-full max-w-md flex-col items-stretch gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
              <Link href={`/${locale}/products`} className={premiumPrimaryCtaClass}>
                {ctaProducts}
              </Link>
              <Link href={`/${locale}/blog`} className={premiumSecondaryCtaClass}>
                {ctaJournal}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 motion-reduce:hidden"
        style={{ opacity: fade }}
        aria-hidden
      >
        <div className="flex h-11 w-6 justify-center rounded-full border border-white/35 shadow-[0_4px_16px_rgba(0,0,0,0.35)] backdrop-blur-[2px]">
          <div className="mt-2 h-1.5 w-px animate-pulse rounded-full bg-white/65" />
        </div>
      </div>
    </section>
  );
}
