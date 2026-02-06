/**
 * Order Events System
 * 
 * Sistema de eventos desacoplado para pedidos.
 * Permite registrar handlers que se ejecutan cuando ocurren eventos.
 */

import type { Order } from "./orders";

export type OrderEventType = "ORDER_CREATED" | "ORDER_PAID" | "ORDER_COMPLETED";

export type OrderEvent = {
  type: OrderEventType;
  order: Order;
  timestamp: Date;
};

export type OrderEventHandler = (event: OrderEvent) => void | Promise<void>;

type EventHandlers = {
  [K in OrderEventType]: Set<OrderEventHandler>;
};

class OrderEventEmitter {
  private handlers: EventHandlers = {
    ORDER_CREATED: new Set(),
    ORDER_PAID: new Set(),
    ORDER_COMPLETED: new Set(),
  };

  /**
   * Registra un handler para un tipo de evento
   * 
   * @param eventType - Tipo de evento
   * @param handler - Función handler
   * @returns Función para desregistrar el handler
   */
  on(eventType: OrderEventType, handler: OrderEventHandler): () => void {
    this.handlers[eventType].add(handler);

    // Retorna función para desregistrar
    return () => {
      this.handlers[eventType].delete(handler);
    };
  }

  /**
   * Desregistra un handler
   * 
   * @param eventType - Tipo de evento
   * @param handler - Handler a desregistrar
   */
  off(eventType: OrderEventType, handler: OrderEventHandler): void {
    this.handlers[eventType].delete(handler);
  }

  /**
   * Dispara un evento a todos los handlers registrados
   * 
   * @param eventType - Tipo de evento
   * @param order - Orden relacionada
   */
  async emit(eventType: OrderEventType, order: Order): Promise<void> {
    const event: OrderEvent = {
      type: eventType,
      order,
      timestamp: new Date(),
    };

    const handlers = Array.from(this.handlers[eventType]);

    // Ejecutar todos los handlers (pueden ser async)
    await Promise.all(
      handlers.map(async (handler) => {
        try {
          await handler(event);
        } catch (error) {
          console.error(`Error in order event handler for ${eventType}:`, error);
        }
      })
    );
  }

  /**
   * Limpia todos los handlers de un tipo de evento
   * 
   * @param eventType - Tipo de evento
   */
  removeAllListeners(eventType?: OrderEventType): void {
    if (eventType) {
      this.handlers[eventType].clear();
    } else {
      // Limpiar todos los eventos
      Object.keys(this.handlers).forEach((key) => {
        this.handlers[key as OrderEventType].clear();
      });
    }
  }

  /**
   * Obtiene el número de handlers registrados para un evento
   * 
   * @param eventType - Tipo de evento
   * @returns Número de handlers
   */
  listenerCount(eventType: OrderEventType): number {
    return this.handlers[eventType].size;
  }
}

// Instancia singleton del emisor de eventos
export const orderEvents = new OrderEventEmitter();

/**
 * Helper para disparar ORDER_CREATED
 */
export async function emitOrderCreated(order: Order): Promise<void> {
  await orderEvents.emit("ORDER_CREATED", order);
}

/**
 * Helper para disparar ORDER_PAID
 */
export async function emitOrderPaid(order: Order): Promise<void> {
  await orderEvents.emit("ORDER_PAID", order);
}

/**
 * Helper para disparar ORDER_COMPLETED
 */
export async function emitOrderCompleted(order: Order): Promise<void> {
  await orderEvents.emit("ORDER_COMPLETED", order);
}

