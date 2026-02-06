/**
 * Consent Utilities - GDPR Compliance
 * 
 * Utilidades para manejar consentimiento explícito de usuarios (UE/GDPR).
 */

const CONSENT_STORAGE_KEY = "brevo-consent";

export type ConsentStatus = "granted" | "denied" | "not_set";

/**
 * Obtiene el estado de consentimiento del usuario
 */
export function getConsentStatus(email: string): ConsentStatus {
  if (typeof window === "undefined") {
    return "not_set";
  }

  const stored = localStorage.getItem(`${CONSENT_STORAGE_KEY}-${email}`);
  if (stored === "granted") {
    return "granted";
  }
  if (stored === "denied") {
    return "denied";
  }
  return "not_set";
}

/**
 * Guarda el consentimiento del usuario
 */
export function setConsentStatus(
  email: string,
  status: "granted" | "denied"
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(`${CONSENT_STORAGE_KEY}-${email}`, status);
}

/**
 * Verifica si el usuario tiene consentimiento explícito
 * Para usuarios UE, requiere consentimiento explícito
 */
export function hasExplicitConsent(
  email: string,
  country?: string
): boolean {
  // Países UE que requieren consentimiento explícito
  const euCountries = [
    "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
    "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
    "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  ];

  const isEU = country && euCountries.includes(country.toUpperCase());

  if (isEU) {
    // Para usuarios UE, requiere consentimiento explícito
    return getConsentStatus(email) === "granted";
  }

  // Para usuarios fuera de UE, asumimos consentimiento implícito por compra
  // pero aún así verificamos si hay consentimiento explícito
  const status = getConsentStatus(email);
  return status === "granted" || status === "not_set";
}

/**
 * Verifica si se debe solicitar consentimiento
 */
export function shouldRequestConsent(country?: string): boolean {
  const euCountries = [
    "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
    "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
    "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  ];

  return country ? euCountries.includes(country.toUpperCase()) : false;
}

