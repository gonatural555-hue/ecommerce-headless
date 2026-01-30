import "./globals.css";
import { headers } from "next/headers";
import { CartProvider } from "@/context/CartContext";
import { defaultLocale } from "@/lib/i18n/config";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-locale") || defaultLocale;

  return (
    <html lang={locale}>
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
