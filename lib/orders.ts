/**
 * Order Management - Backend Logic
 * 
 * Módulo puro para manejo de pedidos sin dependencias de UI.
 * Funciones inmutables y extensibles.
 */

import {
  emitOrderCreated,
  emitOrderPaid,
  emitOrderCompleted,
} from "./order-events";

export type OrderStatus = "created" | "paid" | "completed";

export type OrderItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  email: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: Date;
};

/**
 * Crea una nueva orden con estado "created"
 * Dispara el evento ORDER_CREATED
 * 
 * @param data - Datos de la orden
 * @returns Nueva orden con estado "created"
 */
export async function createOrder(data: {
  id: string;
  email: string;
  items: OrderItem[];
  totalAmount: number;
  currency?: string;
  paymentMethod: string;
}): Promise<Order> {
  const order: Order = {
    id: data.id,
    email: data.email,
    items: [...data.items], // Copia para inmutabilidad
    totalAmount: data.totalAmount,
    currency: data.currency || "USD",
    paymentMethod: data.paymentMethod,
    status: "created",
    createdAt: new Date(),
  };

  // Disparar evento ORDER_CREATED
  await emitOrderCreated(order);

  return order;
}

/**
 * Marca una orden como pagada
 * Valida que la orden esté en estado "created"
 * Dispara el evento ORDER_PAID
 * 
 * @param order - Orden a marcar como pagada
 * @returns Nueva orden con estado "paid"
 * @throws Error si la orden no está en estado "created"
 */
export async function markOrderAsPaid(order: Order): Promise<Order> {
  if (order.status !== "created") {
    throw new Error(
      `Cannot mark order as paid. Current status: ${order.status}. Expected: "created"`
    );
  }

  const paidOrder: Order = {
    ...order,
    status: "paid",
  };

  // Disparar evento ORDER_PAID
  await emitOrderPaid(paidOrder);

  return paidOrder;
}

/**
 * Marca una orden como completada
 * Valida que la orden esté en estado "paid"
 * Dispara el evento ORDER_COMPLETED
 * 
 * @param order - Orden a marcar como completada
 * @returns Nueva orden con estado "completed"
 * @throws Error si la orden no está en estado "paid"
 */
export async function markOrderAsCompleted(order: Order): Promise<Order> {
  if (order.status !== "paid") {
    throw new Error(
      `Cannot mark order as completed. Current status: ${order.status}. Expected: "paid"`
    );
  }

  const completedOrder: Order = {
    ...order,
    status: "completed",
  };

  // Disparar evento ORDER_COMPLETED
  await emitOrderCompleted(completedOrder);

  return completedOrder;
}

/**
 * Valida si una transición de estado es válida
 * 
 * @param currentStatus - Estado actual
 * @param newStatus - Nuevo estado
 * @returns true si la transición es válida
 */
export function isValidStatusTransition(
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): boolean {
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    created: ["paid"],
    paid: ["completed"],
    completed: [], // Estado final
  };

  return validTransitions[currentStatus].includes(newStatus);
}

/**
 * Obtiene el siguiente estado válido para una orden
 * 
 * @param currentStatus - Estado actual
 * @returns Siguiente estado válido o null si es estado final
 */
export function getNextValidStatus(
  currentStatus: OrderStatus
): OrderStatus | null {
  const nextStatusMap: Record<OrderStatus, OrderStatus | null> = {
    created: "paid",
    paid: "completed",
    completed: null,
  };

  return nextStatusMap[currentStatus];
}

/**
 * Verifica si una orden puede ser pagada
 * 
 * @param order - Orden a verificar
 * @returns true si la orden puede ser pagada
 */
export function canBePaid(order: Order): boolean {
  return order.status === "created";
}

/**
 * Verifica si una orden puede ser completada
 * 
 * @param order - Orden a verificar
 * @returns true si la orden puede ser completada
 */
export function canBeCompleted(order: Order): boolean {
  return order.status === "paid";
}

/**
 * Verifica si una orden está en estado final
 * 
 * @param order - Orden a verificar
 * @returns true si la orden está completada
 */
export function isCompleted(order: Order): boolean {
  return order.status === "completed";
}

