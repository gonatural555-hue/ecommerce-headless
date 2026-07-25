<<<<<<< HEAD
import { redirect } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { goNaturalHomePath } from "@/lib/routing/brands";
=======
import GoodIdeasHomePage from "@/components/good-ideas/GoodIdeasHomePage";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { buildPathByLocale, homePath } from "@/lib/routing/paths";
>>>>>>> 8e880344766638a7513f3b6c9d14c843a23fe9c1

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
<<<<<<< HEAD
  redirect(goNaturalHomePath(locale));
=======
  const messages = await getMessages(locale);
  const seo = messages.seo?.goodIdeas;

  return buildMetadata({
    locale,
    title: seo?.title,
    description: seo?.description,
    pathByLocale: buildPathByLocale(homePath),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const t = createTranslator(messages);

  return (
    <GoodIdeasHomePage
      locale={locale}
      title={t("goodIdeas.hero.title")}
      subtitle={t("goodIdeas.hero.subtitle")}
      eyebrow={t("goodIdeas.hero.eyebrow")}
      cta={t("goodIdeas.hero.cta")}
      comingSoon={t("goodIdeas.hero.comingSoon")}
      sectionAriaLabel={t("goodIdeas.hero.sectionAria")}
    />
  );
>>>>>>> 8e880344766638a7513f3b6c9d14c843a23fe9c1
}
