export function buildContactHref(
  locale: string,
  params: {
    orderId: string;
    subject: string;
    message: string;
  }
): string {
  const search = new URLSearchParams({
    orderId: params.orderId,
    subject: params.subject,
    message: params.message,
  });
  return `/${locale}/contact?${search.toString()}`;
}

/** @deprecated Use buildContactHref with localized subject/message */
export function buildOrderContactHref(
  locale: string,
  orderId: string
): string {
  const subject = `Consulta sobre pedido #${orderId}`;
  const message = `Hola, tengo una consulta sobre mi pedido #${orderId}.\n\n`;
  return buildContactHref(locale, { orderId, subject, message });
}
