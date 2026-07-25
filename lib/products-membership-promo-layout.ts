import type { CSSProperties } from "react";

export type MembershipPromoLayout = {
  containerMaxWidthPx: number;
  containerWidthPct: number;
  marginTopPx: number;
  marginBottomPx: number;
  translateXPx: number;
  translateYPx: number;
  imageMaxWidthPx: number;
  imageMaxHeightPx: number;
  imageScalePct: number;
  imageTranslateXPx: number;
  imageTranslateYPx: number;
};

export const GN_MEMBERSHIP_PROMO_LAYOUT_STORAGE_KEY =
  "gn-products-membership-promo-layout-v5";

export const DEFAULT_MEMBERSHIP_PROMO_LAYOUT: MembershipPromoLayout = {
  containerMaxWidthPx: 1400,
  containerWidthPct: 83,
  marginTopPx: 2,
  marginBottomPx: 0,
  translateXPx: 0,
  translateYPx: 17,
  imageMaxWidthPx: 528,
  imageMaxHeightPx: 667,
  imageScalePct: 141,
  imageTranslateXPx: 32,
  imageTranslateYPx: 25,
};

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(n)));
}

export function parseMembershipPromoLayout(raw: unknown): MembershipPromoLayout {
  const base = { ...DEFAULT_MEMBERSHIP_PROMO_LAYOUT };
  if (!raw || typeof raw !== "object") return base;
  const o = raw as Record<string, unknown>;
  const num = (key: keyof MembershipPromoLayout, min: number, max: number) => {
    const v = o[key];
    return typeof v === "number" && Number.isFinite(v)
      ? clamp(v, min, max)
      : base[key];
  };
  return {
    containerMaxWidthPx: num("containerMaxWidthPx", 640, 1600),
    containerWidthPct: num("containerWidthPct", 50, 100),
    marginTopPx: num("marginTopPx", -400, 400),
    marginBottomPx: num("marginBottomPx", -400, 400),
    translateXPx: num("translateXPx", -400, 400),
    translateYPx: num("translateYPx", -400, 400),
    imageMaxWidthPx: num("imageMaxWidthPx", 120, 720),
    imageMaxHeightPx: num("imageMaxHeightPx", 160, 800),
    imageScalePct: num("imageScalePct", 25, 200),
    imageTranslateXPx: num("imageTranslateXPx", -400, 400),
    imageTranslateYPx: num("imageTranslateYPx", -400, 400),
  };
}

export function loadMembershipPromoLayout(): MembershipPromoLayout {
  if (typeof window === "undefined") {
    return { ...DEFAULT_MEMBERSHIP_PROMO_LAYOUT };
  }
  try {
    const raw = localStorage.getItem(GN_MEMBERSHIP_PROMO_LAYOUT_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_MEMBERSHIP_PROMO_LAYOUT };
    return parseMembershipPromoLayout(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_MEMBERSHIP_PROMO_LAYOUT };
  }
}

export function saveMembershipPromoLayout(layout: MembershipPromoLayout): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      GN_MEMBERSHIP_PROMO_LAYOUT_STORAGE_KEY,
      JSON.stringify(layout)
    );
  } catch {
    /* ignore */
  }
}

export function resolveMembershipPromoLayout(
  directorMode: boolean
): MembershipPromoLayout {
  if (directorMode) {
    return loadMembershipPromoLayout();
  }
  return { ...DEFAULT_MEMBERSHIP_PROMO_LAYOUT };
}

export function isProductsDirectorMode(
  searchParams: URLSearchParams | null
): boolean {
  return searchParams?.get("director") === "true";
}

export function membershipPromoImageStyle(
  layout: MembershipPromoLayout
): CSSProperties {
  const scale = layout.imageScalePct / 100;

  return {
    maxWidth: layout.imageMaxWidthPx,
    maxHeight: layout.imageMaxHeightPx,
    width: "auto",
    height: "auto",
    transformOrigin: "center center",
    ["--gn-promo-tx" as string]: `${layout.imageTranslateXPx}px`,
    ["--gn-promo-ty" as string]: `${layout.imageTranslateYPx}px`,
    ["--gn-promo-scale" as string]: String(scale),
  } as CSSProperties;
}

export function membershipPromoBlockStyle(
  layout: MembershipPromoLayout
): CSSProperties {
  const transforms: string[] = [];
  if (layout.translateXPx !== 0 || layout.translateYPx !== 0) {
    transforms.push(
      `translate(${layout.translateXPx}px, ${layout.translateYPx}px)`
    );
  }

  return {
    width: `${layout.containerWidthPct}%`,
    maxWidth: layout.containerMaxWidthPx,
    marginTop: layout.marginTopPx,
    marginBottom: layout.marginBottomPx,
    marginInline: "auto",
    transform: transforms.length > 0 ? transforms.join(" ") : undefined,
  };
}
