/**
 * Order Sheets Handler
 * 
 * Handler que sincroniza pedidos con Google Sheets automáticamente.
 */

import { orderEvents, type OrderEvent } from "./order-events";
import { upsertOrderToSheet, updateEmailSentStatus } from "./google-sheets";

/**
 * Handler para ORDER_CREATED
 * Agrega la orden a Google Sheets
 */
async function handleOrderCreated(event: OrderEvent): Promise<void> {
  const { order } = event;
  await upsertOrderToSheet(order, false);
}

/**
 * Handler para ORDER_PAID
 * Actualiza el estado en Google Sheets
 */
async function handleOrderPaid(event: OrderEvent): Promise<void> {
  const { order } = event;
  await upsertOrderToSheet(order, false);
}

/**
 * Handler para ORDER_COMPLETED
 * Actualiza el estado en Google Sheets
 */
async function handleOrderCompleted(event: OrderEvent): Promise<void> {
  const { order } = event;
  await upsertOrderToSheet(order, false);
}

/**
 * Registra los handlers de sincronización con Google Sheets
 */
function registerSheetsHandlers(): void {
  orderEvents.on("ORDER_CREATED", handleOrderCreated);
  orderEvents.on("ORDER_PAID", handleOrderPaid);
  orderEvents.on("ORDER_COMPLETED", handleOrderCompleted);
}

// Registrar handlers automáticamente
registerSheetsHandlers();

/**
 * Función auxiliar para actualizar el estado de email enviado
 * Puede ser llamada después de enviar emails transaccionales
 */
export async function markEmailAsSentInSheet(
  orderId: string
): Promise<void> {
  await updateEmailSentStatus(orderId, true);
}

