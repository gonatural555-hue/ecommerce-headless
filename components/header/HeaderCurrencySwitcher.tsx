"use client";

import { useTranslations } from "@/components/i18n/LocaleProvider";
import { useCurrency } from "@/context/CurrencyContext";
import { currencies, type DisplayCurrency } from "@/lib/currency/config";

type Variant = "utility";

type Props = {
  variant?: Variant;
};

export default function HeaderCurrencySwitcher({ variant = "utility" }: Props) {
  const t = useTranslations();
  const { currency, setCurrency } = useCurrency();

  return (
    <nav
      className="gn-rei-utility__currencies"
      aria-label={t("header.currencyNavAria")}
    >
      {currencies.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setCurrency(code as DisplayCurrency)}
          className={`gn-rei-utility__currency${
            code === currency ? " gn-rei-utility__currency--active" : ""
          }`}
          aria-pressed={code === currency}
          title={t(`header.currencies.${code}`)}
        >
          {code}
        </button>
      ))}
    </nav>
  );
}
