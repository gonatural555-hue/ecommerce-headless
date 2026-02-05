"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";

export default function CartPage() {
  const { items, subtotal, increaseQty, decreaseQty, removeItem } = useCart();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

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
      <main data-route="cart" className="relative w-full overflow-hidden pt-28 pb-12 md:pt-32 md:pb-20">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/hero/emptycart.webp"
            alt="Carrito vacío"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white-900 mb-4">
            {t("cartPage.emptyTitle")}
          </h1>
          <p className="text-white-600 mb-8">{t("cartPage.emptyText")}</p>
          <Link
            href={`/${locale}/products`}
            className="inline-flex justify-center rounded-md bg-white px-8 py-4 text-base font-medium text-black hover:bg-gray-900 transition-colors duration-200"
          >
            {t("cartPage.emptyCta")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main data-route="cart" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8 md:pt-32 md:pb-12">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
        {t("cartPage.title")}
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Lista de productos */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {items.map((item) => {
                const itemSubtotal = item.price * item.quantity;
                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {item.image ? (
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-md border border-gray-200 bg-gray-50" />
                  )}
                      {/* Información del producto */}
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h2>
                        <p className="text-base text-gray-600 mb-4">
                          {t("cartPage.unitPrice")}: {formatPrice(item.price)}
                          {formatVariantSummary(item)
                            ? ` · ${formatVariantSummary(item)}`
                            : ""}
                        </p>

                        {/* Controles de cantidad y acciones */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          {/* Controles de cantidad */}
                          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                            <button
                              onClick={() => decreaseQty(item.id)}
                              className="px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-150 font-medium text-lg"
                              aria-label={t("cartPage.decreaseQty")}
                            >
                              −
                            </button>
                            <span className="px-4 sm:px-6 py-2 text-gray-900 font-semibold min-w-[3.5rem] text-center border-x border-gray-300 bg-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increaseQty(item.id)}
                              className="px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-150 font-medium text-lg"
                              aria-label={t("cartPage.increaseQty")}
                            >
                              +
                            </button>
                          </div>

                          {/* Botón eliminar */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-sm text-red-600 hover:text-red-700 font-medium underline transition-colors duration-150"
                            aria-label={t("cartPage.remove")}
                          >
                            {t("cartPage.remove")}
                          </button>
                        </div>
                      </div>

                      {/* Subtotal del item */}
                      <div className="flex sm:flex-col justify-between sm:justify-start items-end sm:items-end gap-2 sm:gap-1">
                        <div className="text-right sm:text-right">
                          <p className="text-sm text-gray-500 sm:mb-1">
                            {t("cartPage.itemSubtotal")}
                          </p>
                          <p className="text-lg sm:text-xl font-bold text-gray-900">
                            {formatPrice(itemSubtotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Resumen lateral */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t("cartPage.summaryTitle")}
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-gray-700">
                <span className="text-base">{t("cartPage.summarySubtotal")}</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="pt-4 border-t border-gray-300">
                <p className="text-sm text-gray-600 mb-2">
                  {t("cartPage.summaryNote")}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-300">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-gray-900">
                  {t("cartPage.summaryTotal")}
                </span>
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full rounded-md bg-black px-6 py-4 text-base font-medium text-white hover:bg-gray-900 active:bg-gray-800 transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                {t("cartPage.checkout")}
              </button>

              <Link
                href={`/${locale}/products`}
                className="block mt-4 text-center text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-150"
              >
                {t("cartPage.continueShopping")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
