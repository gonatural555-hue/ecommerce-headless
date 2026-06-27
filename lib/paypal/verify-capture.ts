import { getPayPalApiBase, getPayPalCredentials } from "@/lib/paypal/config";

type PayPalOrderResponse = {
  id?: string;
  status?: string;
  purchase_units?: Array<{
    amount?: { currency_code?: string; value?: string };
    payments?: {
      captures?: Array<{
        status?: string;
        amount?: { currency_code?: string; value?: string };
      }>;
    };
  }>;
};

export type PayPalVerificationResult =
  | { ok: true; paypalOrderId: string; amountUsd: number; currency: string }
  | { ok: false; error: string };

async function getPayPalAccessToken(): Promise<string> {
  const creds = getPayPalCredentials();
  if (!creds) {
    throw new Error("PayPal credentials are not configured");
  }

  const auth = Buffer.from(`${creds.clientId}:${creds.clientSecret}`).toString(
    "base64"
  );

  const res = await fetch(`${getPayPalApiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`PayPal token request failed (${res.status}): ${body}`);
  }

  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("PayPal token response missing access_token");
  }

  return data.access_token;
}

function parseUsdAmount(value: string | undefined): number | null {
  if (!value) return null;
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

function amountsMatch(expectedUsd: number, capturedUsd: number): boolean {
  return Math.abs(expectedUsd - capturedUsd) < 0.011;
}

/**
 * Verifica en PayPal que la orden existe, está capturada y el monto coincide.
 */
export async function verifyPayPalCapture(
  paypalOrderId: string,
  expectedAmountUsd: number
): Promise<PayPalVerificationResult> {
  if (!paypalOrderId.trim()) {
    return { ok: false, error: "paypalOrderId es obligatorio." };
  }

  const creds = getPayPalCredentials();
  if (!creds) {
    return {
      ok: false,
      error: "PayPal no está configurado en el servidor (CLIENT_SECRET).",
    };
  }

  try {
    const token = await getPayPalAccessToken();
    const res = await fetch(
      `${getPayPalApiBase()}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[PayPal verify] order fetch failed", res.status, body);
      return {
        ok: false,
        error: "No se pudo verificar la orden con PayPal.",
      };
    }

    const order = (await res.json()) as PayPalOrderResponse;
    const status = order.status?.toUpperCase();

    if (status !== "COMPLETED") {
      return {
        ok: false,
        error: `La orden PayPal no está completada (status: ${status ?? "unknown"}).`,
      };
    }

    const unit = order.purchase_units?.[0];
    const capture = unit?.payments?.captures?.[0];
    const captureStatus = capture?.status?.toUpperCase();

    if (capture && captureStatus !== "COMPLETED") {
      return {
        ok: false,
        error: `La captura PayPal no está completada (status: ${captureStatus ?? "unknown"}).`,
      };
    }

    const currency =
      capture?.amount?.currency_code ??
      unit?.amount?.currency_code ??
      "USD";

    if (currency !== "USD") {
      return {
        ok: false,
        error: `Moneda inesperada en PayPal: ${currency}.`,
      };
    }

    const capturedUsd =
      parseUsdAmount(capture?.amount?.value) ??
      parseUsdAmount(unit?.amount?.value);

    if (capturedUsd === null) {
      return { ok: false, error: "No se pudo leer el monto capturado." };
    }

    if (!amountsMatch(expectedAmountUsd, capturedUsd)) {
      console.error("[PayPal verify] amount mismatch", {
        expectedAmountUsd,
        capturedUsd,
        paypalOrderId,
      });
      return {
        ok: false,
        error: "El monto pagado no coincide con el total del pedido.",
      };
    }

    return {
      ok: true,
      paypalOrderId,
      amountUsd: capturedUsd,
      currency,
    };
  } catch (err) {
    console.error("[PayPal verify] unexpected error", err);
    return {
      ok: false,
      error: "Error al verificar el pago con PayPal.",
    };
  }
}
