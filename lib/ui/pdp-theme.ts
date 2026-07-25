import type { UISurface } from "@/lib/ui-surface";

export type PdpBrandTheme = "go-natural";

export function resolvePdpBrandTheme(): PdpBrandTheme {
  return "go-natural";
}

/** Class bundles for the PDP buy column — Good Products uses GI_COLORS, not GN gold/moss. */
export function getPdpBuyBoxTheme(
  brand: PdpBrandTheme,
  surface: UISurface
) {
  const L = surface === "light";

  return {
    brandLink: L
      ? "text-sm font-medium text-gn-forest underline-offset-2 hover:underline"
      : "text-sm font-medium text-accent-moss underline-offset-2 hover:underline",
    title: L
      ? "font-sans text-[1.55rem] font-semibold leading-[1.15] tracking-tight text-neutral-900 xl:text-[1.75rem]"
      : "font-sans text-[1.55rem] font-semibold leading-[1.15] tracking-tight text-text-primary xl:text-[1.75rem]",
    reviewsRating: L ? "text-neutral-300" : "text-white/25",
    reviewsScore: L ? "font-medium text-neutral-800" : "text-text-muted",
    reviewsDot: L ? "text-neutral-300" : "text-white/30",
    reviewsLink: L
      ? "text-neutral-600 underline-offset-2 hover:text-gn-forest hover:underline"
      : "text-text-muted underline-offset-2 hover:text-accent-gold hover:underline",
    price: L
      ? "text-2xl font-semibold tabular-nums tracking-tight text-neutral-900"
      : "text-2xl font-semibold tabular-nums tracking-tight text-text-primary",
    freeShipping: L
      ? "text-[10px] font-semibold uppercase tracking-[0.14em] text-gn-forest"
      : "text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-moss",
    taxNote: L ? "text-xs text-neutral-500" : "text-xs text-text-muted/80",
    currencyDisclaimer: L
      ? "text-[11px] leading-relaxed text-neutral-500"
      : "text-[11px] leading-relaxed text-text-muted/70",
    variantLabelHeading: L
      ? "text-sm font-semibold tracking-wide text-neutral-900"
      : "text-sm font-semibold tracking-wide text-text-primary",
    variantLabelMuted: L ? "text-sm text-neutral-600" : "text-sm text-text-muted",
    variantSelected: L
      ? "border-accent-gold/90 bg-white text-neutral-900 ring-1 ring-accent-gold shadow-[0_0_0_1px_rgba(212,175,55,0.25)]"
      : "border-accent-gold/85 bg-dark-surface text-text-primary ring-1 ring-accent-gold shadow-[0_0_0_1px_rgba(212,175,55,0.22)]",
    variantDefault: L
      ? "border-neutral-200 bg-neutral-50 text-neutral-900 hover:border-accent-gold/50 hover:shadow-[0_0_14px_rgba(200,155,60,0.08)]"
      : "border-white/12 bg-dark-surface/50 text-text-primary hover:border-accent-gold/40 hover:shadow-[0_0_14px_rgba(200,155,60,0.07)]",
    variantDisabled: L
      ? "opacity-40 cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-500"
      : "opacity-40 cursor-not-allowed border-white/10 bg-dark-surface/30 text-text-muted",
    variantFocusRing: L
      ? "focus-visible:ring-accent-gold focus-visible:ring-offset-white"
      : "focus-visible:ring-accent-gold focus-visible:ring-offset-dark-base",
    colorLabel: L
      ? "text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600"
      : "text-xs font-semibold uppercase tracking-[0.14em] text-text-muted",
    colorValue: L ? "text-sm text-neutral-800" : "text-sm text-text-primary",
    colorSwatchActive:
      "border-accent-gold shadow-[0_0_0_1px_rgba(212,175,55,0.35)]",
    colorSwatchIdle: L
      ? "border-neutral-300 hover:border-neutral-500"
      : "border-white/25 hover:border-white/45",
    colorSwatchFocus: L
      ? "focus-visible:ring-accent-gold focus-visible:ring-offset-white"
      : "focus-visible:ring-accent-gold focus-visible:ring-offset-dark-base",
    qtyLabel: L
      ? "text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600"
      : "text-xs font-semibold uppercase tracking-[0.14em] text-text-muted",
    qtyContainer: L
      ? "inline-flex items-center overflow-hidden rounded-md border border-neutral-300 bg-white"
      : "inline-flex items-center overflow-hidden rounded-md border border-white/20 bg-dark-surface/50",
    qtyBtn: L
      ? "flex h-10 w-10 items-center justify-center text-lg font-medium text-neutral-800 transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gn-forest/40 disabled:cursor-not-allowed disabled:opacity-40"
      : "flex h-10 w-10 items-center justify-center text-lg font-medium text-text-primary transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/40 disabled:cursor-not-allowed disabled:opacity-40",
    qtyValue: L
      ? "min-w-[2.75rem] px-2 text-center text-sm font-semibold tabular-nums text-neutral-900"
      : "min-w-[2.75rem] px-2 text-center text-sm font-semibold tabular-nums text-text-primary",
    availCard: L
      ? "rounded-md border border-neutral-300 bg-white px-4 py-3.5"
      : "rounded-md border border-white/15 bg-dark-surface/40 px-4 py-3.5",
    availTitle: L
      ? "text-sm font-semibold text-neutral-900"
      : "text-sm font-semibold text-text-primary",
    availStatus: L
      ? "mt-1 text-sm font-medium text-gn-forest"
      : "mt-1 text-sm font-medium text-accent-moss",
    availDetail: L
      ? "mt-0.5 text-xs leading-snug text-neutral-600"
      : "mt-0.5 text-xs leading-snug text-text-muted",
  };
}
