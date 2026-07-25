"use client";

import { useTranslations } from "@/components/i18n/LocaleProvider";

export default function MembershipPromoBadge() {
  const t = useTranslations();

  const title = t("productsPage.membershipPromo.badge.title");
  const discountValue = t("productsPage.membershipPromo.badge.discountValue");
  const discountSuffix = t("productsPage.membershipPromo.badge.discountSuffix");
  const ariaLabel = t("productsPage.membershipPromo.badge.ariaLabel");

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className="gn-membership-promo-badge flex w-full max-w-[340px] flex-col select-none"
    >
      <div className="flex w-full items-center gap-3">
        <p className="font-inter shrink-0 text-[clamp(0.75rem,2vw,0.875rem)] font-black uppercase leading-none tracking-[0.14em] text-[#171717]">
          {title}
        </p>
        <span
          className="h-px min-w-[2rem] flex-1 bg-[#171717]/75"
          aria-hidden
        />
      </div>

      <div className="mt-6 flex items-start justify-center gap-0.5 self-center">
        <span
          className="font-display text-[clamp(4.5rem,14vw,6.5rem)] font-bold leading-[0.85] tracking-tight text-[#2E4A36]"
          aria-hidden
        >
          {discountValue}
        </span>
        <span className="flex flex-col items-start pt-1 md:pt-2">
          <span
            className="font-display text-[clamp(1.5rem,4vw,2rem)] font-bold leading-none text-gn-mustard"
            aria-hidden
          >
            %
          </span>
          <span className="font-inter mt-0.5 text-[clamp(0.875rem,2.4vw,1.125rem)] font-black uppercase leading-none tracking-[0.1em] text-[#171717]">
            {discountSuffix}
          </span>
        </span>
      </div>
    </div>
  );
}
