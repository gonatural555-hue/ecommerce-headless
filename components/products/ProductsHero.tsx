"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ProductsHeroProps = {
  title: string;
  subtitle: string;
  tagline: string;
  imageSrc: string;
  imageAlt: string;
  searchHint?: string | null;
};

/**
 * Hero editorial de altura media (no 100vh): alineado con Home/Blog (overlay, tipografía centrada).
 */
export default function ProductsHero({
  title,
  subtitle,
  tagline,
  imageSrc,
  imageAlt,
  searchHint,
}: ProductsHeroProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] bg-dark-base">
      <div className="absolute inset-0 min-h-[min(52vh,620px)]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-base/80 via-dark-base/50 to-dark-base/92" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(11,15,14,0.45)_100%)]" />
      </div>

      <div
        className={`relative z-10 mx-auto flex min-h-[min(48vh,560px)] max-w-4xl flex-col items-center justify-end px-6 pb-16 pt-28 text-center sm:px-10 md:pb-20 md:pt-32 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }         motion-reduce:opacity-100 motion-reduce:translate-y-0 transition-all duration-[900ms] ease-out`}
      >
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.38em] text-accent-gold/90 sm:text-xs">
          {tagline}
        </p>
        <h1 className="mt-5 font-semibold tracking-tight text-text-primary text-[clamp(1.85rem,4.5vw,2.85rem)] leading-tight">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-text-muted md:text-base">
          {subtitle}
        </p>
        {searchHint ? (
          <p className="mt-5 text-xs font-medium text-text-primary/90 md:text-sm">
            {searchHint}
          </p>
        ) : null}
      </div>
    </section>
  );
}
