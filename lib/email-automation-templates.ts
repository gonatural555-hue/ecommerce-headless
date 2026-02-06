/**
 * Email Automation Templates - Post-Purchase
 * 
 * Templates de email para automatizaciones post-compra.
 * Copy humano y no agresivo, fácil de editar.
 */

import type { Order } from "./orders";

/**
 * Formatea el monto con la moneda
 */
function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Obtiene el nombre del primer producto de la orden
 */
function getFirstProductName(order: Order): string {
  return order.items[0]?.title || "tu producto";
}

/**
 * Template base para emails de automatización
 */
function getBaseTemplate(
  title: string,
  content: string,
  supportEmail: string,
  ctaText?: string,
  ctaUrl?: string
): string {
  const ctaButton = ctaText && ctaUrl
    ? `
      <div style="text-align: center; margin: 32px 0;">
        <a href="${ctaUrl}" style="display: inline-block; background-color: #122220; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
          ${ctaText}
        </a>
      </div>
    `
    : "";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #122220; padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                ${title}
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              ${content}
              
              ${ctaButton}
              
              <!-- Footer -->
              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                  Si tienes alguna pregunta, estamos aquí para ayudarte.
                </p>
                <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                  <a href="mailto:${supportEmail}" style="color: #C89B3C; text-decoration: none;">
                    ${supportEmail}
                  </a>
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Día 1: Gracias por tu compra
 * Enviado cuando la orden se completa
 */
export function getDay1ThankYouTemplate(
  order: Order,
  supportEmail: string,
  siteUrl: string
): string {
  const productName = getFirstProductName(order);
  const orderUrl = `${siteUrl}/account`;

  const content = `
    <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.5;">
      Hola,
    </p>
    <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.5;">
      ¡Gracias por tu compra! Estamos muy contentos de que hayas elegido nuestros productos.
    </p>
    <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.5;">
      Tu pedido <strong>${order.id}</strong> está siendo preparado con mucho cuidado. Te mantendremos informado sobre cada paso del proceso.
    </p>
    <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px; line-height: 1.5;">
      Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos. Estamos aquí para ti.
    </p>
  `;

  return getBaseTemplate(
    "¡Gracias por tu compra!",
    content,
    supportEmail,
    "Ver mi pedido",
    orderUrl
  );
}

/**
 * Día 3: Cómo usar tu producto
 * Tips y guías útiles
 */
export function getDay3ProductGuideTemplate(
  order: Order,
  supportEmail: string,
  siteUrl: string
): string {
  const productName = getFirstProductName(order);
  const productsUrl = `${siteUrl}/products`;

  const content = `
    <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.5;">
      Hola,
    </p>
    <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.5;">
      Esperamos que estés disfrutando de <strong>${productName}</strong>. 
    </p>
    <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.5;">
      Para ayudarte a sacarle el máximo provecho, aquí tienes algunos tips útiles:
    </p>
    <ul style="margin: 0 0 24px 0; padding-left: 24px; color: #374151; font-size: 16px; line-height: 1.8;">
      <li>Lee las instrucciones de uso antes de comenzar</li>
      <li>Guarda el producto en un lugar seco y protegido</li>
      <li>Si tienes dudas, consulta nuestra sección de ayuda</li>
    </ul>
    <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px; line-height: 1.5;">
      Si necesitas ayuda adicional o tienes alguna pregunta, estamos aquí para ayudarte.
    </p>
  `;

  return getBaseTemplate(
    "Cómo usar tu producto",
    content,
    supportEmail,
    "Ver más productos",
    productsUrl
  );
}

/**
 * Día 7: Recomendación
 * Sugerencias de productos complementarios
 */
export function getDay7RecommendationTemplate(
  order: Order,
  supportEmail: string,
  siteUrl: string
): string {
  const productsUrl = `${siteUrl}/products`;

  const content = `
    <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.5;">
      Hola,
    </p>
    <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.5;">
      Esperamos que estés disfrutando de tu compra. 
    </p>
    <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.5;">
      Sabemos que te gusta la calidad, por eso queremos compartirte algunos productos que podrían interesarte y complementar tu pedido.
    </p>
    <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px; line-height: 1.5;">
      Echa un vistazo cuando tengas un momento. No hay presión, solo queríamos compartirte opciones que creemos que te podrían gustar.
    </p>
  `;

  return getBaseTemplate(
    "Productos que podrían interesarte",
    content,
    supportEmail,
    "Explorar productos",
    productsUrl
  );
}

/**
 * Día 14: Pedido de review
 * Solicitud amigable de reseña
 */
export function getDay14ReviewRequestTemplate(
  order: Order,
  supportEmail: string,
  siteUrl: string
): string {
  const productName = getFirstProductName(order);
  const reviewUrl = `${siteUrl}/products`;

  const content = `
    <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.5;">
      Hola,
    </p>
    <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.5;">
      Han pasado unos días desde tu compra y esperamos que estés disfrutando de <strong>${productName}</strong>.
    </p>
    <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.5;">
      Tu opinión es muy valiosa para nosotros y para otros clientes que están considerando comprar productos similares.
    </p>
    <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px; line-height: 1.5;">
      Si tienes un momento, nos encantaría saber qué te pareció tu compra. Tu feedback nos ayuda a mejorar y a otros a tomar mejores decisiones.
    </p>
  `;

  return getBaseTemplate(
    "¿Qué te pareció tu compra?",
    content,
    supportEmail,
    "Dejar una reseña",
    reviewUrl
  );
}

