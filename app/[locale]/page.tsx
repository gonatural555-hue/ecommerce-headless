import { redirect } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { goNaturalHomePath } from "@/lib/routing/brands";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  redirect(goNaturalHomePath(locale));
}
