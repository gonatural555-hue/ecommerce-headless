/**
 * Order Automation Handlers
 * 
 * Handlers que conectan eventos de pedidos con automatizaciones de email.
 * Se registran automáticamente al importar este módulo.
 */

import { orderEvents, type OrderEvent } from "./order-events";
import { scheduleAllAutomations } from "./email-automations";

/**
 * Handler para ORDER_COMPLETED
 * Programa todas las automatizaciones post-compra
 */
async function handleOrderCompleted(event: OrderEvent): Promise<void> {
  const { order } = event;

  // Solo programar automatizaciones si la orden está completada
  if (order.status === "completed") {
    scheduleAllAutomations(order);
  }
}

/**
 * Registra los handlers de automatización para eventos de pedidos
 * Se ejecuta automáticamente al importar este módulo
 */
function registerAutomationHandlers(): void {
  orderEvents.on("ORDER_COMPLETED", handleOrderCompleted);
}

// Registrar handlers automáticamente
registerAutomationHandlers();

