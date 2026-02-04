"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import AuthModal from "@/components/AuthModal";

const STORAGE_KEY = "gn-registration-cta";
const STATES = {
  dismissed: "dismissed",
  minimized: "minimized",
} as const;

export default function RegistrationCTA() {
  const { isLoggedIn } = useUser();
  const locale = useLocale();
  const t = useTranslations();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  // Check if we should show the CTA on current page
  const shouldShowOnPage = () => {
    if (!pathname) return false;
    // Show on: home, products list, product detail pages
    const path = pathname.replace(`/${locale}`, "") || "/";
    return (
      path === "/" ||
      path === "/products" ||
      path.startsWith("/products/")
    );
  };

  useEffect(() => {
    setIsMounted(true);
    
    // Don't show if user is logged in
    if (isLoggedIn) {
      return;
    }

    // Don't show if dismissed
    const stored = typeof window !== "undefined" 
      ? localStorage.getItem(STORAGE_KEY) 
      : null;
    
    if (stored === STATES.dismissed) {
      return;
    }

    // Check if minimized
    if (stored === STATES.minimized) {
      setIsMinimized(true);
    }

    // Only show on specific pages
    if (shouldShowOnPage()) {
      setIsVisible(true);
    }
  }, [isLoggedIn, pathname, locale]);

  // Hide when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      setIsVisible(false);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, STATES.dismissed);
      }
    }
  }, [isLoggedIn]);

  // Update visibility when pathname changes
  useEffect(() => {
    if (isLoggedIn) return;
    
    const stored = typeof window !== "undefined" 
      ? localStorage.getItem(STORAGE_KEY) 
      : null;
    
    if (stored === STATES.dismissed) return;

    if (shouldShowOnPage()) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [pathname, locale, isLoggedIn]);

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, STATES.dismissed);
    }
    setIsVisible(false);
  };

  const handleMinimize = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, STATES.minimized);
    }
    setIsMinimized(true);
  };

  const handleExpand = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    setIsMinimized(false);
  };

  const handleCreateAccount = () => {
    setAuthOpen(true);
  };

  if (!isMounted || !isVisible || isLoggedIn) {
    return null;
  }

  // Minimized state (mobile pill)
  if (isMinimized) {
    return (
      <>
        <div
          className="fixed z-40 bottom-6 left-6 md:bottom-8 md:left-8 pb-[max(0px,env(safe-area-inset-bottom))]"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <button
            type="button"
            onClick={handleExpand}
            className="rounded-full border border-white/10 bg-dark-base/90 backdrop-blur-md px-4 py-2.5 text-xs font-semibold text-text-primary shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:border-accent-gold/40 hover:bg-dark-base transition-all duration-200 ease-out"
            aria-label={t("registrationCTA.expand")}
          >
            {t("registrationCTA.title")}
          </button>
        </div>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </>
    );
  }

  // Expanded state
  return (
    <>
      <div
        className="fixed z-40 bottom-6 left-6 md:bottom-8 md:left-8 max-w-sm pb-[max(0px,env(safe-area-inset-bottom))]"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="rounded-2xl border border-white/10 bg-dark-base/90 backdrop-blur-md shadow-[0_12px_32px_rgba(0,0,0,0.4)] overflow-hidden">
          {/* Header with minimize button */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3">
            <h3 className="text-sm font-semibold text-text-primary">
              {t("registrationCTA.title")}
            </h3>
            <button
              type="button"
              onClick={handleMinimize}
              className="text-text-muted hover:text-text-primary transition-colors duration-200"
              aria-label={t("registrationCTA.minimize")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 12h-15"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-5 pb-4">
            <p className="text-xs text-text-muted leading-relaxed mb-4">
              {t("registrationCTA.text")}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleCreateAccount}
                className="flex-1 rounded-xl bg-accent-gold px-4 py-2.5 text-xs font-semibold text-dark-base hover:bg-accent-gold/90 transition-colors duration-200 ease-out"
              >
                {t("registrationCTA.cta")}
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="rounded-xl border border-white/10 bg-dark-surface/50 px-4 py-2.5 text-xs font-semibold text-text-muted hover:text-text-primary hover:border-white/20 transition-colors duration-200 ease-out"
              >
                {t("registrationCTA.later")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

