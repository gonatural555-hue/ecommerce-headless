"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import CartSuggestedProductsRail from "@/components/cart/CartSuggestedProductsRail";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import {
  cartLineToGa4Item,
  trackViewCart,
} from "@/lib/analytics/ga4";

const FREE_SHIPPING_THRESHOLD_USD = 100;

function interpolate(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

export default function CartPage() {
  const { items, subtotal, increaseQty, decreaseQty, removeItem } = useCart();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const viewCartTracked = useRef(false);

  useEffect(() => {
    if (items.length === 0) {
      viewCartTracked.current = false;
      return;
    }
    if (viewCartTracked.current) return;
    viewCartTracked.current = true;
    trackViewCart(
      items.map((item) => cartLineToGa4Item(item, item.quantity))
    );
  }, [items, subtotal]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(
      locale === "es"
        ? "es-AR"
        : locale === "fr"
          ? "fr-FR"
          : locale === "it"
            ? "it-IT"
            : "en-US",
      {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }
    ).format(price);
  };

  const thresholdLabel = formatPrice(FREE_SHIPPING_THRESHOLD_USD);

  const cartItemIds = useMemo(() => items.map((item) => item.id), [items]);

  const { shippingPct, shippingRemaining, shippingUnlocked } = useMemo(() => {
    const pct = Math.min(
      100,
      Math.round((subtotal / FREE_SHIPPING_THRESHOLD_USD) * 1000) / 10
    );
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD_USD - subtotal);
    return {
      shippingPct: pct,
      shippingRemaining: remaining,
      shippingUnlocked: subtotal >= FREE_SHIPPING_THRESHOLD_USD,
    };
  }, [subtotal]);

  const handleCheckout = () => {
    router.push(`/${locale}/checkout`);
  };

  const formatVariantSummary = (item: (typeof items)[number]) => {
    if (item.variantSelections && item.variantSelections.length > 0) {
      return item.variantSelections
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

    return item.variantSummary || "";
  };

  if (items.length === 0) {
    return (
      <main
        data-route="cart"
        className="relative w-full overflow-hidden pt-28 pb-16 md:pt-32 md:pb-24"
      >
        <div className="absolute inset-0">
          <Image
            src="/assets/images/hero/emptycart.webp"
            alt={t("cartPage.emptyTitle")}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-base via-black/70 to-black/50" />
        </div>
        <div className="relative z-10 max-w-lg mx-auto px-4 text-center">
          <p className="text-[0.65rem] uppercase tracking-[0.28em] text-accent-gold/90 mb-4">
            Go Natural
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-text-primary tracking-tight mb-4">
            {t("cartPage.emptyTitle")}
          </h1>
          <p className="text-text-muted mb-10 leading-relaxed">
            {t("cartPage.emptyText")}
          </p>
          <Link
            href={`/${locale}/products`}
            className="inline-flex justify-center rounded-lg bg-accent-gold px-8 py-3.5 text-sm font-semibold text-dark-base shadow-lg shadow-accent-gold/20 transition hover:bg-accent-gold/90 hover:shadow-accent-gold/30 active:scale-[0.98]"
          >
            {t("cartPage.emptyCta")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      data-route="cart"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 md:pt-32 md:pb-20"
    >
      <header className="mb-10 md:mb-12 max-w-2xl">
        <p className="text-[0.65rem] uppercase tracking-[0.28em] text-accent-gold/90 mb-3">
          {t("cartPage.summaryTitle")}
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold text-text-primary tracking-tight mb-3">
          {t("cartPage.heroTitle")}
        </h1>
        <p className="text-text-muted text-base md:text-lg leading-relaxed">
          {t("cartPage.heroSubtitle")}
        </p>
      </header>

      <div className="grid gap-8 lg:gap-10 lg:grid-cols-[minmax(0,1fr)_min(100%,380px)] lg:items-start">
        <div className="space-y-8 min-w-0">
          {/* Free shipping progress */}
          <section
            className="rounded-2xl border border-accent-gold/25 bg-dark-surface/80 p-5 md:p-6 shadow-[0_0_0_1px_rgba(200,155,60,0.08)] backdrop-blur-sm"
            aria-label={t("cartPage.freeShippingLabel")}
          >
            <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
              <div>
                <h2 className="text-sm font-semibold text-text-primary">
                  {t("cartPage.freeShippingLabel")}
                </h2>
                <p className="text-xs text-text-muted mt-1">
                  {interpolate(t("cartPage.freeShippingThresholdHint"), {
                    amount: thresholdLabel,
                  })}
                </p>
              </div>
              {!shippingUnlocked && (
                <span className="text-xs font-medium tabular-nums text-accent-gold">
                  {interpolate(t("cartPage.freeShippingAway"), {
                    amount: formatPrice(shippingRemaining),
                  })}
                </span>
              )}
            </div>
            <div
              className="h-2 rounded-full bg-white/10 overflow-hidden"
              role="progressbar"
              aria-valuenow={Math.round(shippingPct)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent-moss to-accent-gold transition-[width] duration-700 ease-out motion-reduce:transition-none"
                style={{ width: `${shippingPct}%` }}
              />
            </div>
            {shippingUnlocked && (
              <p className="mt-3 text-sm text-accent-gold/95 font-medium">
                {t("cartPage.freeShippingUnlocked")}
              </p>
            )}
          </section>

          {/* Line items */}
          <section className="rounded-2xl border border-white/10 bg-dark-surface/60 overflow-hidden">
            <ul className="divide-y divide-white/10">
              {items.map((item) => {
                const itemSubtotal = item.price * item.quantity;
                const variantText = formatVariantSummary(item);
                return (
                  <li
                    key={item.id}
                    className="p-4 sm:p-6 transition-colors hover:bg-white/[0.03]"
                  >
                    <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
                      {item.image ? (
                        <div className="relative w-[104px] h-[104px] sm:w-[120px] sm:h-[120px] shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10 bg-dark-base">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover object-center"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-[104px] h-[104px] sm:w-[120px] sm:h-[120px] shrink-0 rounded-xl border border-dashed border-white/20 bg-white/5"
                          aria-hidden
                        />
                      )}

                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:justify-between gap-4">
                        <div className="min-w-0">
                          <h2 className="text-lg font-semibold text-text-primary leading-snug">
                            {item.title}
                          </h2>
                          {variantText ? (
                            <p className="mt-2 text-sm text-accent-gold/90 leading-relaxed">
                              {variantText}
                            </p>
                          ) : null}
                          <p className="mt-2 text-sm text-text-muted">
                            {t("cartPage.unitPrice")}{" "}
                            <span className="text-text-primary font-medium tabular-nums">
                              {formatPrice(item.price)}
                            </span>
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <div className="inline-flex items-center rounded-lg border border-white/15 bg-dark-base/60 shadow-inner">
                              <button
                                type="button"
                                onClick={() => decreaseQty(item.id)}
                                className="px-3.5 py-2 text-text-primary hover:bg-white/10 active:scale-95 transition motion-reduce:transform-none rounded-l-lg"
                                aria-label={t("cartPage.decreaseQty")}
                              >
                                −
                              </button>
                              <span className="min-w-[2.75rem] px-2 py-2 text-center text-sm font-semibold tabular-nums text-text-primary border-x border-white/15">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => increaseQty(item.id)}
                                className="px-3.5 py-2 text-text-primary hover:bg-white/10 active:scale-95 transition motion-reduce:transform-none rounded-r-lg"
                                aria-label={t("cartPage.increaseQty")}
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-sm font-medium text-text-muted hover:text-red-400/90 underline-offset-4 hover:underline transition-colors"
                            >
                              {t("cartPage.remove")}
                            </button>
                          </div>
                        </div>

                        <div className="sm:text-right shrink-0">
                          <p className="text-xs uppercase tracking-wider text-text-muted">
                            {t("cartPage.itemSubtotal")}
                          </p>
                          <p className="text-xl font-semibold tabular-nums text-text-primary mt-1">
                            {formatPrice(itemSubtotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Completá tu equipo: sugerencias vía /api/cart/suggestions (lógica en getCartSuggestedProducts). */}
          <section className="rounded-2xl border border-dashed border-white/15 bg-dark-base/40 p-6 md:p-8">
            <h2 className="text-lg font-semibold text-text-primary">
              {t("cartPage.completeGearTitle")}
            </h2>
            <p className="mt-2 text-sm text-text-muted leading-relaxed max-w-xl">
              {t("cartPage.completeGearBody")}
            </p>
            <CartSuggestedProductsRail
              locale={locale}
              labels={{
                viewProduct: t("common.viewProduct"),
                addToCart: t("common.addToCart"),
                noImage: t("common.noImage"),
              }}
              cartItemIds={cartItemIds}
              regionAriaLabel={t("cartPage.completeGearSuggestionsAria")}
              suggestError={t("cartPage.completeGearSuggestionsError")}
            />
          </section>

          {/* Trust */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs md:text-sm text-text-muted justify-center sm:justify-start">
            <span className="inline-flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full bg-accent-gold"
                aria-hidden
              />
              {t("cartPage.trustSecure")}
            </span>
            <span className="text-white/20 hidden sm:inline" aria-hidden>
              ·
            </span>
            <span>{t("cartPage.trustPayPal")}</span>
            <span className="text-white/20 hidden sm:inline" aria-hidden>
              ·
            </span>
            <span>{t("cartPage.trustReturns")}</span>
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 space-y-6">
          <div className="rounded-2xl border border-accent-gold/20 bg-gradient-to-b from-dark-surface to-dark-base p-6 md:p-8 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.65)]">
            <h2 className="text-lg font-semibold text-text-primary mb-6">
              {t("cartPage.summaryTitle")}
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-baseline gap-4 text-sm">
                <span className="text-text-muted">{t("cartPage.summarySubtotal")}</span>
                <span className="font-semibold tabular-nums text-text-primary">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed border-t border-white/10 pt-4">
                {t("cartPage.summaryNote")}
              </p>
            </div>

            <div className="pt-2 border-t border-white/10">
              <div className="flex justify-between items-baseline gap-4 mb-8">
                <span className="text-base font-semibold text-text-primary">
                  {t("cartPage.summaryTotal")}
                </span>
                <span className="text-2xl font-semibold tabular-nums text-accent-gold">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="group relative w-full overflow-hidden rounded-xl bg-accent-gold px-6 py-4 text-sm font-semibold text-dark-base shadow-lg shadow-accent-gold/25 transition hover:shadow-xl hover:shadow-accent-gold/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] motion-reduce:transform-none"
              >
                <span className="relative z-10">{t("cartPage.checkout")}</span>
                <span
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out motion-reduce:hidden"
                  aria-hidden
                />
              </button>

              <p className="mt-4 text-center text-xs text-text-muted leading-relaxed">
                {t("cartPage.ctaReassurance")}
              </p>

              <Link
                href={`/${locale}/products`}
                className="mt-6 block text-center text-sm font-medium text-accent-gold/90 hover:text-accent-gold transition-colors"
              >
                {t("cartPage.continueShopping")}
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
