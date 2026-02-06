"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useUser, type Order } from "@/context/UserContext";

type Address = {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export default function OrderSuccessPage() {
  const locale = useLocale();
  const { orders, lastOrderId } = useUser();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orders || orders.length === 0) return;
    const found = lastOrderId
      ? orders.find((entry) => entry.id === lastOrderId)
      : orders[0];
    if (found) setOrder(found);
  }, [orders, lastOrderId]);

  const formattedDate = useMemo(() => {
    if (!order?.date) return "";
    const date = new Date(order.date);
    return date.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [order?.date]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getNextSteps = () => {
    if (order?.paymentMethod === "whatsapp") {
      return [
        {
          icon: "💬",
          title: "Te contactaremos por WhatsApp",
          description: "En las próximas horas nos pondremos en contacto para coordinar el pago.",
        },
        {
          icon: "📦",
          title: "Prepararemos tu pedido",
          description: "Una vez confirmado el pago, comenzaremos a preparar tu envío.",
        },
        {
          icon: "🚚",
          title: "Te notificaremos el envío",
          description: "Recibirás un email con el número de seguimiento cuando tu pedido salga.",
        },
      ];
    }
    if (order?.paymentMethod === "paypal" && order?.status === "paid") {
      return [
        {
          icon: "✅",
          title: "Pago confirmado",
          description: "Tu pago ha sido procesado correctamente.",
        },
        {
          icon: "📦",
          title: "Preparando tu pedido",
          description: "Estamos preparando tu pedido para el envío.",
        },
        {
          icon: "🚚",
          title: "Te notificaremos el envío",
          description: "Recibirás un email con el número de seguimiento cuando tu pedido salga.",
        },
      ];
    }
    return [
      {
        icon: "📧",
        title: "Revisa tu email",
        description: "Te enviamos un email de confirmación con los detalles de tu pedido.",
      },
      {
        icon: "⏳",
        title: "Procesando tu pedido",
        description: "Estamos procesando tu pedido y te contactaremos pronto.",
      },
      {
        icon: "📦",
        title: "Preparación y envío",
        description: "Una vez confirmado, prepararemos tu pedido y te notificaremos cuando salga.",
      },
    ];
  };

  return (
    <main data-route="order-success" className="max-w-5xl mx-auto px-4 py-12 md:py-20">
      {/* Header con mensaje claro */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          ¡Pedido recibido!
        </h1>
        <p className="text-lg text-text-muted">
          Gracias por tu compra. Hemos recibido tu pedido y te enviaremos un email de confirmación en breve.
        </p>
        {order && (
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <span className="text-sm font-medium text-white">
              Número de pedido:
            </span>
            <span className="text-sm font-mono font-semibold text-accent-gold">
              {order.id}
            </span>
          </div>
        )}
      </div>

      {!order ? (
        <div className="mt-10 bg-white border border-gray-200 rounded-lg p-6 md:p-8 text-center">
          <p className="text-gray-600 mb-2">
            No encontramos información del pedido reciente.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Si acabas de realizar un pedido, puede tardar unos segundos en aparecer.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/${locale}/products`}
              className="inline-flex justify-center rounded-md bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-900 transition"
            >
              Seguir comprando
            </Link>
            <Link
              href={`/${locale}/account`}
              className="inline-flex justify-center rounded-md border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Ver mi cuenta
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Grid principal: Resumen y Dirección */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Resumen del pedido */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Resumen del pedido
              </h2>
              
              {order.paymentMethod === "whatsapp" && (
                <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
                  <p className="font-medium text-amber-800 mb-1">
                    💬 Pago pendiente
                  </p>
                  <p className="text-amber-700">
                    Te contactaremos por WhatsApp para finalizar el pago.
                  </p>
                </div>
              )}
              {(!order.paymentMethod || order.paymentMethod === "manual") && (
                <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm">
                  <p className="font-medium text-blue-800 mb-1">
                    ⏳ Procesando
                  </p>
                  <p className="text-blue-700">
                    Te contactaremos para finalizar el pago.
                  </p>
                </div>
              )}
              {order.paymentMethod === "paypal" && order.status === "paid" && (
                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm">
                  <p className="font-medium text-green-800 mb-1">
                    ✅ Pago confirmado
                  </p>
                  <p className="text-green-700">
                    Tu pago ha sido procesado correctamente.
                  </p>
                </div>
              )}

              <div className="space-y-4 mb-6">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        Cantidad: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900 whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-lg font-semibold text-gray-900 mb-3">
                  <span>Total</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {formattedDate && (
                  <p className="text-xs text-gray-500">
                    Pedido realizado el {formattedDate}
                  </p>
                )}
              </div>
            </div>

            {/* Dirección de envío */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Dirección de envío
              </h2>
              <div className="text-sm space-y-2 mb-6">
                <p className="font-semibold text-gray-900">
                  {order.address.fullName}
                </p>
                <p className="text-gray-600">
                  {order.address.addressLine1}
                  {order.address.addressLine2
                    ? `, ${order.address.addressLine2}`
                    : ""}
                </p>
                <p className="text-gray-600">
                  {order.address.city}, {order.address.postalCode}
                </p>
                <p className="text-gray-600">{order.address.country}</p>
                <p className="text-gray-600 mt-3">
                  📞 {order.address.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Qué sucede ahora */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              ¿Qué sucede ahora?
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {getNextSteps().map((step, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start p-4 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <div className="text-2xl mb-3">{step.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs secundarios */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/products`}
              className="inline-flex justify-center items-center rounded-md bg-black px-8 py-3 text-base font-semibold text-white hover:bg-gray-900 transition"
            >
              Seguir comprando
            </Link>
            <Link
              href={`/${locale}/account`}
              className="inline-flex justify-center items-center rounded-md border-2 border-gray-300 px-8 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition"
            >
              Ver mi cuenta
            </Link>
            {order.paymentMethod === "whatsapp" && (
              <Link
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Hola! Quiero coordinar el pago del pedido ${order.id} por ${formatPrice(
                    order.subtotal
                  )}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center rounded-md bg-green-600 px-8 py-3 text-base font-semibold text-white hover:bg-green-700 transition"
              >
                Contactar por WhatsApp
              </Link>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

