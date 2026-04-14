/**
 * Microsoft Clarity — ID público del proyecto.
 * Configurar `NEXT_PUBLIC_CLARITY_ID` en el entorno (valor que muestra el panel de Clarity).
 * Sin valor, no se inyecta ningún script.
 */

export const CLARITY_PROJECT_ID =
  typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_CLARITY_ID?.trim() ?? ""
    : "";
