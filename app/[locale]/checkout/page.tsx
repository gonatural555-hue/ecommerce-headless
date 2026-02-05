"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
    return new Intl.NumberFormat(locale === "es" ? "es-AR" : locale === "fr" ? "fr-FR" : locale === "it" ? "it-IT" : "en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleConfirmOrder = () => {
    if (items.length === 0 || !defaultAddress) return;

    // Si el método de pago es PayPal, no procesamos aquí, se maneja en PayPalButton
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

  const handlePayPalSuccess = (details: any) => {
    if (items.length === 0 || !defaultAddress) return;

    setIsLoading(true);

    const orderId = `order_${Date.now()}`;
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
    // Aquí podrías mostrar un mensaje de error al usuario
  };

  if (items.length === 0) {
    return (
      <main data-route="checkout" className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("checkoutPage.emptyTitle")}
          </h1>
          <p className="text-accent-gold mb-8">
            {t("checkoutPage.emptyText")}
          </p>
          <Link
            href={`/${locale}/products`}
            className="inline-flex justify-center rounded-md bg-black px-8 py-4 text-base font-medium text-white hover:bg-gray-900 transition"
          >
            {t("checkoutPage.emptyCta")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main data-route="checkout" className="max-w-6xl mx-auto px-3 sm:px-4 pt-28 pb-8 md:pt-32 md:pb-12 min-h-[100dvh] md:min-h-0">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {t("checkoutPage.title")}
          </h1>
        <Link
            href={`/${locale}/cart`}
            className="inline-flex items-center text-base text-white hover:text-accent-gold transition-colors duration-200 whitespace-nowrap"
        >
            {t("checkoutPage.backToCart")}
        </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 overflow-x-hidden">
        {/* Resumen del pedido - Mobile first: aparece primero en mobile */}
        <div className="lg:col-span-2 order-2 lg:order-1 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 md:p-8 overflow-x-hidden">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              {t("checkoutPage.shippingAddress")}
            </h2>
            {defaultAddress ? (
              <div className="text-sm space-y-1">
                <p className="font-semibold text-gray-900">
                  {defaultAddress.fullName}
                </p>
                <p className="text-accent-gold">
                  {defaultAddress.addressLine1}
                  {defaultAddress.addressLine2
                    ? `, ${defaultAddress.addressLine2}`
                    : ""}
                </p>
                <p className="text-accent-gold">
                  {defaultAddress.city} · {defaultAddress.postalCode}
                </p>
                <p className="text-accent-gold">{defaultAddress.country}</p>
                <p className="text-accent-gold">{defaultAddress.phone}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-accent-gold">
                  {t("checkoutPage.addAddress")}
                </p>
                <div className="grid gap-3 sm:grid-cols-2 overflow-x-hidden">
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
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm max-w-full"
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
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm max-w-full"
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
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm sm:col-span-2 max-w-full"
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
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm max-w-full"
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
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm max-w-full"
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
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm sm:col-span-2 max-w-full"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3">
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
                    className="inline-flex items-center justify-center rounded-md bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-900 transition"
                  >
                    {t("checkoutPage.saveAddress")}
                  </button>
                  <Link
                    href={`/${locale}/account`}
                    className="text-sm text-accent-gold hover:text-accent-gold/80 underline transition"
                  >
                    {t("checkoutPage.manageAddresses")}
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 md:p-8 overflow-x-hidden">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
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
                  className="flex items-start gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm transition-colors hover:border-gray-300"
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
                    className="mt-1 h-4 w-4"
                  />
                  <span className="space-y-1">
                    <span className="block font-semibold text-gray-900">
                      {option.label}
                    </span>
                    <span className="block text-xs text-accent-gold">
                      {option.hint}
                    </span>
                  </span>
                </label>
              ))}
              {/* Mostrar botón de PayPal cuando se seleccione PayPal */}
              {paymentMethod === "paypal" && defaultAddress && (
                <div className="mt-4 pt-4 border-t border-gray-200">
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
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 md:p-8 overflow-x-hidden">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
              {t("checkoutPage.orderSummary")}
            </h2>

            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-6 border-b border-gray-200 last:border-0 last:pb-0"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 truncate">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-accent-gold">
                      <span>{t("checkoutPage.quantity")}: {item.quantity}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">
                        {formatPrice(item.price)} {t("checkoutPage.unitPrice")}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-base md:text-lg font-semibold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel de pago - Sticky en desktop */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 md:p-8 lg:sticky lg:top-4 border border-gray-200 overflow-x-hidden">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t("checkoutPage.summary")}
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-base">
                <span className="text-accent-gold">{t("checkoutPage.subtotal")}</span>
                <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-accent-gold pt-2 border-t border-gray-300">
                <span>{t("checkoutPage.shipping")}</span>
                <span>{t("checkoutPage.shippingCalculated")}</span>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-gray-300 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  {t("checkoutPage.total")}
                </span>
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
            </div>

            {paymentMethod !== "paypal" && (
              <button
                onClick={handleConfirmOrder}
                disabled={isLoading || !defaultAddress}
                className="w-full rounded-md bg-black px-6 py-4 text-base font-medium text-white hover:bg-gray-900 transition focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t("checkoutPage.confirming") : t("checkoutPage.confirmOrder")}
              </button>
            )}

            <p className="mt-4 text-xs text-center text-accent-gold">
              {t("checkoutPage.terms")}
            </p>

            <Link
              href={`/${locale}/cart`}
              className="block mt-6 text-center text-sm text-accent-gold hover:text-accent-gold/80 underline transition"
            >
              {t("checkoutPage.backToCart")}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

