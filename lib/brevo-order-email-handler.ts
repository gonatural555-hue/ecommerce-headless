/**
 * Brevo Order Email Handler
 * 
 * Handler que envía email transaccional de confirmación de pedido usando Brevo
 * cuando se dispara el evento ORDER_CREATED.
 * 
 * IMPORTANTE: No rompe el flujo de compra si el email falla.
 */

import { orderEvents, type OrderEvent } from "./order-events";
import { sendOrderCreatedEmail } from "./email/brevo";

/**
 * Handler para ORDER_CREATED
 * Envía email de confirmación de pedido usando Brevo
 * 
 * Reglas:
 * - NO lanza errores
 * - Si falla, solo loguea el error
 * - NO interrumpe el checkout
 */
async function handleOrderCreatedEmail(event: OrderEvent): Promise<void> {
  const { order } = event;

  try {
    // Enviar email de confirmación
    await sendOrderCreatedEmail({
      email: order.email,
      orderId: order.id,
      total: order.totalAmount,
      currency: order.currency,
      items: order.items,
    });
  } catch (error) {
    // IMPORTANTE: No lanzar el error para no romper el flujo de compra
    // Solo loguear para debugging
    console.error(
      `[Brevo Order Email Handler] Error sending order confirmation email for order ${order.id}:`,
      error
    );
    // El pedido continúa normalmente aunque el email haya fallado
  }
}

/**
 * Registra el handler de email transaccional con Brevo
 * Se ejecuta automáticamente al importar este módulo
 */
function registerBrevoOrderEmailHandler(): void {
  orderEvents.on("ORDER_CREATED", handleOrderCreatedEmail);
}

// Registrar handler automáticamente
registerBrevoOrderEmailHandler();

