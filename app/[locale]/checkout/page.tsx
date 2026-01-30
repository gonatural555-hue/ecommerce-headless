"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handlePayment = async () => {
    if (items.length === 0) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear sesión de pago");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No se recibió URL de redirección");
      }
    } catch (error) {
      console.error("Error en checkout:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Error al procesar el pago. Por favor, intentá nuevamente."
      );
      setIsLoading(false);
    }
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
            href="/products"
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
          href="/cart"
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
        <div className="lg:col-span-2 order-2 lg:order-1">
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
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full rounded-md bg-black px-6 py-4 text-base font-medium text-white hover:bg-gray-900 transition focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Procesando..." : "Pagar ahora"}
            </button>

            <p className="mt-4 text-xs text-center text-gray-500">
              Al hacer clic en "Pagar", aceptás nuestros términos y condiciones
            </p>

            <Link
              href="/cart"
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

