import type { Locale } from "@/lib/i18n/config";

export function formatCartPrice(locale: Locale, price: number): string {
  const intlLocale =
    locale === "es"
      ? "es-AR"
      : locale === "fr"
        ? "fr-FR"
        : locale === "it"
          ? "it-IT"
          : "en-US";

  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

type VariantSelection = {
  type: string;
  typeLabel?: string;
  value: string;
  label?: string;
};

/** Misma lógica que el resumen de variantes en la página de carrito. */
export function formatCartVariantSummary(
  variantSelections: VariantSelection[] | undefined,
  variantSummary: string | undefined,
  t: (key: string, fallback?: string | unknown) => string
): string {
  if (variantSelections && variantSelections.length > 0) {
    return variantSelections
      .map((selection) => {
        const label = t(
          `cartPage.variantLabels.${selection.type}`,
          selection.typeLabel || selection.type
        );
        const optionKey = `cartPage.variantOptions.${selection.type}.${selection.value}`;
        const value = t(optionKey, selection.label || selection.value);
        return `${label}: ${value}`;
      })
      .join(" · ");
  }

  return variantSummary || "";
}
