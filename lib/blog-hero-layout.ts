import type { CSSProperties } from "react";

export type BlogHeroLayoutElement = {
  x: number;
  y: number;
  scale: number;
  zIndex: number;
};

export type BlogHeroLayout = {
  copyBlock: BlogHeroLayoutElement;
  coverImage: BlogHeroLayoutElement;
};

export const DEFAULT_BLOG_HERO_LAYOUT: BlogHeroLayout = {
  copyBlock: {
    x: 479,
    y: -76,
    scale: 105,
    zIndex: 1,
  },
  coverImage: {
    x: 1,
    y: -594,
    scale: 126,
    zIndex: 0,
  },
};

/** Margen superior negativo (lg) para alinear bento bajo la imagen del hero editorial. */
export const BLOG_HERO_BENTO_OVERLAP_LG_PX = Math.round(
  Math.abs(DEFAULT_BLOG_HERO_LAYOUT.coverImage.y) -
    ((DEFAULT_BLOG_HERO_LAYOUT.coverImage.scale - 100) / 100) * (720 / 2)
);

export function blogHeroElementStyle(
  element: BlogHeroLayoutElement
): CSSProperties {
  const transforms: string[] = [];
  if (element.x !== 0 || element.y !== 0) {
    transforms.push(`translate(${element.x}px, ${element.y}px)`);
  }
  if (element.scale !== 100) {
    transforms.push(`scale(${element.scale / 100})`);
  }

  return {
    position: "relative",
    zIndex: element.zIndex,
    transform: transforms.length > 0 ? transforms.join(" ") : undefined,
    transformOrigin: "center center",
  };
}
