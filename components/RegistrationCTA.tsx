"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { useTranslations, useLocale } from "@/components/i18n/LocaleProvider";
import { shouldShowNewsletterCta } from "@/lib/newsletter-cta";

const SESSION_STORAGE_MINIMIZED = "gn-registration-cta-minimized";
const SESSION_STORAGE_SUBSCRIBED = "gn-newsletter-cta-subscribed";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubmitState = "idle" | "loading" | "success" | "error";

export default function RegistrationCTA() {
  const pathname = usePathname();
  const locale = useLocale();
  const { isLoggedIn } = useUser();
  const { authOpen } = useAuth();
  const t = useTranslations();
  const ctaRootRef = useRef<HTMLDivElement>(null);
  const newsletterInputFocusedRef = useRef(false);

  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isInputFocusedElsewhere, setIsInputFocusedElsewhere] = useState(false);
  const [sessionSubscribed, setSessionSubscribed] = useState(false);

  const [email, setEmail] = useState("");
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const privacyHref = `/${locale}/privacy-policy`;

  const syncVisibility = useCallback(() => {
    if (typeof window === "undefined") return;

    if (isLoggedIn || authOpen) {
      setIsVisible(false);
      return;
    }

    if (sessionStorage.getItem(SESSION_STORAGE_SUBSCRIBED) === "true") {
      setSessionSubscribed(true);
      setIsVisible(false);
      return;
    }

    if (!pathname || !shouldShowNewsletterCta(pathname)) {
      setIsVisible(false);
      return;
    }

    const minimized =
      sessionStorage.getItem(SESSION_STORAGE_MINIMIZED) === "true";
    setIsMinimized(minimized);
    setIsVisible(true);
  }, [authOpen, isLoggedIn, pathname]);

  useEffect(() => {
    queueMicrotask(() => {
      syncVisibility();
    });
  }, [syncVisibility]);

  useEffect(() => {
    if (isLoggedIn && typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_STORAGE_MINIMIZED);
    }
  }, [isLoggedIn]);

  // Teclado móvil: ocultar el CTA solo si el foco está en otro input (no en el email del CTA).
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth >= 768) return;

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (ctaRootRef.current?.contains(target)) return;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        queueMicrotask(() => {
          setIsInputFocusedElsewhere(true);
          setIsVisible(false);
        });
      }
    };

    const restoreAfterKeyboard = () => {
      setTimeout(() => {
        queueMicrotask(() => {
          setIsInputFocusedElsewhere(false);
          if (
            !isLoggedIn &&
            !authOpen &&
            pathname &&
            shouldShowNewsletterCta(pathname)
          ) {
            if (sessionStorage.getItem(SESSION_STORAGE_SUBSCRIBED) === "true")
              return;
            const minimized =
              sessionStorage.getItem(SESSION_STORAGE_MINIMIZED) === "true";
            setIsMinimized(minimized);
            setIsVisible(true);
          }
        });
      }, 300);
    };

    const handleFocusOut = () => {
      restoreAfterKeyboard();
    };

    const initialViewportHeight =
      window.visualViewport?.height ?? window.innerHeight;
    const handleResize = () => {
      if (newsletterInputFocusedRef.current) return;
      if (window.innerWidth >= 768) return;
      const currentHeight = window.visualViewport?.height ?? window.innerHeight;
      const heightDiff = initialViewportHeight - currentHeight;
      if (heightDiff > 150) {
        queueMicrotask(() => {
          setIsInputFocusedElsewhere(true);
          setIsVisible(false);
        });
      } else if (heightDiff < 50) {
        restoreAfterKeyboard();
      }
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    window.visualViewport?.addEventListener("resize", handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  }, [authOpen, isLoggedIn, pathname]);

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

  const handleHideAfterSuccess = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_STORAGE_SUBSCRIBED, "true");
    }
    setSessionSubscribed(true);
    setIsVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!marketingAccepted || submitState === "loading") return;

    const trimmed = email.trim();
    if (!EMAIL_REGEX.test(trimmed)) {
      setSubmitState("error");
      setErrorCode("invalid_email");
      return;
    }

    setSubmitState("loading");
    setErrorCode(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          locale,
          marketingAccepted: true,
          source: "registration_cta",
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
      };

      if (res.ok && data.ok) {
        setSubmitState("success");
        return;
      }

      setSubmitState("error");
      if (data.code === "duplicate") setErrorCode("duplicate");
      else if (data.code === "invalid_email") setErrorCode("invalid_email");
      else if (data.code === "marketing_required")
        setErrorCode("marketing_required");
      else setErrorCode("generic");
    } catch {
      setSubmitState("error");
      setErrorCode("generic");
    }
  };

  if (sessionSubscribed) return null;
  if (!isVisible || isInputFocusedElsewhere) return null;

  const errorMessage =
    errorCode === "duplicate"
      ? t("registrationCTA.errorDuplicate")
      : errorCode === "invalid_email"
        ? t("registrationCTA.errorInvalidEmail")
        : errorCode === "marketing_required"
          ? t("registrationCTA.errorMarketingRequired")
          : errorCode === "generic"
            ? t("registrationCTA.errorGeneric")
            : null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-1/2 z-[45] w-[min(100%-1rem,calc(100vw-1rem))] max-w-sm -translate-x-1/2 animate-fade-in pb-[max(0.75rem,env(safe-area-inset-bottom))] md:left-4 md:w-auto md:max-w-none md:translate-x-0">
        <button
          type="button"
          onClick={handleExpand}
          className="font-inter w-full rounded-full border border-[rgba(110,31,40,0.35)] bg-[#F4EBDD] px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2E4A36] shadow-[0_10px_36px_-12px_rgba(46,74,54,0.35),0_2px_8px_rgba(46,74,54,0.08)] transition hover:border-[#6E1F28]/55 hover:shadow-[0_14px_40px_-10px_rgba(46,74,54,0.28)] md:w-auto md:px-4 md:text-xs"
          aria-label={t("registrationCTA.expand")}
        >
          {t("registrationCTA.minimizedLabel")}
        </button>
      </div>
    );
  }

  return (
    <div
      ref={ctaRootRef}
      data-gn-newsletter-cta
      className="fixed bottom-4 left-1/2 z-[45] w-[min(100%-1rem,calc(100vw-1rem))] max-w-md -translate-x-1/2 animate-fade-in pb-[max(0.75rem,env(safe-area-inset-bottom))] md:left-4 md:translate-x-0"
    >
      <div className="rounded-2xl border border-[rgba(46,74,54,0.12)] bg-[#F4EBDD] p-4 shadow-[0_18px_48px_-20px_rgba(46,74,54,0.35),0_6px_20px_rgba(46,74,54,0.12)] sm:p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-balance text-lg font-medium leading-snug tracking-[-0.02em] text-[#2E4A36] md:text-xl">
              {t("registrationCTA.title")}
            </h3>
            <p className="font-inter mt-1.5 text-sm leading-relaxed text-[rgba(46,74,54,0.78)]">
              {t("registrationCTA.subtitle")}
            </p>
            <p className="font-inter mt-1 text-xs leading-relaxed text-[rgba(46,74,54,0.62)]">
              {t("registrationCTA.secondaryText")}
            </p>
          </div>
          <button
            type="button"
            onClick={handleMinimize}
            className="shrink-0 rounded-lg p-1 text-[rgba(46,74,54,0.55)] transition hover:bg-[rgba(46,74,54,0.06)] hover:text-[#2E4A36]"
            aria-label={t("registrationCTA.minimize")}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>
        </div>

        {submitState === "success" ? (
          <div className="space-y-3">
            <p className="font-inter text-sm font-medium leading-relaxed text-[#2E4A36]">
              {t("registrationCTA.successMessage")}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleHideAfterSuccess}
                className="font-inter inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-[#6E1F28] px-4 py-2.5 text-sm font-semibold text-[#F4EBDD] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition hover:bg-[#5c1a22] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E4A36]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4EBDD]"
              >
                {t("registrationCTA.hideAfterSuccess")}
              </button>
              <button
                type="button"
                onClick={handleMinimize}
                className="font-inter inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[rgba(46,74,54,0.2)] px-4 py-2.5 text-sm font-medium text-[#2E4A36] transition hover:border-[rgba(46,74,54,0.35)] hover:bg-[rgba(46,74,54,0.04)]"
              >
                {t("registrationCTA.minimize")}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="gn-newsletter-email" className="sr-only">
                {t("registrationCTA.emailLabel")}
              </label>
              <input
                id="gn-newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(ev) => {
                  setEmail(ev.target.value);
                  if (submitState === "error") {
                    setSubmitState("idle");
                    setErrorCode(null);
                  }
                }}
                onFocus={() => {
                  newsletterInputFocusedRef.current = true;
                }}
                onBlur={() => {
                  newsletterInputFocusedRef.current = false;
                }}
                placeholder={t("registrationCTA.emailPlaceholder")}
                className="font-inter w-full rounded-xl border border-[rgba(46,74,54,0.18)] bg-white/90 px-3 py-2.5 text-sm text-[#2E4A36] placeholder:text-[rgba(46,74,54,0.45)] shadow-inner outline-none ring-[#6E1F28]/25 transition focus:border-[rgba(110,31,40,0.45)] focus:ring-2"
                required
              />
            </div>

            <label className="font-inter flex cursor-pointer gap-2.5 text-left text-xs leading-snug text-[rgba(46,74,54,0.85)]">
              <input
                type="checkbox"
                checked={marketingAccepted}
                onChange={(e) => {
                  setMarketingAccepted(e.target.checked);
                  if (submitState === "error") {
                    setSubmitState("idle");
                    setErrorCode(null);
                  }
                }}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-[rgba(46,74,54,0.35)] text-[#6E1F28] focus:ring-[#6E1F28]/30"
              />
              <span>
                {t("registrationCTA.marketingLabel")}{" "}
                <Link
                  href={privacyHref}
                  className="font-medium text-[#6E1F28] underline decoration-[rgba(110,31,40,0.35)] underline-offset-2 hover:decoration-[#6E1F28]"
                >
                  {t("registrationCTA.privacyLink")}
                </Link>
              </span>
            </label>

            {errorMessage ? (
              <p className="font-inter text-sm text-[#6E1F28]" role="alert">
                {errorMessage}
              </p>
            ) : null}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
              <button
                type="submit"
                disabled={
                  !marketingAccepted || submitState === "loading" || !email.trim()
                }
                className="font-inter inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-[#6E1F28] px-4 py-2.5 text-sm font-semibold text-[#F4EBDD] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition enabled:hover:bg-[#5c1a22] enabled:focus:outline-none enabled:focus-visible:ring-2 enabled:focus-visible:ring-[#2E4A36]/30 enabled:focus-visible:ring-offset-2 enabled:focus-visible:ring-offset-[#F4EBDD] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {submitState === "loading"
                  ? t("registrationCTA.submitLoading")
                  : t("registrationCTA.cta")}
              </button>
              <button
                type="button"
                onClick={handleMinimize}
                className="font-inter inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[rgba(46,74,54,0.2)] px-4 py-2.5 text-sm font-medium text-[#2E4A36] transition hover:border-[rgba(46,74,54,0.35)] hover:bg-[rgba(46,74,54,0.04)]"
              >
                {t("registrationCTA.minimize")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
