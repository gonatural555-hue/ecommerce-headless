/**
 * Sync Orders API
 * 
 * Endpoint para sincronización manual de pedidos con Google Sheets.
 * Proceso diario recomendado al inicio del día.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  syncOrdersToSheet,
  getOrdersFromSheet,
  initializeSheet,
} from "@/lib/google-sheets";
import type { Order } from "@/lib/orders";

/**
 * GET: Obtiene las órdenes desde Google Sheets
 */
export async function GET() {
  try {
    const orders = await getOrdersFromSheet();
    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("[Sync Orders API] Error getting orders:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener órdenes de Google Sheets",
      },
      { status: 500 }
    );
  }
}

/**
 * POST: Sincroniza órdenes a Google Sheets
 * Requiere pasar las órdenes en el body
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar secret key (opcional, para seguridad)
    const authHeader = request.headers.get("authorization");
    const expectedSecret = process.env.SYNC_ORDERS_SECRET;

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Inicializar la hoja si es necesario
    await initializeSheet();

    const body = await request.json().catch(() => ({}));
    const orders = body.orders as Order[] | undefined;
    const emailSentMap = body.emailSentMap as
      | Record<string, boolean>
      | undefined;

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

    // Convertir emailSentMap a Map
    const emailMap = new Map<string, boolean>();
    if (emailSentMap) {
      Object.entries(emailSentMap).forEach(([orderId, sent]) => {
        emailMap.set(orderId, sent);
      });
    }

    // Sincronizar órdenes
    const result = await syncOrdersToSheet(orders, emailMap);

    return NextResponse.json({
      success: true,
      result,
      message: `Sincronizadas: ${result.synced} exitosas, ${result.failed} fallidas`,
    });
  } catch (error) {
    console.error("[Sync Orders API] Error syncing orders:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al sincronizar órdenes",
      },
      { status: 500 }
    );
  }
}

