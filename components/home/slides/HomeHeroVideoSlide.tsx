"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import PremiumImageOverlay from "@/components/ui/PremiumImageOverlay";
import {
  premiumPrimaryCtaClass,
  premiumSecondaryCtaClass,
} from "@/lib/ui/premium-cta-classes";
import type { Locale } from "@/lib/i18n/config";

export type HomeHeroVideoSlideProps = {
  locale: Locale;
  tagline: string;
  title: string;
  subtitle: string;
  ctaProducts: string;
  ctaJournal: string;
  imageSrc: string;
  imageAlt: string;
  videoSrc: string;
  videoSrcMobile: string;
  /** Pausa vídeo cuando el slide no está activo (ahorro CPU). */
  isActive: boolean;
  scroll: number;
  reduceMotion: boolean;
};

export default function HomeHeroVideoSlide({
  locale,
  tagline: _tagline,
  title,
  subtitle,
  ctaProducts,
  ctaJournal,
  imageSrc,
  imageAlt,
  videoSrc,
  videoSrcMobile,
  isActive,
  scroll,
  reduceMotion,
}: HomeHeroVideoSlideProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobileViewport(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const activeVideoSrc = isMobileViewport ? videoSrcMobile : videoSrc;

  useEffect(() => {
    const el = videoRef.current;
    if (!el || reduceMotion) return;
    if (isActive) {
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [isActive, reduceMotion, activeVideoSrc]);

  return (
    <>
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
            ref={videoRef}
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

      {/* Bloque único en flujo vertical: título → subtítulo → CTAs (sin solapes entre idiomas). */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto px-5 py-10 text-center sm:px-10 sm:py-12 md:py-14">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
          <img
            src="/assets/images/logo/logo-blanco.svg"
            alt="Go Natural"
            className="mb-5 h-14 w-auto max-w-[min(88vw,20rem)] shrink-0 opacity-[0.98] drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)] sm:mb-6 sm:h-[4.25rem] md:h-[5rem] lg:h-[5.5rem]"
            loading="eager"
            decoding="async"
          />
          <h1 className="font-display max-w-full shrink-0 font-bold leading-[1.08] tracking-tight text-white text-[clamp(1.85rem,5.2vw,3.35rem)] [text-shadow:0_2px_32px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.45)] sm:max-w-3xl md:text-[clamp(2.1rem,4.2vw,3.75rem)]">
            {title}
          </h1>
          <p className="mx-auto mt-6 max-w-xl shrink-0 text-sm font-semibold leading-relaxed tracking-[0.04em] text-accent-gold sm:mt-8 sm:max-w-2xl sm:text-base md:mt-10 md:text-[1.05rem] md:leading-relaxed">
            <span className="inline-block rounded-xl bg-black/35 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-white/10 backdrop-blur-[6px] sm:px-5 sm:py-3.5 [text-shadow:0_1px_3px_rgba(0,0,0,0.85),0_0_20px_rgba(0,0,0,0.45)]">
              {subtitle}
            </span>
          </p>
          <div className="pointer-events-auto mt-8 flex w-full max-w-md shrink-0 flex-col items-stretch gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4 md:mt-12">
            <Link href={`/${locale}/products`} className={premiumPrimaryCtaClass}>
              {ctaProducts}
            </Link>
            <Link href={`/${locale}/blog`} className={premiumSecondaryCtaClass}>
              {ctaJournal}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
