import type { Locale } from "@/lib/i18n/config";

export async function getMessages(locale: Locale) {
  return (await import(`@/messages/${locale}.json`)).default as Record<string, any>;
}

