import "./globals.css";
import { headers } from "next/headers";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";
import { defaultLocale } from "@/lib/i18n/config";
import RegistrationCTA from "@/components/RegistrationCTA";

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
        <UserProvider>
          <CartProvider>{children}</CartProvider>
        </UserProvider>
        {/* DEBUG: RegistrationCTA mounted globally in root layout - NO CONDITIONS */}
        <RegistrationCTA />
      </body>
    </html>
  );
}
