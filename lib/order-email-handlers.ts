/**
 * Order Email Handlers
 * 
 * Handlers que conectan eventos de pedidos con el envío de emails transaccionales.
 * Se registran automáticamente al importar este módulo.
 */

import { orderEvents, type OrderEvent } from "./order-events";
import {
  sendTransactionalEmail,
  getSupportEmail,
} from "./email-service";
import {
  getOrderCreatedEmailTemplate,
  getOrderPaidEmailTemplate,
  getOrderCompletedEmailTemplate,
} from "./email-templates";
import { markEmailAsSentInSheet } from "./order-sheets-handler";

/**
 * Handler para ORDER_CREATED
 * Envía email de confirmación de pedido
 */
async function handleOrderCreated(event: OrderEvent): Promise<void> {
  const { order } = event;
  const supportEmail = getSupportEmail();

  const subject = `Pedido confirmado - ${order.id}`;
  const html = getOrderCreatedEmailTemplate(order, supportEmail);

  const sent = await sendTransactionalEmail(order.email, subject, html);
  
  // Actualizar estado en Google Sheets si se envió
  if (sent) {
    await markEmailAsSentInSheet(order.id);
  }
}

/**
 * Handler para ORDER_PAID
 * Envía email de confirmación de pago
 */
async function handleOrderPaid(event: OrderEvent): Promise<void> {
  const { order } = event;
  const supportEmail = getSupportEmail();

  const subject = `Pago recibido - ${order.id}`;
  const html = getOrderPaidEmailTemplate(order, supportEmail);

  const sent = await sendTransactionalEmail(order.email, subject, html);
  
  // Actualizar estado en Google Sheets si se envió
  if (sent) {
    await markEmailAsSentInSheet(order.id);
  }
}

/**
 * Handler para ORDER_COMPLETED
 * Envía email de pedido completado
 */
async function handleOrderCompleted(event: OrderEvent): Promise<void> {
  const { order } = event;
  const supportEmail = getSupportEmail();

  const subject = `Pedido completado - ${order.id}`;
  const html = getOrderCompletedEmailTemplate(order, supportEmail);

  const sent = await sendTransactionalEmail(order.email, subject, html);
  
  // Actualizar estado en Google Sheets si se envió
  if (sent) {
    await markEmailAsSentInSheet(order.id);
  }
}

/**
 * Registra los handlers de email para eventos de pedidos
 * Se ejecuta automáticamente al importar este módulo
 */
function registerEmailHandlers(): void {
  orderEvents.on("ORDER_CREATED", handleOrderCreated);
  orderEvents.on("ORDER_PAID", handleOrderPaid);
  orderEvents.on("ORDER_COMPLETED", handleOrderCompleted);
}

// Registrar handlers automáticamente
registerEmailHandlers();

