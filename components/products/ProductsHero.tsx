"use client";

import type { Locale } from "@/lib/i18n/config";
import { GN_HERO_TOP_PAD } from "@/lib/ui/gonatural-design";
import { useTranslations } from "@/components/i18n/LocaleProvider";
import ProductsHeroCategoryCarousel from "@/components/products/ProductsHeroCategoryCarousel";
import {
  DEFAULT_PRODUCTS_HERO_CAROUSEL_LAYOUT,
  productsHeroBackgroundStyle,
  productsHeroCarouselBlockStyle,
  productsHeroUsesViewportMinHeight,
} from "@/lib/products-hero-carousel-layout";

export type ProductsHeroProps = {
  locale: Locale;
  searchHint?: string | null;
};

export default function ProductsHero({ locale, searchHint }: ProductsHeroProps) {
  const t = useTranslations();
  const layout = DEFAULT_PRODUCTS_HERO_CAROUSEL_LAYOUT;
  const heroViewportMin = productsHeroUsesViewportMinHeight(layout);
  const heroBackgroundStyle = productsHeroBackgroundStyle(layout);

  return (
    <section
      className={`relative isolate flex flex-col overflow-x-visible border-b border-[rgba(46,74,54,0.08)] bg-[#FFFFFF]${
        heroViewportMin ? " min-h-[100svh]" : ""
      }`}
      style={heroBackgroundStyle}
      aria-label={t("productsPage.catalogTitle")}
    >
      <div
        className={`relative z-[1] mx-auto flex w-full min-w-0 flex-col ${GN_HERO_TOP_PAD}${
          heroViewportMin ? " min-h-[100svh]" : ""
        }`}
        style={heroBackgroundStyle}
      >
        {searchHint ? (
          <p className="mx-auto mb-4 max-w-lg px-[18px] text-center font-inter text-xs leading-relaxed text-[rgba(46,74,54,0.72)] md:px-[28px] md:text-sm lg:px-[48px]">
            {searchHint}
          </p>
        ) : null}

        <div className="flex min-h-0 flex-1 flex-col justify-center overflow-visible pb-4 md:pb-6">
          <div
            className="gn-products-hero-carousel-block"
            style={productsHeroCarouselBlockStyle(layout)}
          >
            <ProductsHeroCategoryCarousel locale={locale} layout={layout} />
          </div>
        </div>
      </div>
    </section>
  );
}
