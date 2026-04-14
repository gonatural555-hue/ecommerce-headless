/**
 * Número de WhatsApp para coordinar pagos desde el checkout (temporal / manual).
 * Usar `NEXT_PUBLIC_CHECKOUT_WHATSAPP` con dígitos internacionales sin + (ej. 5491123456789).
 * Si falta o es inválido, el bloque de WhatsApp no se muestra.
 */

export function getCheckoutWhatsappDigits(): string {
  const raw =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_CHECKOUT_WHATSAPP?.trim() ?? ""
      : "";
  return raw.replace(/\D/g, "");
}

export function isCheckoutWhatsappEnabled(): boolean {
  return getCheckoutWhatsappDigits().length >= 8;
}
