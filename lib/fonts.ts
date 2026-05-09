import localFont from "next/font/local";
import { Inter } from "next/font/google";

/** Inter — navegación, cuerpo, botones, formularios, filtros */
export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Display (TAN Nimbus): archivos en `assets/fonts/tan-nimbus/*.woff2`.
 * Si tienes la familia licenciada, sustituye los .woff2 manteniendo los mismos nombres y pesos.
 */
export const fontDisplay = localFont({
  src: [
    {
      path: "../assets/fonts/tan-nimbus/TANNimbus-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/tan-nimbus/TANNimbus-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/tan-nimbus/TANNimbus-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-tan-nimbus",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});
