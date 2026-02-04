import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/lib/i18n/messages";
import { locales, type Locale } from "@/lib/i18n/config";
import CookieConsent from "@/components/CookieConsent";
import RegistrationCTA from "@/components/RegistrationCTA";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages(locale as Locale);

  return (
    <LocaleProvider locale={locale as Locale} messages={messages}>
      <Header />
      {children}
      <CookieConsent />
      <Footer />
      <RegistrationCTA />
    </LocaleProvider>
  );
}

