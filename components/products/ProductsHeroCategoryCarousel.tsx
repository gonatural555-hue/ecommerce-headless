"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import type { Locale } from "@/lib/i18n/config";
import { useTranslations } from "@/components/i18n/LocaleProvider";
import {
  GN_HERO_CTA_CLASS,
  GN_HERO_CTA_FOREST,
  gnHeroCtaStyle,
} from "@/lib/ui/gn-hero-cta";
import {
  PRODUCTS_HERO_CATEGORY_CARDS,
  type ProductsHeroCategoryCard,
} from "@/lib/products-hero-categories";
import type { ProductsHeroCarouselLayout } from "@/lib/products-hero-carousel-layout";

const CARD_CTA_STYLE = gnHeroCtaStyle(GN_HERO_CTA_FOREST);
const CARD_COUNT = PRODUCTS_HERO_CATEGORY_CARDS.length;
const LOOP_SETS = 3;

type LoopedCard = ProductsHeroCategoryCard & { loopKey: string };

const LOOPED_CARDS: LoopedCard[] = Array.from({ length: LOOP_SETS }, (_, setIndex) =>
  PRODUCTS_HERO_CATEGORY_CARDS.map((card) => ({
    ...card,
    loopKey: `${setIndex}-${card.id}`,
  }))
).flat();

type Props = {
  locale: Locale;
  layout: ProductsHeroCarouselLayout;
};

function CarouselArrow({
  direction,
  label,
  onClick,
}: {
  direction: "prev" | "next";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`gn-products-hero-carousel__arrow gn-products-hero-carousel__arrow--${direction} gn-products-hero-carousel__arrow--overlay`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        className="gn-products-hero-carousel__arrow-icon"
        aria-hidden
      >
        {direction === "prev" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 18 9 12l6-6" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
        )}
      </svg>
    </button>
  );
}

function CategoryCard({
  card,
  locale,
  slideIndex,
  priority,
}: {
  card: LoopedCard;
  locale: Locale;
  slideIndex: number;
  priority?: boolean;
}) {
  const t = useTranslations();
  const title = t(card.titleKey);
  const description = t(card.descriptionKey);
  const cta = t(card.ctaKey);
  const href = `/${locale}/category/${card.slug}`;

  return (
    <article
      className="gn-products-hero-carousel__card group"
      aria-roledescription="slide"
      aria-label={`${(slideIndex % CARD_COUNT) + 1} / ${CARD_COUNT}`}
    >
      <Image
        src={card.image}
        alt=""
        fill
        sizes="(max-width: 768px) 88vw, 400px"
        className="gn-products-hero-carousel__image"
        priority={priority}
      />
      <div className="gn-products-hero-carousel__overlay" aria-hidden />
      <div className="gn-products-hero-carousel__content">
        <h2 className="gn-products-hero-carousel__title">{title}</h2>
        <p className="gn-products-hero-carousel__description">{description}</p>
        <Link href={href} className={GN_HERO_CTA_CLASS} style={CARD_CTA_STYLE}>
          {cta}
        </Link>
      </div>
    </article>
  );
}

export default function ProductsHeroCategoryCarousel({ locale, layout }: Props) {
  const t = useTranslations();
  const trackRef = useRef<HTMLDivElement>(null);
  const isResettingRef = useRef(false);
  const scrollRafRef = useRef<number | null>(null);

  const getStep = useCallback(() => {
    const el = trackRef.current;
    if (!el) return 0;
    const card = el.querySelector<HTMLElement>(".gn-products-hero-carousel__card");
    return card ? card.offsetWidth + layout.cardGapPx : 0;
  }, [layout.cardGapPx]);

  const getSetWidth = useCallback(() => getStep() * CARD_COUNT, [getStep]);

  const jumpToMiddleSet = useCallback(() => {
    const el = trackRef.current;
    const setWidth = getSetWidth();
    if (!el || setWidth <= 0) return;

    isResettingRef.current = true;
    el.scrollLeft = setWidth;
    requestAnimationFrame(() => {
      isResettingRef.current = false;
    });
  }, [getSetWidth]);

  const normalizeInfiniteScroll = useCallback(() => {
    const el = trackRef.current;
    const setWidth = getSetWidth();
    if (!el || setWidth <= 0 || isResettingRef.current) return;

    const { scrollLeft } = el;
    if (scrollLeft <= setWidth * 0.15) {
      isResettingRef.current = true;
      el.scrollLeft = scrollLeft + setWidth;
      requestAnimationFrame(() => {
        isResettingRef.current = false;
      });
      return;
    }

    if (scrollLeft >= setWidth * 1.85) {
      isResettingRef.current = true;
      el.scrollLeft = scrollLeft - setWidth;
      requestAnimationFrame(() => {
        isResettingRef.current = false;
      });
    }
  }, [getSetWidth]);

  useEffect(() => {
    jumpToMiddleSet();
    const onResize = () => jumpToMiddleSet();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [jumpToMiddleSet, layout.cardWidthPx, layout.cardHeightPx, layout.cardGapPx]);

  const handleTrackScroll = useCallback(() => {
    if (scrollRafRef.current != null) return;
    scrollRafRef.current = window.requestAnimationFrame(() => {
      scrollRafRef.current = null;
      normalizeInfiniteScroll();
    });
  }, [normalizeInfiniteScroll]);

  useEffect(() => {
    return () => {
      if (scrollRafRef.current != null) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  const scrollByCard = useCallback(
    (direction: "prev" | "next") => {
      const el = trackRef.current;
      if (!el) return;
      const step = getStep();
      if (step <= 0) return;

      el.scrollBy({
        left: direction === "next" ? step : -step,
        behavior: "smooth",
      });
      window.setTimeout(normalizeInfiniteScroll, 480);
    },
    [getStep, normalizeInfiniteScroll]
  );

  return (
    <div className="gn-products-hero-carousel-bleed" aria-roledescription="carousel">
      <CarouselArrow
        direction="prev"
        label={t("productsPage.heroCategoryCarouselPrevAria")}
        onClick={() => scrollByCard("prev")}
      />
      <div
        ref={trackRef}
        className="gn-products-hero-carousel__track"
        onScroll={handleTrackScroll}
      >
        {LOOPED_CARDS.map((card, index) => (
          <CategoryCard
            key={card.loopKey}
            card={card}
            locale={locale}
            slideIndex={index}
            priority={index >= CARD_COUNT && index < CARD_COUNT * 2 && index === CARD_COUNT}
          />
        ))}
      </div>
      <CarouselArrow
        direction="next"
        label={t("productsPage.heroCategoryCarouselNextAria")}
        onClick={() => scrollByCard("next")}
      />
    </div>
  );
}
