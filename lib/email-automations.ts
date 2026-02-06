/**
 * Email Automations - Post-Purchase
 * 
 * Sistema de automatizaciones de email post-compra.
 * Programa y gestiona el envío de emails en días específicos después de la compra.
 */

import type { Order } from "./orders";
import { sendTransactionalEmail, getSupportEmail } from "./email-service";
import {
  getDay1ThankYouTemplate,
  getDay3ProductGuideTemplate,
  getDay7RecommendationTemplate,
  getDay14ReviewRequestTemplate,
} from "./email-automation-templates";

export type AutomationEmailType = "day1" | "day3" | "day7" | "day14";

export type ScheduledEmail = {
  orderId: string;
  email: string;
  type: AutomationEmailType;
  scheduledFor: Date; // Fecha y hora en que debe enviarse
  sent: boolean;
  sentAt?: Date;
  createdAt: Date;
};

// Almacenamiento en memoria (en producción, usar base de datos)
// Formato: orderId -> ScheduledEmail[]
const scheduledEmails: Map<string, ScheduledEmail[]> = new Map();

/**
 * Obtiene la URL base del sitio
 */
function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

/**
 * Programa un email de automatización
 */
export function scheduleAutomationEmail(
  order: Order,
  type: AutomationEmailType,
  daysAfterCompletion: number
): ScheduledEmail {
  const scheduledFor = new Date();
  scheduledFor.setDate(scheduledFor.getDate() + daysAfterCompletion);
  scheduledFor.setHours(10, 0, 0, 0); // Enviar a las 10 AM

  const scheduledEmail: ScheduledEmail = {
    orderId: order.id,
    email: order.email,
    type,
    scheduledFor,
    sent: false,
    createdAt: new Date(),
  };

  // Agregar a la lista de emails programados
  const existing = scheduledEmails.get(order.id) || [];
  existing.push(scheduledEmail);
  scheduledEmails.set(order.id, existing);

  return scheduledEmail;
}

/**
 * Programa todas las automatizaciones para una orden completada
 */
export function scheduleAllAutomations(order: Order): void {
  // Solo programar si la orden está completada
  if (order.status !== "completed") {
    return;
  }

  // Día 1: Gracias por tu compra
  scheduleAutomationEmail(order, "day1", 1);

  // Día 3: Cómo usar tu producto
  scheduleAutomationEmail(order, "day3", 3);

  // Día 7: Recomendación
  scheduleAutomationEmail(order, "day7", 7);

  // Día 14: Pedido de review
  scheduleAutomationEmail(order, "day14", 14);
}

/**
 * Obtiene todos los emails programados que están listos para enviar
 */
export function getPendingEmails(): ScheduledEmail[] {
  const now = new Date();
  const pending: ScheduledEmail[] = [];

  scheduledEmails.forEach((emails) => {
    emails.forEach((email) => {
      if (!email.sent && email.scheduledFor <= now) {
        pending.push(email);
      }
    });
  });

  return pending;
}

/**
 * Obtiene la orden asociada a un email programado
 * En producción, esto vendría de la base de datos
 */
export function getOrderForScheduledEmail(
  orderId: string
): Order | null {
  // En producción, esto debería buscar en la base de datos
  // Por ahora retornamos null y se debe pasar la orden desde fuera
  return null;
}

/**
 * Envía un email de automatización
 */
async function sendAutomationEmail(
  scheduledEmail: ScheduledEmail,
  order: Order
): Promise<boolean> {
  const supportEmail = getSupportEmail();
  const siteUrl = getSiteUrl();

  let subject: string;
  let html: string;

  switch (scheduledEmail.type) {
    case "day1":
      subject = `¡Gracias por tu compra! - Pedido ${order.id}`;
      html = getDay1ThankYouTemplate(order, supportEmail, siteUrl);
      break;
    case "day3":
      subject = `Cómo usar tu producto - Pedido ${order.id}`;
      html = getDay3ProductGuideTemplate(order, supportEmail, siteUrl);
      break;
    case "day7":
      subject = `Productos que podrían interesarte`;
      html = getDay7RecommendationTemplate(order, supportEmail, siteUrl);
      break;
    case "day14":
      subject = `¿Qué te pareció tu compra? - Pedido ${order.id}`;
      html = getDay14ReviewRequestTemplate(order, supportEmail, siteUrl);
      break;
    default:
      console.error(`Unknown automation type: ${scheduledEmail.type}`);
      return false;
  }

  const success = await sendTransactionalEmail(
    scheduledEmail.email,
    subject,
    html
  );

  if (success) {
    // Marcar como enviado
    const emails = scheduledEmails.get(scheduledEmail.orderId) || [];
    const emailIndex = emails.findIndex(
      (e) =>
        e.type === scheduledEmail.type &&
        e.scheduledFor.getTime() === scheduledEmail.scheduledFor.getTime()
    );
    if (emailIndex !== -1) {
      emails[emailIndex].sent = true;
      emails[emailIndex].sentAt = new Date();
    }
  }

  return success;
}

/**
 * Procesa y envía todos los emails pendientes
 * Requiere que se pasen las órdenes correspondientes
 */
export async function processPendingEmails(
  orders: Map<string, Order>
): Promise<{ sent: number; failed: number }> {
  const pending = getPendingEmails();
  let sent = 0;
  let failed = 0;

  for (const scheduledEmail of pending) {
    const order = orders.get(scheduledEmail.orderId);
    if (!order) {
      console.warn(
        `Order ${scheduledEmail.orderId} not found for scheduled email`
      );
      failed++;
      continue;
    }

    try {
      const success = await sendAutomationEmail(scheduledEmail, order);
      if (success) {
        sent++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(
        `Error sending automation email ${scheduledEmail.type} for order ${scheduledEmail.orderId}:`,
        error
      );
      failed++;
    }
  }

  return { sent, failed };
}

/**
 * Obtiene estadísticas de emails programados
 */
export function getAutomationStats(): {
  total: number;
  sent: number;
  pending: number;
} {
  let total = 0;
  let sent = 0;
  let pending = 0;

  scheduledEmails.forEach((emails) => {
    emails.forEach((email) => {
      total++;
      if (email.sent) {
        sent++;
      } else {
        pending++;
      }
    });
  });

  return { total, sent, pending };
}

