/**
 * Email Service - Resend Integration
 * 
 * Servicio para envío de emails transaccionales usando Resend.
 * Maneja errores de forma segura sin romper el flujo de la aplicación.
 */

import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@example.com";
const supportEmail = process.env.SUPPORT_EMAIL || "support@example.com";

let resend: Resend | null = null;

/**
 * Inicializa el cliente de Resend
 * Retorna null si no está configurado
 */
function getResendClient(): Resend | null {
  if (!resendApiKey) {
    return null;
  }

  if (!resend) {
    resend = new Resend(resendApiKey);
  }

  return resend;
}

/**
 * Envía un email transaccional
 * 
 * @param to - Email del destinatario
 * @param subject - Asunto del email
 * @param html - Contenido HTML del email
 * @returns true si se envió correctamente, false si falló
 */
export async function sendTransactionalEmail(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  const client = getResendClient();

  if (!client) {
    // En desarrollo o sin API key, solo loguear
    console.warn(
      "[Email Service] RESEND_API_KEY not configured. Email would be sent to:",
      to,
      "Subject:",
      subject
    );
    return false;
  }

  try {
    const result = await client.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
    });

    if (result.error) {
      console.error("[Email Service] Error sending email:", result.error);
      return false;
    }

    return true;
  } catch (error) {
    // Log seguro sin exponer información sensible
    console.error("[Email Service] Failed to send email:", {
      to: to.substring(0, 3) + "***", // Solo primeros 3 caracteres
      subject,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return false;
  }
}

/**
 * Obtiene el email de soporte configurado
 */
export function getSupportEmail(): string {
  return supportEmail;
}

