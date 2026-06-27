"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";

type Props = {
  amountUsd: number;
  className?: string;
  variant?: "default" | "compact";
};

function formatUsdExact(amountUsd: number, locale: string): string {
  return new Intl.NumberFormat(locale === "es" ? "es-AR" : "en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountUsd);
}

export default function UsdChargeNotice({
  amountUsd,
  className = "",
  variant = "default",
}: Props) {
  const { formatMoney, currency } = useCurrency();
  const locale = useLocale();
  const t = useTranslations();

  const referenceLabel = formatMoney(amountUsd);
  const usdLabel = formatUsdExact(amountUsd, locale);

  const baseClass =
    variant === "compact"
      ? "rounded-xl border border-accent-gold/40 bg-accent-gold/10 px-4 py-3 text-xs leading-relaxed"
      : "rounded-2xl border border-accent-gold/45 bg-gradient-to-br from-accent-gold/12 via-warm-sand/90 to-soft-stone px-5 py-4 text-sm leading-relaxed shadow-[0_10px_36px_-18px_rgba(17,23,19,0.12)]";

  return (
    <div className={`${baseClass} ${className}`} role="note">
      <p className="font-semibold text-dark-base">
        {t("currency.usdChargeHeadline")}
      </p>
      <p className="mt-2 text-muted-gray">
        {currency !== "USD"
          ? t("currency.usdChargeReference").replace("{amount}", referenceLabel)
          : null}
        {currency !== "USD" ? " " : null}
        <span className="font-semibold tabular-nums text-dark-base">
          {t("currency.usdChargeAmount").replace("{amount}", usdLabel)}
        </span>
      </p>
    </div>
  );
}
