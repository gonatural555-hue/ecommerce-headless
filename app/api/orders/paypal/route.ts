import { NextRequest, NextResponse } from "next/server";
import { createOrder, markOrderAsPaid, type OrderItem } from "@/lib/orders";

type PayPalOrderPayload = {
  orderId: string;
  email?: string;
  items: OrderItem[];
  totalAmount: number;
  currency?: string;
  paypalOrderId?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<PayPalOrderPayload>;

    const { orderId, email, items, totalAmount, currency, paypalOrderId } =
      body;

    if (!orderId || !items || !Array.isArray(items) || !items.length) {
      console.error("[PayPal Order API] Payload inválido", { body });
      return NextResponse.json(
        {
          success: false,
          error:
            "Payload inválido. Se requiere orderId, items (no vacío) y totalAmount.",
        },
        { status: 400 }
      );
    }

    if (typeof totalAmount !== "number" || Number.isNaN(totalAmount)) {
      console.error("[PayPal Order API] totalAmount inválido", {
        orderId,
        totalAmount,
      });
      return NextResponse.json(
        {
          success: false,
          error: "totalAmount debe ser un número.",
        },
        { status: 400 }
      );
    }

    const safeEmail =
      typeof email === "string" && email.includes("@") ? email : "";

    console.log("[PayPal Order API] Creando orden desde pago PayPal", {
      orderId,
      paypalOrderId,
      totalAmount,
      currency: currency || "USD",
      hasEmail: Boolean(safeEmail),
      itemsCount: items.length,
    });

    // 1) Crear orden en código (ORDER_CREATED)
    const createdOrder = await createOrder({
      id: orderId,
      email: safeEmail,
      items,
      totalAmount,
      currency: currency || "USD",
      paymentMethod: "paypal",
    });

    // 2) Marcar como pagada (ORDER_PAID)
    const paidOrder = await markOrderAsPaid(createdOrder);

    console.log("[PayPal Order API] Orden marcada como pagada", {
      orderId: paidOrder.id,
      status: paidOrder.status,
    });

    // IMPORTANTE:
    // - La sincronización con Google Sheets se maneja vía order-sheets-handler
    // - Si Sheets falla, loguea el error internamente y NO rompe este flujo

    return NextResponse.json({
      success: true,
      orderId: paidOrder.id,
      status: paidOrder.status,
    });
  } catch (error) {
    console.error("[PayPal Order API] Error procesando orden PayPal:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error interno al procesar la orden de PayPal",
      },
      { status: 500 }
    );
  }
}


