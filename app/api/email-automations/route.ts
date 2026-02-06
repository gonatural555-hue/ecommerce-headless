/**
 * Email Automations API
 * 
 * Endpoint para procesar y enviar emails de automatización programados.
 * Debe ejecutarse periódicamente (cron job) o manualmente.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  processPendingEmails,
  getAutomationStats,
} from "@/lib/email-automations";
import type { Order } from "@/lib/orders";

// En producción, esto debería obtener las órdenes de la base de datos
// Por ahora, usamos un método simple que requiere pasar las órdenes
// En un sistema real, esto se haría desde la base de datos

/**
 * GET: Obtiene estadísticas de automatizaciones
 */
export async function GET() {
  try {
    const stats = getAutomationStats();
    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("[Email Automations API] Error getting stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener estadísticas",
      },
      { status: 500 }
    );
  }
}

/**
 * POST: Procesa y envía emails pendientes
 * Requiere un secret key para seguridad
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar secret key (opcional, para seguridad)
    const authHeader = request.headers.get("authorization");
    const expectedSecret = process.env.EMAIL_AUTOMATIONS_SECRET;

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // En producción, obtener órdenes de la base de datos
    // Por ahora, retornamos un mensaje indicando que se necesita implementar
    const body = await request.json().catch(() => ({}));
    const orders = body.orders as Order[] | undefined;

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No se proporcionaron órdenes. En producción, esto debe obtenerse de la base de datos.",
        },
        { status: 400 }
      );
    }

    // Convertir array a Map para el procesamiento
    const ordersMap = new Map<string, Order>();
    orders.forEach((order) => {
      ordersMap.set(order.id, order);
    });

    // Procesar emails pendientes
    const result = await processPendingEmails(ordersMap);

    return NextResponse.json({
      success: true,
      result,
      message: `Procesados: ${result.sent} enviados, ${result.failed} fallidos`,
    });
  } catch (error) {
    console.error("[Email Automations API] Error processing emails:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al procesar emails",
      },
      { status: 500 }
    );
  }
}

