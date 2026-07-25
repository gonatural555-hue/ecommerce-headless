import GoNaturalHomePage from "@/components/go-natural/GoNaturalHomePage";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { BRAND_SEGMENTS } from "@/lib/routing/brands";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const homeSeo = messages.seo?.home;
  const productsSeo = messages.seo?.products;

  return buildMetadata({
    locale,
    title: homeSeo?.title,
    description: [homeSeo?.description, productsSeo?.description]
      .filter(Boolean)
      .join(" "),
    pathByLocale: {
      en: `/en/${BRAND_SEGMENTS.goNatural}`,
      es: `/es/${BRAND_SEGMENTS.goNatural}`,
      fr: `/fr/${BRAND_SEGMENTS.goNatural}`,
      it: `/it/${BRAND_SEGMENTS.goNatural}`,
    },
    ogImage: "/assets/images/hero/productsbanner.webp",
  });
}

export default async function GoNaturalPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <GoNaturalHomePage locale={locale} />;
}
