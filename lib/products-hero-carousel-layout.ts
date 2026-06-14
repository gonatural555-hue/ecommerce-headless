import type { CSSProperties } from "react";

export type ProductsHeroCarouselLayout = {
  blockWidthPct: number;
  blockMaxWidthPct: number;
  blockMaxWidthPx: number;
  blockHeightPx: number;
  blockMarginTopPx: number;
  blockMarginBottomPx: number;
  blockTranslateXPx: number;
  blockTranslateYPx: number;
  cardWidthPx: number;
  cardHeightPx: number;
  cardGapPx: number;
  /** 0 = min-height 100svh; >0 = alto fijo del fondo cream del hero */
  heroBackgroundMinHeightPx: number;
};

export const DEFAULT_PRODUCTS_HERO_CAROUSEL_LAYOUT: ProductsHeroCarouselLayout = {
  blockWidthPct: 100,
  blockMaxWidthPct: 100,
  blockMaxWidthPx: 1879,
  blockHeightPx: 900,
  blockMarginTopPx: -37,
  blockMarginBottomPx: -409,
  blockTranslateXPx: 0,
  blockTranslateYPx: 0,
  cardWidthPx: 384,
  cardHeightPx: 481,
  cardGapPx: 12,
  heroBackgroundMinHeightPx: 104,
};

export function productsHeroCarouselBlockStyle(
  layout: ProductsHeroCarouselLayout
): CSSProperties {
  const transforms: string[] = [];
  if (layout.blockTranslateXPx !== 0 || layout.blockTranslateYPx !== 0) {
    transforms.push(
      `translate(${layout.blockTranslateXPx}px, ${layout.blockTranslateYPx}px)`
    );
  }

  return {
    width: "100%",
    maxWidth: layout.blockMaxWidthPx,
    marginInline: "auto",
    marginTop: layout.blockMarginTopPx,
    marginBottom: layout.blockMarginBottomPx,
    minHeight: layout.blockHeightPx > 0 ? layout.blockHeightPx : undefined,
    transform: transforms.length > 0 ? transforms.join(" ") : undefined,
    "--gn-phc-card-width": `${layout.cardWidthPx}px`,
    "--gn-phc-card-height": `${layout.cardHeightPx}px`,
    "--gn-phc-card-gap": `${layout.cardGapPx}px`,
  } as CSSProperties;
}

export function productsHeroBackgroundStyle(
  layout: ProductsHeroCarouselLayout
): CSSProperties | undefined {
  if (layout.heroBackgroundMinHeightPx <= 0) return undefined;
  return { minHeight: layout.heroBackgroundMinHeightPx };
}

export function productsHeroUsesViewportMinHeight(
  layout: ProductsHeroCarouselLayout
): boolean {
  return layout.heroBackgroundMinHeightPx <= 0;
}
