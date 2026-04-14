"use client";

/**
 * Carga gtag.js y configura GA4 sin envío automático de `page_view` en el primer hit
 * (`send_page_view: false`). Las vistas de página las envía `Ga4RouteTracker` en cada
 * cambio de ruta del App Router, evitando duplicados entre carga inicial y SPA.
 */

import Script from "next/script";
import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { GA4_MEASUREMENT_ID, sendGa4PageView } from "@/lib/analytics/ga4";

function Ga4RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA4_MEASUREMENT_ID) return;
    const search = searchParams?.toString();
    const path =
      pathname + (search && search.length > 0 ? `?${search}` : "");
    sendGa4PageView(path);
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  if (!GA4_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA4_MEASUREMENT_ID}', { send_page_view: false });
        `}
      </Script>
      <Suspense fallback={null}>
        <Ga4RouteTracker />
      </Suspense>
    </>
  );
}
