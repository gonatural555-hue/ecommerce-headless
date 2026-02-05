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

  return (
    <main data-route="order-success" className="max-w-5xl mx-auto px-4 py-12 md:py-20">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Pedido confirmado
        </h1>
        <p className="mt-3 text-text-muted">
          Gracias por tu compra. Te vamos a avisar cuando tu pedido esté en
          camino.
        </p>
      </div>

      {!order ? (
        <div className="mt-10 bg-white border border-gray-200 rounded-lg p-6 md:p-8 text-center">
          <p className="text-accent-gold">
            No encontramos información del pedido reciente.
          </p>
          <Link
            href={`/${locale}/products`}
            className="inline-flex mt-6 justify-center rounded-md bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-900 transition"
          >
            Volver a la tienda
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Resumen del pedido
            </h2>
            <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-accent-gold">
              {order.paymentMethod === "whatsapp" && (
                <span>Te contactaremos por WhatsApp para finalizar el pago.</span>
              )}
              {(!order.paymentMethod || order.paymentMethod === "manual") && (
                <span>Te contactaremos para finalizar el pago.</span>
              )}
            </div>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <p className="text-xs text-accent-gold">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-gray-200 pt-4 flex items-center justify-between text-base font-semibold text-gray-900">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {formattedDate && (
              <p className="mt-3 text-xs text-accent-gold">
                Pedido realizado el {formattedDate}
              </p>
            )}
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Dirección de envío
            </h2>
            <div className="text-sm space-y-1">
              <p className="font-semibold text-gray-900">
                {order.address.fullName}
              </p>
              <p className="text-accent-gold">
                {order.address.addressLine1}
                {order.address.addressLine2
                  ? `, ${order.address.addressLine2}`
                  : ""}
              </p>
              <p className="text-accent-gold">
                {order.address.city} · {order.address.postalCode}
              </p>
              <p className="text-accent-gold">{order.address.country}</p>
              <p className="text-accent-gold">{order.address.phone}</p>
            </div>
            {order.paymentMethod === "whatsapp" && (
              <Link
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Hola! Quiero coordinar el pago del pedido ${order.id} por ${formatPrice(
                    order.subtotal
                  )}.`
                )}`}
                className="inline-flex mt-6 justify-center rounded-md bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-900 transition"
              >
                Contactar por WhatsApp
              </Link>
            )}
            <Link
              href={`/${locale}/products`}
              className="inline-flex mt-6 justify-center rounded-md bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-900 transition"
            >
              Volver a la tienda
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

