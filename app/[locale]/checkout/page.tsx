"use client";

import Link from "next/link";
import SmartImage from "@/components/SmartImage";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { useCurrency } from "@/context/CurrencyContext";
import UsdChargeNotice from "@/components/currency/UsdChargeNotice";
import { useUser, type Address, type Order } from "@/context/UserContext";
import PayPalButton from "@/components/PayPalButton";
import { isSupabaseConfigured } from "@/lib/supabase/browser";
import {
  cartLineToGa4Item,
  trackBeginCheckout,
  trackPurchase,
} from "@/lib/analytics/ga4";

function trimAddress(addr: Address): Address {
  return {
    ...addr,
    fullName: addr.fullName.trim(),
    phone: addr.phone.trim(),
    addressLine1: addr.addressLine1.trim(),
    addressLine2: addr.addressLine2?.trim() || "",
    city: addr.city.trim(),
    postalCode: addr.postalCode.trim(),
    country: addr.country.trim(),
  };
}

function isAddressComplete(addr: Address): boolean {
  const t = trimAddress(addr);
  return Boolean(
    t.fullName &&
      t.phone &&
      t.addressLine1 &&
      t.city &&
      t.postalCode &&
      t.country
  );
}

const inputClass =
  "max-w-full rounded-lg border border-earth-brown/22 bg-white px-3 py-2.5 text-sm text-dark-base placeholder:text-muted-gray/65 transition focus:border-accent-gold focus:outline-none focus:ring-2 focus:ring-accent-gold/25 focus-visible:border-accent-gold focus-visible:ring-2 focus-visible:ring-accent-gold/30";

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
    refreshOrders,
    authLoading,
    isLoggedIn,
  } = useUser();
  const { formatMoney } = useCurrency();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
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

  const savedAddress =
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

  useEffect(() => {
    if (user?.name && !savedAddress) {
      setGuestAddress((prev) =>
        prev.fullName ? prev : { ...prev, fullName: user.name || "" }
      );
    }
  }, [user?.name, savedAddress]);

  const draftAddress = useMemo(() => {
    if (savedAddress) return savedAddress;
    if (isAddressComplete(guestAddress)) return trimAddress(guestAddress);
    return null;
  }, [savedAddress, guestAddress]);

  const formatPrice = (price: number) => formatMoney(price);

  const ensureAddressSaved = async (): Promise<Address | null> => {
    if (savedAddress) return savedAddress;
    if (!isAddressComplete(guestAddress)) return null;

    const next: Address = {
      ...trimAddress(guestAddress),
      id: "",
      isDefault: true,
    };

    const saved = await upsertAddress(next);
    return saved ?? next;
  };

  const handlePayPalSuccess = async (details: { id?: string }) => {
    if (items.length === 0) return;

    setIsLoading(true);
    setPaymentError(null);

    const shippingAddress = await ensureAddressSaved();
    if (!shippingAddress) {
      setPaymentError(t("checkoutPage.paypalNeedsAddress"));
      setIsLoading(false);
      return;
    }

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
        shippingAddress: {
          id: shippingAddress.id,
          fullName: shippingAddress.fullName,
          phone: shippingAddress.phone,
          addressLine1: shippingAddress.addressLine1,
          addressLine2: shippingAddress.addressLine2,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
          isDefault: true,
        },
      };

      const response = await fetch("/api/orders/paypal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        console.error("[Checkout] Error API PayPal", {
          status: response.status,
          body: data,
        });
        setPaymentError(
          typeof data?.error === "string"
            ? data.error
            : t("checkoutPage.paymentFailed")
        );
        setIsLoading(false);
        return;
      }

      await refreshOrders();

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
        address: shippingAddress,
        date: new Date().toISOString(),
        status: "paid",
        paymentMethod: "paypal",
        paypalOrderId: details.id,
      };

      addOrder(order);
      clearCart();
      router.push(`/${locale}/order-success`);
    } catch (error) {
      console.error("[Checkout] Error llamando a /api/orders/paypal", error);
      setPaymentError(t("checkoutPage.paymentFailed"));
      setIsLoading(false);
    }
  };

  const handlePayPalError = (error: unknown) => {
    console.error("PayPal payment error:", error);
    setPaymentError(t("checkoutPage.paymentFailed"));
    setIsLoading(false);
  };

  if (items.length === 0) {
    return (
      <main
        data-route="checkout"
        className="mx-auto max-w-xl bg-gn-page-bg px-4 py-20 text-center md:py-28"
      >
        <p className="mb-4 text-[0.65rem] uppercase tracking-[0.28em] text-accent-gold/90">
          Checkout
        </p>
        <h1 className="font-sans mb-4 text-3xl font-semibold tracking-tight text-dark-base md:text-4xl">
          {t("checkoutPage.emptyTitle")}
        </h1>
        <p className="mb-10 leading-relaxed text-muted-gray">
          {t("checkoutPage.emptyText")}
        </p>
        <Link
          href={`/${locale}/products`}
          className="inline-flex justify-center rounded-lg bg-accent-gold px-8 py-3.5 text-sm font-semibold text-dark-base shadow-lg shadow-accent-gold/20 transition hover:bg-accent-gold/90 active:scale-[0.98]"
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
        className="mx-auto max-w-xl bg-gn-page-bg px-4 py-24 text-center"
      >
        <p className="text-muted-gray">{t("checkoutPage.supabaseMissing")}</p>
      </main>
    );
  }

  if (authLoading) {
    return (
      <main
        data-route="checkout"
        className="mx-auto max-w-xl bg-gn-page-bg px-4 py-24 text-center"
      >
        <p className="text-muted-gray">{t("checkoutPage.loadingAuth")}</p>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main
        data-route="checkout"
        className="mx-auto max-w-xl bg-gn-page-bg px-4 py-24 text-center"
      >
        <p className="mb-6 text-muted-gray">{t("checkoutPage.loginRequired")}</p>
        <Link
          href={`/${locale}/auth?redirect=/${locale}/checkout`}
          className="inline-flex rounded-lg bg-accent-gold px-6 py-3 text-sm font-semibold text-dark-base shadow-lg shadow-accent-gold/20 transition hover:bg-accent-gold/90"
        >
          {t("checkoutPage.goToLogin")}
        </Link>
      </main>
    );
  }

  return (
    <main
      data-route="checkout"
      className="mx-auto max-w-7xl bg-gn-page-bg px-4 pb-16 pt-28 sm:px-6 md:pb-20 md:pt-32 lg:px-8"
    >
      <header className="mb-10 max-w-2xl md:mb-12">
        <p className="mb-3 text-[0.65rem] uppercase tracking-[0.28em] text-accent-gold/90">
          Go Natural
        </p>
        <h1 className="font-sans mb-3 text-3xl font-semibold tracking-tight text-dark-base md:text-4xl">
          {t("checkoutPage.title")}
        </h1>
        <p className="text-base leading-relaxed text-muted-gray md:text-lg">
          {t("checkoutPage.subtitlePayPalOnly")}
        </p>
        {user?.email ? (
          <p className="mt-3 text-sm text-muted-gray">
            {t("checkoutPage.emailNote")}
          </p>
        ) : null}
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_min(100%,380px)] lg:items-start lg:gap-10">
        <div className="order-2 min-w-0 space-y-8 lg:order-1">
          <section className="rounded-2xl border border-earth-brown/15 bg-soft-stone p-5 shadow-[0_10px_36px_-18px_rgba(17,23,19,0.12)] md:p-6">
            <h2 className="mb-5 text-lg font-semibold text-dark-base md:text-xl">
              {t("checkoutPage.shippingAddress")}
            </h2>
            {savedAddress ? (
              <div className="space-y-2 text-sm leading-relaxed">
                <p className="font-semibold text-dark-base">
                  {savedAddress.fullName}
                </p>
                <p className="text-muted-gray">
                  {savedAddress.addressLine1}
                  {savedAddress.addressLine2
                    ? `, ${savedAddress.addressLine2}`
                    : ""}
                </p>
                <p className="text-muted-gray">
                  {savedAddress.city} · {savedAddress.postalCode}
                </p>
                <p className="text-muted-gray">{savedAddress.country}</p>
                <p className="text-muted-gray">{savedAddress.phone}</p>
                <Link
                  href={`/${locale}/account`}
                  className="mt-4 inline-block text-sm font-medium text-accent-gold/90 underline-offset-4 hover:text-accent-gold hover:underline"
                >
                  {t("checkoutPage.manageAddresses")}
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                <p className="text-sm text-muted-gray">
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
                <p className="text-xs leading-relaxed text-muted-gray">
                  {t("checkoutPage.addressDefaultHint")}
                </p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-earth-brown/15 bg-soft-stone p-5 shadow-[0_10px_36px_-18px_rgba(17,23,19,0.12)] md:p-6">
            <h2 className="mb-5 text-lg font-semibold text-dark-base md:text-xl">
              {t("checkoutPage.paymentMethod")}
            </h2>
            <p className="mb-4 text-sm text-muted-gray">
              {t("checkoutPage.paypalOnlyHint")}
            </p>

            <UsdChargeNotice amountUsd={subtotal} className="mb-5" />

            <div className="mb-5 rounded-xl border border-earth-brown/15 bg-warm-sand/70 px-4 py-3 text-xs leading-relaxed text-muted-gray">
              <span className="font-semibold text-dark-base">PayPal · </span>
              {t("checkoutPage.paymentPayPalHighlight")}{" "}
              <span>{t("checkoutPage.trustPayPalProtection")}</span>
            </div>

            {paymentError ? (
              <p className="mb-4 text-sm text-red-700" role="alert">
                {paymentError}
              </p>
            ) : null}

            {draftAddress ? (
              <div className={isLoading ? "pointer-events-none opacity-60" : ""}>
                <PayPalButton
                  amount={subtotal}
                  currency="USD"
                  onSuccess={handlePayPalSuccess}
                  onError={handlePayPalError}
                  onCancel={() => setIsLoading(false)}
                />
              </div>
            ) : (
              <p className="text-sm text-muted-gray">
                {t("checkoutPage.paypalNeedsAddress")}
              </p>
            )}
          </section>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-gray sm:justify-start md:text-sm">
            <span className="inline-flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full bg-accent-gold"
                aria-hidden
              />
              {t("checkoutPage.trustSecureCheckout")}
            </span>
            <span className="hidden text-earth-brown/35 sm:inline" aria-hidden>
              ·
            </span>
            <span>{t("cartPage.trustPayPal")}</span>
            <span className="hidden text-earth-brown/35 sm:inline" aria-hidden>
              ·
            </span>
            <span>{t("checkoutPage.trustEasyReturns")}</span>
          </div>
        </div>

        <aside className="order-1 min-w-0 space-y-6 lg:sticky lg:top-28 lg:order-2">
          <div className="overflow-x-hidden rounded-2xl border border-earth-brown/18 bg-soft-stone p-6 shadow-[0_20px_56px_-28px_rgba(17,23,19,0.18)] md:p-8">
            <h2 className="mb-6 text-lg font-semibold text-dark-base">
              {t("checkoutPage.summary")}
            </h2>

            <ul className="-mr-1 mb-6 max-h-[min(50vh,420px)] space-y-5 overflow-y-auto pr-1">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 border-b border-earth-brown/12 pb-5 last:border-0 last:pb-0"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-warm-sand ring-1 ring-earth-brown/15">
                    {item.image ? (
                      <SmartImage
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover object-center"
                        sizes="64px"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold leading-snug text-dark-base">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-gray">
                      {t("checkoutPage.quantity")}: {item.quantity} ·{" "}
                      {formatPrice(item.price)} {t("checkoutPage.unitPrice")}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold tabular-nums text-dark-base">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mb-6 space-y-4">
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="text-muted-gray">
                  {t("checkoutPage.subtotal")}
                </span>
                <span className="font-semibold tabular-nums text-dark-base">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-earth-brown/15 pt-4 text-xs text-muted-gray">
                <span>{t("checkoutPage.shipping")}</span>
                <span>{t("checkoutPage.shippingFree")}</span>
              </div>
              <p className="text-xs font-medium text-accent-gold/95">
                {t("cartPage.freeShippingAlways")}
              </p>
            </div>

            <UsdChargeNotice amountUsd={subtotal} variant="compact" className="mb-6" />

            <div className="border-t border-earth-brown/15 pt-2">
              <div className="mb-2 flex items-baseline justify-between gap-4">
                <span className="text-base font-semibold text-dark-base">
                  {t("checkoutPage.total")}
                </span>
                <span className="text-2xl font-semibold tabular-nums text-accent-gold">
                  {formatPrice(subtotal)}
                </span>
              </div>
            </div>

            <Link
              href={`/${locale}/cart`}
              className="mt-6 block text-center text-sm font-medium text-accent-gold/90 transition-colors hover:text-accent-gold"
            >
              {t("checkoutPage.backToCart")}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
