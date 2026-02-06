/**
 * Brevo Handlers - Order Events Integration
 * 
 * Handlers que sincronizan compradores con Brevo cuando ocurren eventos de pedidos.
 */

import { orderEvents, type OrderEvent } from "./order-events";
import { syncBuyerToBrevo, updateBuyerTotalSpent } from "./brevo";
import type { Order } from "./orders";

// Cache para evitar múltiples llamadas
const processedOrders = new Set<string>();

/**
 * Calcula el total gastado por un email basado en todas sus órdenes
 * En producción, esto debería venir de la base de datos
 */
async function calculateTotalSpent(
  email: string,
  currentOrder: Order
): Promise<number> {
  // Por ahora, solo retornamos el monto de la orden actual
  // En producción, esto debería sumar todas las órdenes del usuario
  return currentOrder.totalAmount;
}

/**
 * Obtiene la fecha de la primera compra
 * En producción, esto debería venir de la base de datos
 */
function getFirstPurchaseDate(currentOrder: Order): Date {
  // Por ahora, usamos la fecha de la orden actual
  // En producción, esto debería buscar la primera orden del usuario
  return currentOrder.createdAt;
}

/**
 * Handler para ORDER_CREATED
 * Sincroniza comprador a Brevo cuando se crea una orden
 */
async function handleOrderCreated(event: OrderEvent): Promise<void> {
  const { order } = event;

  // Evitar procesar la misma orden múltiples veces
  if (processedOrders.has(order.id)) {
    return;
  }

  // Solo sincronizar compradores reales (órdenes pagadas o completadas)
  // Las órdenes creadas aún no son compras reales
  if (order.status === "created") {
    return;
  }

  try {
    // Obtener país de la dirección si está disponible
    // Nota: El tipo Order del sistema de pedidos no incluye address directamente
    // En producción, esto debería obtenerse de la base de datos
    const country = undefined; // TODO: Obtener de la orden completa

    // Verificar consentimiento
    // Por ahora, asumimos consentimiento si no es UE
    // En producción, esto debería verificarse desde el sistema de consentimiento
    const consentimiento = true; // TODO: Verificar desde consent-utils

    if (!consentimiento) {
      console.log(`[Brevo] Skipping order ${order.id} - no consent`);
      return;
    }

    const fechaPrimeraCompra = getFirstPurchaseDate(order);
    const totalGastado = await calculateTotalSpent(order.email, order);

    await syncBuyerToBrevo(order.email, {
      fechaPrimeraCompra,
      totalGastado,
      idioma: order.currency === "USD" ? "en" : "es", // Simplificado
      pais: country,
      consentimiento,
    });

    processedOrders.add(order.id);
  } catch (error) {
    console.error(`[Brevo] Error syncing order ${order.id}:`, error);
  }
}

/**
 * Handler para ORDER_PAID
 * Actualiza información del comprador cuando se paga una orden
 */
async function handleOrderPaid(event: OrderEvent): Promise<void> {
  const { order } = event;

  if (processedOrders.has(order.id)) {
    return;
  }

  try {
    const country = undefined; // TODO: Obtener de la orden completa
    const consentimiento = true; // TODO: Verificar desde consent-utils

    if (!consentimiento) {
      return;
    }

    const fechaPrimeraCompra = getFirstPurchaseDate(order);
    const totalGastado = await calculateTotalSpent(order.email, order);

    await syncBuyerToBrevo(order.email, {
      fechaPrimeraCompra,
      totalGastado,
      idioma: order.currency === "USD" ? "en" : "es",
      pais: country,
      consentimiento,
    });

    processedOrders.add(order.id);
  } catch (error) {
    console.error(`[Brevo] Error syncing paid order ${order.id}:`, error);
  }
}

/**
 * Handler para ORDER_COMPLETED
 * Sincroniza comprador cuando se completa una orden
 */
async function handleOrderCompleted(event: OrderEvent): Promise<void> {
  const { order } = event;

  if (processedOrders.has(order.id)) {
    return;
  }

  try {
    const country = undefined; // TODO: Obtener de la orden completa
    const consentimiento = true; // TODO: Verificar desde consent-utils

    if (!consentimiento) {
      return;
    }

    const fechaPrimeraCompra = getFirstPurchaseDate(order);
    const totalGastado = await calculateTotalSpent(order.email, order);

    await syncBuyerToBrevo(order.email, {
      fechaPrimeraCompra,
      totalGastado,
      idioma: order.currency === "USD" ? "en" : "es",
      pais: country,
      consentimiento,
    });

    processedOrders.add(order.id);
  } catch (error) {
    console.error(`[Brevo] Error syncing completed order ${order.id}:`, error);
  }
}

/**
 * Registra los handlers de Brevo para eventos de pedidos
 */
function registerBrevoHandlers(): void {
  orderEvents.on("ORDER_CREATED", handleOrderCreated);
  orderEvents.on("ORDER_PAID", handleOrderPaid);
  orderEvents.on("ORDER_COMPLETED", handleOrderCompleted);
}

// Registrar handlers automáticamente
registerBrevoHandlers();

