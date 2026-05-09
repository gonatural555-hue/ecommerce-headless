import "./globals.css";
import { headers } from "next/headers";
import { Fraunces, Inter } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";
import { AuthProvider } from "@/context/AuthContext";
import { defaultLocale } from "@/lib/i18n/config";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import MicrosoftClarity from "@/components/analytics/MicrosoftClarity";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

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
      className={`${inter.variable} ${fraunces.variable}`}
    >
      <body className={inter.className}>
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
