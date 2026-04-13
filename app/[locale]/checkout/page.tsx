"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { useUser, type Address, type Order } from "@/context/UserContext";
import PayPalButton from "@/components/PayPalButton";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const { user, addresses, setAddresses, addOrder } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "manual" | "whatsapp" | "paypal"
  >("manual");

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

  const handleConfirmOrder = () => {
    if (items.length === 0 || !defaultAddress) return;

    if (paymentMethod === "paypal") {
      return;
    }

    setIsLoading(true);

    const orderId = `order_${Date.now()}`;
    const order = {
      id: orderId,
      items,
      subtotal,
      address: defaultAddress,
      date: new Date().toISOString(),
      status: "pending_payment",
      paymentMethod,
    };

    addOrder(order);

    clearCart();
    router.push(`/${locale}/order-success`);
  };

  const handlePayPalSuccess = async (details: any) => {
    if (items.length === 0 || !defaultAddress) return;

    setIsLoading(true);

    const orderId = `order_${Date.now()}`;

    try {
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
      };

      console.log("[Checkout] Enviando orden PayPal al backend", payload);

      const response = await fetch("/api/orders/paypal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      console.log("[Checkout] Respuesta backend /api/orders/paypal", {
        ok: response.ok,
        status: response.status,
        body: data,
      });

      if (!response.ok || !data?.success) {
        console.error(
          "[Checkout] Falló creación de orden en backend, continuando sin Sheets",
          {
            status: response.status,
            body: data,
          }
        );
      }
    } catch (error) {
      console.error(
        "[Checkout] Error llamando a /api/orders/paypal, continuando sin Sheets",
        error
      );
    }

    const order: Order = {
      id: orderId,
      items,
      subtotal,
      address: defaultAddress,
      date: new Date().toISOString(),
      status: "paid",
      paymentMethod: "paypal" as const,
      paypalOrderId: details.id,
    };

    addOrder(order);

    clearCart();
    router.push(`/${locale}/order-success`);
  };

  const handlePayPalError = (error: any) => {
    console.error("PayPal payment error:", error);
    setIsLoading(false);
  };

  const inputClass =
    "w-full rounded-lg border border-white/15 bg-dark-base/50 px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted/60 transition focus:border-accent-gold focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus-visible:border-accent-gold focus-visible:ring-2 focus-visible:ring-accent-gold/35 max-w-full";

  const showMobilePayDock =
    paymentMethod !== "paypal" && Boolean(defaultAddress) && items.length > 0;

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

  return (
    <main
      data-route="checkout"
      className={`max-w-6xl mx-auto px-3 sm:px-4 pt-28 md:pt-32 min-h-[100dvh] md:min-h-0 overflow-x-hidden ${
        showMobilePayDock ? "pb-28 md:pb-12" : "pb-12"
      }`}
    >
      <header className="mb-8 md:mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <h1 className="text-3xl md:text-4xl font-semibold text-text-primary tracking-tight">
            {t("checkoutPage.title")}
          </h1>
          <p className="mt-2 text-text-muted text-sm md:text-base leading-relaxed">
            {t("checkoutPage.subtitle")}
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
        {/* Left: shipping & payment */}
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
                        id: `addr_${Date.now()}`,
                        isDefault: true,
                      };
                      setAddresses([next]);
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
            <div className="space-y-3">
              {[
                {
                  value: "manual",
                  label: t("checkoutPage.paymentOptions.manual.label"),
                  hint: t("checkoutPage.paymentOptions.manual.hint"),
                },
                {
                  value: "whatsapp",
                  label: t("checkoutPage.paymentOptions.whatsapp.label"),
                  hint: t("checkoutPage.paymentOptions.whatsapp.hint"),
                },
                {
                  value: "paypal",
                  label: t("checkoutPage.paymentOptions.paypal.label"),
                  hint: t("checkoutPage.paymentOptions.paypal.hint"),
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 rounded-xl border px-4 py-3.5 text-sm transition-all cursor-pointer ${
                    paymentMethod === option.value
                      ? "border-accent-gold/55 bg-accent-gold/10 ring-1 ring-accent-gold/30"
                      : "border-white/12 bg-dark-base/30 hover:border-white/25 hover:bg-white/[0.05]"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.value}
                    checked={paymentMethod === option.value}
                    onChange={() =>
                      setPaymentMethod(
                        option.value as "manual" | "whatsapp" | "paypal"
                      )
                    }
                    className="mt-1 h-4 w-4 shrink-0 border-white/35 bg-dark-base/80 text-accent-gold focus:outline-none focus:ring-2 focus:ring-accent-gold/35 focus:ring-offset-0 focus:ring-offset-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/45"
                  />
                  <span className="space-y-1 min-w-0">
                    <span className="block font-semibold text-text-primary">
                      {option.label}
                    </span>
                    <span className="block text-xs text-text-muted leading-relaxed">
                      {option.hint}
                    </span>
                  </span>
                </label>
              ))}

              {paymentMethod === "paypal" ? (
                <div className="mt-4 rounded-xl border border-accent-gold/30 bg-dark-base/70 px-4 py-3 text-xs text-text-muted leading-relaxed">
                  <span className="font-semibold text-text-primary">
                    PayPal ·{" "}
                  </span>
                  {t("checkoutPage.paymentPayPalHighlight")}{" "}
                  <span className="text-text-muted/95">
                    {t("checkoutPage.trustPayPalProtection")}
                  </span>
                </div>
              ) : null}

              {paymentMethod === "paypal" && defaultAddress && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <PayPalButton
                    amount={subtotal}
                    currency="USD"
                    onSuccess={handlePayPalSuccess}
                    onError={handlePayPalError}
                    onCancel={() => setIsLoading(false)}
                  />
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right: order summary */}
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

            {paymentMethod !== "paypal" && (
              <button
                type="button"
                onClick={handleConfirmOrder}
                disabled={isLoading || !defaultAddress}
                className="hidden lg:flex w-full rounded-xl bg-accent-gold px-6 py-4 text-sm font-semibold text-dark-base justify-center items-center shadow-lg shadow-accent-gold/25 transition hover:bg-accent-gold/90 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 motion-reduce:transform-none focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2 focus:ring-offset-dark-base"
              >
                {isLoading
                  ? t("checkoutPage.confirming")
                  : t("checkoutPage.confirmOrder")}
              </button>
            )}

            <p className="mt-4 text-[0.65rem] text-center text-text-muted leading-relaxed">
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

      {/* Mobile payment dock — non-PayPal flows */}
      {showMobilePayDock ? (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-dark-base/95 backdrop-blur-md px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-12px_40px_rgba(0,0,0,0.45)]">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[0.65rem] uppercase tracking-wider text-text-muted">
                {t("checkoutPage.total")}
              </p>
              <p className="text-lg font-semibold tabular-nums text-accent-gold truncate">
                {formatPrice(subtotal)}
              </p>
              <p className="text-[0.65rem] text-text-muted mt-0.5 line-clamp-2">
                {t("checkoutPage.mobileStickyHint")}
              </p>
            </div>
            <button
              type="button"
              onClick={handleConfirmOrder}
              disabled={isLoading || !defaultAddress}
              className="shrink-0 rounded-xl bg-accent-gold px-5 py-3.5 text-sm font-semibold text-dark-base shadow-lg shadow-accent-gold/20 transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? t("checkoutPage.confirming")
                : t("checkoutPage.confirmOrder")}
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
