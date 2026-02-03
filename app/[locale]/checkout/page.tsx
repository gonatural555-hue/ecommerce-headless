"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState<
    {
      id: string;
      fullName: string;
      phone: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      postalCode: string;
      country: string;
      isDefault: boolean;
    }[]
  >([]);

  const defaultAddress =
    addresses.find((address) => address.isDefault) || addresses[0];

  useEffect(() => {
    const stored = localStorage.getItem("user_addresses");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setAddresses(parsed);
      }
    } catch {
      localStorage.removeItem("user_addresses");
    }
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
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
    };

    try {
      const stored = localStorage.getItem("orders");
      const parsed = stored ? (JSON.parse(stored) as typeof order[]) : [];
      const nextOrders = Array.isArray(parsed) ? parsed : [];
      nextOrders.unshift(order);
      localStorage.setItem("orders", JSON.stringify(nextOrders));
      localStorage.setItem("last_order_id", orderId);
    } catch {
      // no-op
    }

    clearCart();
    router.push(`/${locale}/order-success`);
  };

  if (items.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tu carrito está vacío
          </h1>
          <p className="text-gray-600 mb-8">
            Agregá productos para continuar con tu compra.
          </p>
          <Link
            href={`/${locale}/products`}
            className="inline-flex justify-center rounded-md bg-black px-8 py-4 text-base font-medium text-white hover:bg-gray-900 transition"
          >
            Ver productos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 md:py-12">
      {/* Header */}
      <div className="mb-8">
          <Link
            href={`/${locale}/cart`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition mb-4"
        >
          ← Volver al carrito
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Checkout
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Resumen del pedido - Mobile first: aparece primero en mobile */}
        <div className="lg:col-span-2 order-2 lg:order-1 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              Dirección de envío
            </h2>
            {!defaultAddress ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Agregá una dirección para continuar
                </p>
                <Link
                  href={`/${locale}/account`}
                  className="inline-flex items-center justify-center rounded-md bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-900 transition"
                >
                  Agregar dirección
                </Link>
              </div>
            ) : (
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
            )}
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
              Resumen del pedido
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
                      <span>Cantidad: {item.quantity}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">
                        {formatPrice(item.price)} c/u
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
              Resumen
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-base text-gray-700">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 pt-2 border-t border-gray-300">
                <span>Envío</span>
                <span>Calculado al finalizar</span>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-gray-300 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Total
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
              {isLoading ? "Confirmando..." : "Confirmar pedido"}
            </button>

            <p className="mt-4 text-xs text-center text-gray-500">
              Al confirmar tu pedido, aceptás nuestros términos y condiciones
            </p>

            <Link
              href={`/${locale}/cart`}
              className="block mt-6 text-center text-sm text-gray-600 hover:text-gray-900 underline transition"
            >
              Volver al carrito
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

