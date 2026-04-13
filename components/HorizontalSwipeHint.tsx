"use client";

import { useTranslations } from "@/components/i18n/LocaleProvider";

type Props = {
  className?: string;
};

/**
 * Indicador solo móvil para carriles horizontales (categorías home, carrito, etc.).
 */
export default function HorizontalSwipeHint({ className = "" }: Props) {
  const t = useTranslations();
  return (
    <p
      className={`md:hidden flex items-center justify-center gap-2 text-center text-xs text-text-muted leading-snug ${className}`.trim()}
    >
      <svg
        className="h-3.5 w-3.5 shrink-0 text-accent-gold/70"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
      <span>{t("common.swipeRailHint")}</span>
      <svg
        className="h-3.5 w-3.5 shrink-0 text-accent-gold/70"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </p>
  );
}
