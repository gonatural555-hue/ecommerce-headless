"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import PremiumImageOverlay from "@/components/ui/PremiumImageOverlay";

type BlogHeroProps = {
  title: string;
  subtitle: string;
  tagline: string;
  imageSrc: string;
  imageAlt?: string;
};

/**
 * Full-viewport cinematic hero: image + overlay, typography fades subtly on scroll.
 */
export default function BlogHero({
  title,
  subtitle,
  tagline,
  imageSrc,
  imageAlt = "",
}: BlogHeroProps) {
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
  const lift = reduceMotion ? 0 : scroll * 0.15;

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
                  transform: `scale(1.06) translateY(${scroll * 0.12}px)`,
                }
          }
        />
        <PremiumImageOverlay />
      </div>

      <div
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center sm:px-10"
        style={{
          opacity: fade,
          transform: reduceMotion ? undefined : `translateY(${lift}px)`,
        }}
      >
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.35em] text-accent-gold/90 sm:text-xs">
          {tagline}
        </p>
        <h1 className="mt-6 max-w-4xl font-semibold tracking-tight text-text-primary text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05]">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
          {subtitle}
        </p>
      </div>

      <div
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 motion-reduce:hidden"
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
