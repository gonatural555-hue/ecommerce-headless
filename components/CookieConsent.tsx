"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "@/components/i18n/LocaleProvider";

const STORAGE_KEY = "cookie-consent";
const STATES = {
  accepted: "accepted",
  declined: "declined",
} as const;

export default function CookieConsent() {
  const t = useTranslations();
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored === STATES.accepted || stored === STATES.declined) {
      return;
    }
    setIsVisible(true);
    setIsMounted(true);
  }, []);

  const handleChoice = (choice: keyof typeof STATES) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, STATES[choice]);
    }
    setIsVisible(false);
  };

  const containerClass = useMemo(
    () =>
      [
        "fixed z-50",
        "left-6 right-6 bottom-6 md:left-8 md:right-auto",
        "max-w-sm",
        "rounded-2xl border border-white/10",
        "bg-dark-base/85 backdrop-blur-md",
        "shadow-[0_18px_40px_rgba(0,0,0,0.45)]",
        "px-5 py-4",
        "text-text-muted",
        "transition-opacity duration-300 ease-out",
        "motion-reduce:transition-none",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
      ].join(" "),
    [isVisible]
  );

  if (!isMounted) {
    return null;
  }

  return (
    <div className={containerClass} role="dialog" aria-live="polite">
      <p className="text-xs md:text-sm leading-relaxed">
        {t("cookieConsent.text")}
      </p>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => handleChoice("declined")}
          className="text-xs md:text-sm text-text-muted/80 hover:text-text-primary transition-colors duration-200 motion-reduce:transition-none"
        >
          {t("cookieConsent.decline")}
        </button>
        <button
          type="button"
          onClick={() => handleChoice("accepted")}
          className="ml-auto rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs md:text-sm text-text-primary hover:bg-white/15 transition-colors duration-200 motion-reduce:transition-none"
        >
          {t("cookieConsent.accept")}
        </button>
      </div>
    </div>
  );
}

