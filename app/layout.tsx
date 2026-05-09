import "./globals.css";
import { headers } from "next/headers";
import { fontSans, fontDisplay } from "@/lib/fonts";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";
import { AuthProvider } from "@/context/AuthContext";
import { defaultLocale } from "@/lib/i18n/config";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import MicrosoftClarity from "@/components/analytics/MicrosoftClarity";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-locale") || defaultLocale;

  return (
    <html
      lang={locale}
      className={`${fontSans.variable} ${fontDisplay.variable}`}
    >
      <body className={fontSans.className}>
        <GoogleAnalytics />
        <MicrosoftClarity />
        <UserProvider>
          <AuthProvider>
            <CartProvider>{children}</CartProvider>
          </AuthProvider>
        </UserProvider>
      </body>
    </html>
  );
}
