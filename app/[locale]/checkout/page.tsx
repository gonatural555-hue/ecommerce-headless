"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { useUser, type Address, type Order } from "@/context/UserContext";
import PayPalButton from "@/components/PayPalButton";
import { isSupabaseConfigured } from "@/lib/supabase/browser";
import {
  cartLineToGa4Item,
  trackBeginCheckout,
  trackPurchase,
} from "@/lib/analytics/ga4";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const {
    user,
    addresses,
    upsertAddress,
    addOrder,
    authLoading,
    isLoggedIn,
  } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const beginCheckoutTracked = useRef(false);

  useEffect(() => {
    if (items.length === 0) {
      beginCheckoutTracked.current = false;
      return;
    }
    if (beginCheckoutTracked.current) return;
    beginCheckoutTracked.current = true;
    trackBeginCheckout(
      items.map((item) => cartLineToGa4Item(item, item.quantity))
    );
  }, [items, subtotal]);

  const defaultAddress =
    addresses.find((address) => address.isDefault) || addresses[0];

  const [guestAddress, setGuestAddress] = useState<Address>({
    id: "",
    fullName: user?.name || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    country: "",
    isDefault: true,
  });

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

  const handlePayPalSuccess = async (details: { id?: string }) => {
    if (items.length === 0 || !defaultAddress) return;

    setIsLoading(true);

    const orderId = `order_${Date.now()}`;

    try {
      const shippingAddress = {
        id: defaultAddress.id,
        fullName: defaultAddress.fullName,
        phone: defaultAddress.phone,
        addressLine1: defaultAddress.addressLine1,
        addressLine2: defaultAddress.addressLine2,
        city: defaultAddress.city,
        postalCode: defaultAddress.postalCode,
        country: defaultAddress.country,
        isDefault: defaultAddress.isDefault,
      };

      const payload = {
        orderId,
        email: user?.email || "",
        items: items.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: subtotal,
        currency: "USD" as const,
        paypalOrderId: details?.id,
        shippingAddress,
      };

      const response = await fetch("/api/orders/paypal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        console.error("[Checkout] Error API PayPal", {
          status: response.status,
          body: data,
        });
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error("[Checkout] Error llamando a /api/orders/paypal", error);
      setIsLoading(false);
      return;
    }

    trackPurchase({
      transaction_id: orderId,
      value: subtotal,
      currency: "USD",
      items: items.map((item) =>
        cartLineToGa4Item(item, item.quantity)
      ),
    });

    const order: Order = {
      id: orderId,
      items,
      subtotal,
      address: defaultAddress,
      date: new Date().toISOString(),
      status: "paid",
      paymentMethod: "paypal",
      paypalOrderId: details.id,
    };

    addOrder(order);

    clearCart();
    router.push(`/${locale}/order-success`);
  };

  const handlePayPalError = (error: unknown) => {
    console.error("PayPal payment error:", error);
    setIsLoading(false);
  };

  const inputClass =
    "w-full rounded-lg border border-white/15 bg-dark-base/50 px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted/60 transition focus:border-accent-gold focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus-visible:border-accent-gold focus-visible:ring-2 focus-visible:ring-accent-gold/35 max-w-full";

  if (items.length === 0) {
    return (
      <main
        data-route="checkout"
        className="max-w-xl mx-auto px-4 py-20 md:py-28 text-center"
      >
        <p className="text-[0.65rem] uppercase tracking-[0.28em] text-accent-gold/90 mb-4">
          Checkout
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4">
          {t("checkoutPage.emptyTitle")}
        </h1>
        <p className="text-text-muted mb-10 leading-relaxed">
          {t("checkoutPage.emptyText")}
        </p>
        <Link
          href={`/${locale}/products`}
          className="inline-flex justify-center rounded-xl bg-accent-gold px-8 py-3.5 text-sm font-semibold text-dark-base shadow-lg shadow-accent-gold/20 transition hover:bg-accent-gold/90 active:scale-[0.98]"
        >
          {t("checkoutPage.emptyCta")}
        </Link>
      </main>
    );
  }

  if (!isSupabaseConfigured()) {
    return (
      <main
        data-route="checkout"
        className="max-w-xl mx-auto px-4 py-24 text-center"
      >
        <p className="text-text-muted">{t("checkoutPage.supabaseMissing")}</p>
      </main>
    );
  }

  if (authLoading) {
    return (
      <main
        data-route="checkout"
        className="max-w-xl mx-auto px-4 py-24 text-center"
      >
        <p className="text-text-muted">{t("checkoutPage.loadingAuth")}</p>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main
        data-route="checkout"
        className="max-w-xl mx-auto px-4 py-24 text-center"
      >
        <p className="text-text-muted mb-6">{t("checkoutPage.loginRequired")}</p>
        <Link
          href={`/${locale}/auth?redirect=/${locale}/checkout`}
          className="inline-flex rounded-xl bg-accent-gold px-6 py-3 text-sm font-semibold text-dark-base"
        >
          {t("checkoutPage.goToLogin")}
        </Link>
      </main>
    );
  }

  return (
    <main
      data-route="checkout"
      className="max-w-6xl mx-auto px-3 sm:px-4 pt-28 md:pt-32 min-h-[100dvh] md:min-h-0 overflow-x-hidden pb-12"
    >
      <header className="mb-8 md:mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <h1 className="text-3xl md:text-4xl font-semibold text-text-primary tracking-tight">
            {t("checkoutPage.title")}
          </h1>
          <p className="mt-2 text-text-muted text-sm md:text-base leading-relaxed">
            {t("checkoutPage.subtitlePayPalOnly")}
          </p>
          {user?.email ? (
            <p className="mt-3 text-sm text-text-muted/90">
              {t("checkoutPage.emailNote")}
            </p>
          ) : null}
        </div>
        <Link
          href={`/${locale}/cart`}
          className="text-sm font-medium text-accent-gold hover:text-accent-gold/85 transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          {t("checkoutPage.backToCart")}
        </Link>
      </header>

      <div className="grid gap-8 lg:gap-10 lg:grid-cols-[minmax(0,1fr)_min(100%,400px)] lg:items-start">
        <div className="order-2 lg:order-1 space-y-6 md:space-y-8 min-w-0">
          <section className="rounded-2xl border border-white/10 bg-[#1F2D26]/90 backdrop-blur-sm p-5 sm:p-7 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.22)]">
            <h2 className="text-lg md:text-xl font-semibold text-text-primary mb-5">
              {t("checkoutPage.shippingAddress")}
            </h2>
            {defaultAddress ? (
              <div className="text-sm space-y-2 leading-relaxed">
                <p className="font-semibold text-text-primary">
                  {defaultAddress.fullName}
                </p>
                <p className="text-text-muted">
                  {defaultAddress.addressLine1}
                  {defaultAddress.addressLine2
                    ? `, ${defaultAddress.addressLine2}`
                    : ""}
                </p>
                <p className="text-text-muted">
                  {defaultAddress.city} · {defaultAddress.postalCode}
                </p>
                <p className="text-text-muted">{defaultAddress.country}</p>
                <p className="text-text-muted">{defaultAddress.phone}</p>
              </div>
            ) : (
              <div className="space-y-5">
                <p className="text-sm text-text-muted">
                  {t("checkoutPage.addAddress")}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={guestAddress.fullName}
                    onChange={(event) =>
                      setGuestAddress((prev) => ({
                        ...prev,
                        fullName: event.target.value,
                      }))
                    }
                    type="text"
                    placeholder={t("checkoutPage.form.fullName")}
                    className={`${inputClass} sm:col-span-2`}
                  />
                  <input
                    value={guestAddress.phone}
                    onChange={(event) =>
                      setGuestAddress((prev) => ({
                        ...prev,
                        phone: event.target.value,
                      }))
                    }
                    type="tel"
                    placeholder={t("checkoutPage.form.phone")}
                    className={inputClass}
                  />
                  <input
                    value={guestAddress.addressLine1}
                    onChange={(event) =>
                      setGuestAddress((prev) => ({
                        ...prev,
                        addressLine1: event.target.value,
                      }))
                    }
                    type="text"
                    placeholder={t("checkoutPage.form.address")}
                    className={`${inputClass} sm:col-span-2`}
                  />
                  <input
                    value={guestAddress.city}
                    onChange={(event) =>
                      setGuestAddress((prev) => ({
                        ...prev,
                        city: event.target.value,
                      }))
                    }
                    type="text"
                    placeholder={t("checkoutPage.form.city")}
                    className={inputClass}
                  />
                  <input
                    value={guestAddress.postalCode}
                    onChange={(event) =>
                      setGuestAddress((prev) => ({
                        ...prev,
                        postalCode: event.target.value,
                      }))
                    }
                    type="text"
                    placeholder={t("checkoutPage.form.postalCode")}
                    className={inputClass}
                  />
                  <input
                    value={guestAddress.country}
                    onChange={(event) =>
                      setGuestAddress((prev) => ({
                        ...prev,
                        country: event.target.value,
                      }))
                    }
                    type="text"
                    placeholder={t("checkoutPage.form.country")}
                    className={`${inputClass} sm:col-span-2`}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      void (async () => {
                        const trimmed = {
                          ...guestAddress,
                          fullName: guestAddress.fullName.trim(),
                          phone: guestAddress.phone.trim(),
                          addressLine1: guestAddress.addressLine1.trim(),
                          city: guestAddress.city.trim(),
                          postalCode: guestAddress.postalCode.trim(),
                          country: guestAddress.country.trim(),
                        };
                        if (
                          !trimmed.fullName ||
                          !trimmed.phone ||
                          !trimmed.addressLine1 ||
                          !trimmed.city ||
                          !trimmed.postalCode ||
                          !trimmed.country
                        ) {
                          return;
                        }
                        const next: Address = {
                          ...trimmed,
                          id: "",
                          addressLine2: guestAddress.addressLine2?.trim() || "",
                          isDefault: true,
                        };
                        await upsertAddress(next);
                      })();
                    }}
                    className="inline-flex items-center justify-center rounded-xl bg-accent-gold px-5 py-3 text-sm font-semibold text-dark-base transition hover:bg-accent-gold/90 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1F2D26]"
                  >
                    {t("checkoutPage.saveAddress")}
                  </button>
                  <Link
                    href={`/${locale}/account`}
                    className="text-sm font-medium text-accent-gold/90 hover:text-accent-gold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/40 rounded-sm"
                  >
                    {t("checkoutPage.manageAddresses")}
                  </Link>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#1F2D26]/90 backdrop-blur-sm p-5 sm:p-7 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.22)]">
            <h2 className="text-lg md:text-xl font-semibold text-text-primary mb-5">
              {t("checkoutPage.paymentMethod")}
            </h2>
            <p className="text-sm text-text-muted mb-4">
              {t("checkoutPage.paypalOnlyHint")}
            </p>
            <div className="rounded-xl border border-accent-gold/30 bg-dark-base/70 px-4 py-3 text-xs text-text-muted leading-relaxed mb-4">
              <span className="font-semibold text-text-primary">PayPal · </span>
              {t("checkoutPage.paymentPayPalHighlight")}{" "}
              <span className="text-text-muted/95">
                {t("checkoutPage.trustPayPalProtection")}
              </span>
            </div>

            {defaultAddress ? (
              <PayPalButton
                amount={subtotal}
                currency="USD"
                onSuccess={handlePayPalSuccess}
                onError={handlePayPalError}
                onCancel={() => setIsLoading(false)}
              />
            ) : (
              <p className="text-sm text-text-muted">
                {t("checkoutPage.paypalNeedsAddress")}
              </p>
            )}
          </section>
        </div>

        <aside className="order-1 lg:order-2 lg:sticky lg:top-28 space-y-4 min-w-0">
          <div className="rounded-2xl border border-accent-gold/25 bg-gradient-to-b from-dark-surface to-dark-base p-5 sm:p-7 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.7)] overflow-x-hidden">
            <div className="flex flex-wrap gap-2 mb-6 text-[0.7rem] uppercase tracking-[0.12em] text-text-muted">
              <span className="rounded-full border border-white/15 px-2.5 py-1">
                {t("checkoutPage.trustSecureCheckout")}
              </span>
              <span className="rounded-full border border-white/15 px-2.5 py-1">
                PayPal
              </span>
              <span className="rounded-full border border-white/15 px-2.5 py-1">
                {t("checkoutPage.trustEasyReturns")}
              </span>
            </div>

            <h2 className="text-lg font-semibold text-text-primary mb-1">
              {t("checkoutPage.summary")}
            </h2>
            <p className="text-xs text-text-muted mb-6">
              {t("checkoutPage.lineItemsHeading")}
            </p>

            <ul className="space-y-5 mb-8 max-h-[min(50vh,420px)] overflow-y-auto pr-1 -mr-1">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 pb-5 border-b border-white/10 last:border-0 last:pb-0"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-dark-base ring-1 ring-white/10">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover object-center"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary leading-snug line-clamp-2">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      {t("checkoutPage.quantity")}: {item.quantity} ·{" "}
                      {formatPrice(item.price)} {t("checkoutPage.unitPrice")}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold tabular-nums text-text-primary">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between gap-4 text-text-muted">
                <span>{t("checkoutPage.subtotal")}</span>
                <span className="font-medium tabular-nums text-text-primary">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between gap-4 text-xs text-text-muted pt-2 border-t border-white/10">
                <span>{t("checkoutPage.shipping")}</span>
                <span>{t("checkoutPage.shippingCalculated")}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/15 mb-6">
              <div className="flex justify-between items-baseline gap-4">
                <span className="text-base font-semibold text-text-primary">
                  {t("checkoutPage.total")}
                </span>
                <span className="text-2xl font-semibold tabular-nums text-accent-gold">
                  {formatPrice(subtotal)}
                </span>
              </div>
            </div>

            <p className="text-[0.7rem] text-text-muted/90 leading-relaxed mb-6">
              {t("checkoutPage.summaryReassurance")}
            </p>

            <p className="text-[0.65rem] text-center text-text-muted leading-relaxed">
              {t("checkoutPage.terms")}
            </p>

            <Link
              href={`/${locale}/cart`}
              className="mt-6 block text-center text-sm font-medium text-accent-gold/90 hover:text-accent-gold transition-colors"
            >
              {t("checkoutPage.backToCart")}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
