/**
 * Brevo Sync API
 * 
 * Endpoint para sincronización manual de contactos con Brevo.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  syncBuyerToBrevo,
  syncRegisteredUserToBrevo,
  syncNewsletterSubscriberToBrevo,
} from "@/lib/brevo";

/**
 * POST: Sincroniza contactos a Brevo
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar secret key (opcional, para seguridad)
    const authHeader = request.headers.get("authorization");
    const expectedSecret = process.env.BREVO_SYNC_SECRET;

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { type, contacts } = body;

    if (!type || !contacts || !Array.isArray(contacts)) {
      return NextResponse.json(
        {
          success: false,
          error: "Se requiere 'type' y 'contacts' (array)",
        },
        { status: 400 }
      );
    }

    let synced = 0;
    let failed = 0;

    for (const contact of contacts) {
      try {
        let success = false;

        switch (type) {
          case "buyer":
            success = await syncBuyerToBrevo(contact.email, {
              fechaPrimeraCompra: new Date(contact.fechaPrimeraCompra),
              totalGastado: contact.totalGastado || 0,
              idioma: contact.idioma,
              pais: contact.pais,
              consentimiento: contact.consentimiento !== false,
            });
            break;

          case "registered":
            success = await syncRegisteredUserToBrevo(contact.email, {
              idioma: contact.idioma,
              pais: contact.pais,
              consentimiento: contact.consentimiento !== false,
            });
            break;

          case "newsletter":
            success = await syncNewsletterSubscriberToBrevo(contact.email, {
              idioma: contact.idioma,
              pais: contact.pais,
              consentimiento: contact.consentimiento !== false,
            });
            break;

          default:
            console.warn(`[Brevo Sync] Unknown type: ${type}`);
            failed++;
            continue;
        }

        if (success) {
          synced++;
        } else {
          failed++;
        }
      } catch (error) {
        console.error(`[Brevo Sync] Error syncing contact ${contact.email}:`, error);
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      result: {
        synced,
        failed,
        total: contacts.length,
      },
      message: `Sincronizados: ${synced} exitosos, ${failed} fallidos`,
    });
  } catch (error) {
    console.error("[Brevo Sync API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al sincronizar contactos",
      },
      { status: 500 }
    );
  }
}

