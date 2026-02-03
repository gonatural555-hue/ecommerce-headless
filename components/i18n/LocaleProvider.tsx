"use client";

import { createContext, useContext, useEffect } from "react";
import type { Locale } from "@/lib/i18n/config";
import { createTranslator } from "@/lib/i18n/translate";

type LocaleContextValue = {
  locale: Locale;
  messages: Record<string, any>;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const LOCALE_STORAGE_KEY = "gn-locale";

export function LocaleProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Record<string, any>;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    }
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, messages }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx.locale;
}

export function useTranslations() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useTranslations must be used within LocaleProvider");
  }
  return createTranslator(ctx.messages);
}

