"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "@/components/i18n/LocaleProvider";

const SESSION_STORAGE_KEY = "gn-registration-cta-dismissed";
const SESSION_STORAGE_MINIMIZED = "gn-registration-cta-minimized";

export default function RegistrationCTA() {
  const pathname = usePathname();
  const { isLoggedIn } = useUser();
  const { authOpen, openAuthModal } = useAuth();
  const t = useTranslations();
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check sessionStorage on mount and when dependencies change
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Never show if user is logged in
    if (isLoggedIn) {
      setIsVisible(false);
      setIsDismissed(true);
      return;
    }

    // Don't show if AuthModal is open
    if (authOpen) {
      setIsVisible(false);
      return;
    }

    // Check if CTA should be shown on current page
    // Show only on Home and Products pages
    if (!pathname) {
      setIsVisible(false);
      return;
    }
    const isHome = pathname === "/es" || pathname === "/en" || pathname === "/fr" || pathname === "/it" || pathname.match(/^\/[a-z]{2}\/?$/);
    const isProducts = pathname.includes("/products") && !pathname.includes("/products/");
    const shouldShowOnPage = isHome || isProducts;

    if (!shouldShowOnPage) {
      setIsVisible(false);
      return;
    }

    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem(SESSION_STORAGE_KEY) === "true";
    if (dismissed) {
      setIsDismissed(true);
      setIsVisible(false);
      return;
    }

    // Check if minimized in this session
    const minimized = sessionStorage.getItem(SESSION_STORAGE_MINIMIZED) === "true";
    if (minimized) {
      setIsMinimized(true);
      setIsVisible(true);
    } else {
      setIsMinimized(false);
      setIsVisible(true);
    }
  }, [pathname, isLoggedIn, authOpen]);

  // Hide when user logs in or registers
  useEffect(() => {
    if (isLoggedIn) {
      setIsVisible(false);
      setIsDismissed(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
        sessionStorage.removeItem(SESSION_STORAGE_MINIMIZED);
      }
    }
  }, [isLoggedIn]);

  // Hide when AuthModal opens
  useEffect(() => {
    if (authOpen) {
      setIsVisible(false);
    } else if (!isDismissed && !isLoggedIn && pathname) {
      // Check if should show on current page
      const isHome = pathname === "/es" || pathname === "/en" || pathname === "/fr" || pathname === "/it" || pathname.match(/^\/[a-z]{2}\/?$/);
      const isProducts = pathname.includes("/products") && !pathname.includes("/products/");
      const shouldShowOnPage = isHome || isProducts;
      
      if (shouldShowOnPage) {
        // Show again when modal closes (if not dismissed)
        const minimized = typeof window !== "undefined" && sessionStorage.getItem(SESSION_STORAGE_MINIMIZED) === "true";
        setIsMinimized(minimized);
        setIsVisible(true);
      }
    }
  }, [authOpen, isDismissed, isLoggedIn, pathname]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
      sessionStorage.removeItem(SESSION_STORAGE_MINIMIZED);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_STORAGE_MINIMIZED, "true");
    }
  };

  const handleExpand = () => {
    setIsMinimized(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_STORAGE_MINIMIZED);
    }
  };

  const handleCreateAccount = () => {
    openAuthModal("register");
  };

  if (!isVisible) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:left-4 md:translate-x-0 z-40 animate-fade-in">
        <button
          onClick={handleExpand}
          className="px-4 py-2 rounded-full bg-dark-surface border border-white/10 text-text-primary text-sm font-medium hover:border-accent-gold/60 transition-all duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
          aria-label={t("registrationCTA.expand")}
        >
          {t("registrationCTA.title")}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:left-4 md:translate-x-0 z-40 w-[calc(100%-2rem)] md:w-auto md:max-w-sm animate-fade-in">
      <div className="bg-dark-surface border border-white/10 rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-text-primary mb-1">
              {t("registrationCTA.title")}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              {t("registrationCTA.text")}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <button
              onClick={handleMinimize}
              className="text-text-muted hover:text-text-primary transition-colors duration-200 p-1"
              aria-label={t("registrationCTA.minimize")}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>
            <button
              onClick={handleDismiss}
              className="text-text-muted hover:text-text-primary transition-colors duration-200 p-1"
              aria-label="Cerrar"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleCreateAccount}
            className="flex-1 px-4 py-2.5 rounded-xl bg-text-primary text-dark-base text-sm font-semibold hover:bg-white transition-colors duration-200"
          >
            {t("registrationCTA.cta")}
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2.5 rounded-xl border border-white/20 text-text-muted text-sm font-medium hover:border-white/40 hover:text-text-primary transition-colors duration-200"
          >
            {t("registrationCTA.later")}
          </button>
        </div>
      </div>
    </div>
  );
}
