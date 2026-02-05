"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

type PayPalButtonProps = {
  amount: number;
  currency?: string;
  onSuccess: (details: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
};

export default function PayPalButton({
  amount,
  currency = "USD",
  onSuccess,
  onError,
  onCancel,
}: PayPalButtonProps) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    console.error("NEXT_PUBLIC_PAYPAL_CLIENT_ID is not set");
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        PayPal is not configured. Please set NEXT_PUBLIC_PAYPAL_CLIENT_ID environment variable.
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency,
        intent: "capture",
      }}
    >
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "black",
          shape: "rect",
          label: "paypal",
        }}
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  value: amount.toFixed(2),
                  currency_code: currency,
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          try {
            const details = await actions.order?.capture();
            if (details) {
              onSuccess(details);
            }
          } catch (error) {
            if (onError) {
              onError(error);
            }
          }
        }}
        onError={(error) => {
          console.error("PayPal error:", error);
          if (onError) {
            onError(error);
          }
        }}
        onCancel={() => {
          if (onCancel) {
            onCancel();
          }
        }}
      />
    </PayPalScriptProvider>
  );
}

