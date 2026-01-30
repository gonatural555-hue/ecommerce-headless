import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import LegalPage from "@/components/legal/LegalPage";
import { buildMetadata, LEGAL_SLUGS } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const page = messages.legal?.privacy;

  return buildMetadata({
    locale,
    title: page?.metaTitle,
    description: page?.metaDescription,
    pathByLocale: {
      en: `/en/${LEGAL_SLUGS.privacy.en}`,
      es: `/es/${LEGAL_SLUGS.privacy.es}`,
      fr: `/fr/${LEGAL_SLUGS.privacy.fr}`,
      it: `/it/${LEGAL_SLUGS.privacy.it}`,
    },
  });
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const page = messages.legal?.privacy;

  if (!page) {
    return null;
  }

  return (
    <LegalPage
      title={page.title}
      intro={page.intro}
      updatedAt={page.updatedAt}
      sections={page.sections}
      closing={page.closing}
    />
  );
}

