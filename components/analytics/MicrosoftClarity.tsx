"use client";

/**
 * Carga el bootstrap oficial de Microsoft Clarity de forma diferida (`afterInteractive`),
 * compatible con App Router y sin bloquear el hilo principal ni el checkout (PayPal/GA siguen igual).
 *
 * - Un solo bloque con `id` fijo para que Next.js no duplique el nodo.
 * - Guard `window.__clarityMsLoaded` por si el árbol se vuelve a montar (p. ej. Strict Mode en dev).
 *
 * @see https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup
 */

import Script from "next/script";
import { CLARITY_PROJECT_ID } from "@/lib/analytics/clarity";

declare global {
  interface Window {
    /** Evita ejecutar el bootstrap de Clarity más de una vez. */
    __clarityMsLoaded?: boolean;
  }
}

export default function MicrosoftClarity() {
  if (!CLARITY_PROJECT_ID) {
    return null;
  }

  const projectIdLiteral = JSON.stringify(CLARITY_PROJECT_ID);

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`
(function(w) {
  if (w.__clarityMsLoaded) return;
  w.__clarityMsLoaded = true;
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(w, document, "clarity", "script", ${projectIdLiteral});
})(window);
      `.trim()}
    </Script>
  );
}
