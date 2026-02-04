"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { useUser, type Address } from "@/context/UserContext";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const { user, addresses, setAddresses, addOrder } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "manual" | "whatsapp" | "paypal_pending"
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

  if (items.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("checkoutPage.emptyTitle")}
          </h1>
          <p className="text-gray-600 mb-8">
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
    <main className="max-w-6xl mx-auto px-4 pt-28 pb-8 md:pt-32 md:pb-12">
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

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Resumen del pedido - Mobile first: aparece primero en mobile */}
        <div className="lg:col-span-2 order-2 lg:order-1 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              {t("checkoutPage.shippingAddress")}
            </h2>
            {defaultAddress ? (
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-semibold text-gray-900">
                  {defaultAddress.fullName}
                </p>
                <p>
                  {defaultAddress.addressLine1}
                  {defaultAddress.addressLine2
                    ? `, ${defaultAddress.addressLine2}`
                    : ""}
                </p>
                <p>
                  {defaultAddress.city} · {defaultAddress.postalCode}
                </p>
                <p>{defaultAddress.country}</p>
                <p>{defaultAddress.phone}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
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
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
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
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
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
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm sm:col-span-2"
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
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
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
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
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
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm sm:col-span-2"
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
                    className="text-sm text-gray-600 hover:text-gray-900 underline transition"
                  >
                    {t("checkoutPage.manageAddresses")}
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
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
                  value: "paypal_pending",
                  label: t("checkoutPage.paymentOptions.paypal_pending.label"),
                  hint: t("checkoutPage.paymentOptions.paypal_pending.hint"),
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-start gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 transition-colors hover:border-gray-300"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.value}
                    checked={paymentMethod === option.value}
                    onChange={() =>
                      setPaymentMethod(
                        option.value as "manual" | "whatsapp" | "paypal_pending"
                      )
                    }
                    className="mt-1 h-4 w-4"
                  />
                  <span className="space-y-1">
                    <span className="block font-semibold text-gray-900">
                      {option.label}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {option.hint}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
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
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
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
          <div className="bg-gray-50 rounded-lg p-6 md:p-8 lg:sticky lg:top-4 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t("checkoutPage.summary")}
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-base text-gray-700">
                <span>{t("checkoutPage.subtotal")}</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 pt-2 border-t border-gray-300">
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

            <button
              onClick={handleConfirmOrder}
              disabled={isLoading || !defaultAddress}
              className="w-full rounded-md bg-black px-6 py-4 text-base font-medium text-white hover:bg-gray-900 transition focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t("checkoutPage.confirming") : t("checkoutPage.confirmOrder")}
            </button>

            <p className="mt-4 text-xs text-center text-gray-500">
              {t("checkoutPage.terms")}
            </p>

            <Link
              href={`/${locale}/cart`}
              className="block mt-6 text-center text-sm text-gray-600 hover:text-gray-900 underline transition"
            >
              {t("checkoutPage.backToCart")}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

