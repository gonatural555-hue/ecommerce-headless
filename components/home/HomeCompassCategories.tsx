"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import HeroCompassCursor, {
  type CompassCardinalLabels,
} from "@/components/home/HeroCompassCursor";
import type { HeroCategoryCard } from "@/components/home/slides/HomeHeroCategorySlide";

const FALLBACK_IMG = "/assets/images/hero/hero.webp";

/** Mismo shell que las tarjetas del hero bento (`HeroBentoSection`). */
const BENTO_RADIUS = "rounded-[1.35rem] md:rounded-[1.75rem]";
const BENTO_CARD =
  `${BENTO_RADIUS} relative overflow-hidden border border-earth-brown/12 bg-white/95 shadow-[0_16px_48px_-28px_rgba(17,23,19,0.16)] ring-1 ring-black/[0.04] transition-all duration-500 ease-out motion-reduce:transition-none`;
const BENTO_HOVER =
  "hover:z-[1] hover:-translate-y-0.5 hover:border-accent-gold/28 hover:shadow-[0_22px_56px_-24px_rgba(17,23,19,0.22)] motion-reduce:hover:translate-y-0";

type Props = {
  locale: Locale;
  /** Cuatro categorías en orden: arriba-izq, arriba-der, abajo-izq, abajo-der */
  cards: HeroCategoryCard[];
  cardinalLabels: CompassCardinalLabels;
  compassAriaLabel: string;
};

function CornerCard({
  card,
  locale,
  gridClass,
}: {
  card: HeroCategoryCard;
  locale: Locale;
  gridClass: string;
}) {
  const [src, setSrc] = useState(card.image);

  return (
    <Link
      href={`/${locale}/category/${card.slug}`}
      className={`group ${BENTO_CARD} ${BENTO_HOVER} pointer-events-auto relative flex min-h-[189px] flex-col overflow-hidden sm:min-h-[216px] md:min-h-[227px] md:max-w-[378px] lg:min-h-[238px] lg:max-w-[405px] ${gridClass}`}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width:768px) 45vw, 324px"
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        onError={() => setSrc(FALLBACK_IMG)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-base via-dark-base/6 to-transparent" />
      <div className="relative z-[1] mt-auto p-3 sm:p-4">
        <p className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-accent-gold/95">
          {card.title}
        </p>
        <p className="mt-1 line-clamp-2 font-sans text-xs leading-snug text-white/88 sm:text-[13px]">
          {card.subtitle}
        </p>
      </div>
    </Link>
  );
}

export default function HomeCompassCategories({
  locale,
  cards,
  cardinalLabels,
  compassAriaLabel,
}: Props) {
  const ordered: HeroCategoryCard[] = cards.slice(0, 4);
  while (ordered.length < 4) {
    ordered.push({
      slug: "mountain-snow",
      title: "—",
      subtitle: "",
      image: FALLBACK_IMG,
    });
  }

  const [tl, tr, bl, br] = ordered as [
    HeroCategoryCard,
    HeroCategoryCard,
    HeroCategoryCard,
    HeroCategoryCard,
  ];

  return (
    <section className="relative bg-soft-stone/80 py-14 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:grid md:min-h-[min(72vh,837px)] md:grid-cols-3 md:grid-rows-3 md:items-stretch md:gap-7 lg:min-h-[756px] lg:gap-8">
          <div className="grid grid-cols-2 gap-4 md:contents">
            <CornerCard
              card={tl}
              locale={locale}
              gridClass="md:col-start-1 md:row-start-1 md:justify-self-start"
            />
            <CornerCard
              card={tr}
              locale={locale}
              gridClass="md:col-start-3 md:row-start-1 md:justify-self-end"
            />
          </div>

          <div className="flex justify-center py-2 md:col-start-2 md:row-start-2 md:items-center md:justify-center md:py-0">
            <HeroCompassCursor ariaLabel={compassAriaLabel} cardinalLabels={cardinalLabels} />
          </div>

          <div className="grid grid-cols-2 gap-4 md:contents">
            <CornerCard
              card={bl}
              locale={locale}
              gridClass="md:col-start-1 md:row-start-3 md:self-end md:justify-self-start"
            />
            <CornerCard
              card={br}
              locale={locale}
              gridClass="md:col-start-3 md:row-start-3 md:self-end md:justify-self-end"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
