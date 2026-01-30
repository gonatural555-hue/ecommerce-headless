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
  const page = messages.legal?.terms;

  return buildMetadata({
    locale,
    title: page?.metaTitle,
    description: page?.metaDescription,
    pathByLocale: {
      en: `/en/${LEGAL_SLUGS.terms.en}`,
      es: `/es/${LEGAL_SLUGS.terms.es}`,
      fr: `/fr/${LEGAL_SLUGS.terms.fr}`,
      it: `/it/${LEGAL_SLUGS.terms.it}`,
    },
  });
}

export default async function TermsConditionsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const page = messages.legal?.terms;

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

