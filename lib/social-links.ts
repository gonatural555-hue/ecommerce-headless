/**
 * URLs públicas de redes (Next inyecta `NEXT_PUBLIC_*` en cliente y servidor).
 * Definí en `.env.local` (o en el panel de env del deploy), por ejemplo:
 *   NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/tu_cuenta
 *   NEXT_PUBLIC_TIKTOK_URL=https://www.tiktok.com/@tu_cuenta
 */
export const INSTAGRAM_URL = (process.env.NEXT_PUBLIC_INSTAGRAM_URL || "").trim();

export const TIKTOK_URL = (process.env.NEXT_PUBLIC_TIKTOK_URL || "").trim();
