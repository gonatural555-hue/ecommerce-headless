/**
 * Brevo (Sendinblue) Integration - CRM & Email Automation
 * 
 * Sistema de sincronización de contactos con Brevo para CRM y automatizaciones.
 * Cumple con GDPR y solo sincroniza contactos con consentimiento explícito.
 */

import * as brevo from "@getbrevo/brevo";

// IDs de listas en Brevo (configurar en variables de entorno)
const LIST_IDS = {
  COMPRADORES: parseInt(process.env.BREVO_LIST_COMPRADORES || "0"),
  REGISTRADOS: parseInt(process.env.BREVO_LIST_REGISTRADOS || "0"),
  NEWSLETTER: parseInt(process.env.BREVO_LIST_NEWSLETTER || "0"),
};

// Inicializar cliente de Brevo
let brevoContactsApi: brevo.ContactsApi | null = null;

function getBrevoClient(): {
  contactsApi: brevo.ContactsApi;
} | null {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    return null;
  }

  if (!brevoContactsApi) {
    brevoContactsApi = new brevo.ContactsApi();
    brevoContactsApi.setApiKey(
      brevo.ContactsApiApiKeys.apiKey,
      apiKey
    );
  }

  return {
    contactsApi: brevoContactsApi,
  };
}

export type ContactType = "comprador" | "registrado" | "newsletter";

export type BrevoContactData = {
  email: string;
  fechaPrimeraCompra?: string; // ISO date string
  totalGastado?: number;
  idioma?: string;
  pais?: string;
  consentimiento?: boolean;
  tipo?: ContactType;
};

/**
 * Verifica si un contacto existe en Brevo
 */
export async function contactExists(email: string): Promise<boolean> {
  const client = getBrevoClient();
  if (!client) {
    return false;
  }

  try {
    await client.contactsApi.getContactInfo(email);
    return true;
  } catch (error: any) {
    if (error.status === 404) {
      return false;
    }
    console.error("[Brevo] Error checking contact:", error);
    return false;
  }
}

/**
 * Crea o actualiza un contacto en Brevo
 * No duplica contactos - actualiza si ya existe
 */
export async function upsertContact(
  data: BrevoContactData,
  listIds: number[] = []
): Promise<boolean> {
  const client = getBrevoClient();
  if (!client) {
    console.warn("[Brevo] Client not configured, skipping sync");
    return false;
  }

  // Validar consentimiento para usuarios UE/GDPR
  if (data.consentimiento === false) {
    console.log(`[Brevo] Skipping contact ${data.email} - no consent`);
    return false;
  }

  try {
    const attributes: Record<string, any> = {};

    if (data.fechaPrimeraCompra) {
      attributes.FECHA_PRIMERA_COMPRA = data.fechaPrimeraCompra;
    }

    if (data.totalGastado !== undefined) {
      attributes.TOTAL_GASTADO = data.totalGastado;
    }

    if (data.idioma) {
      attributes.IDIOMA = data.idioma;
    }

    if (data.pais) {
      attributes.PAIS = data.pais;
    }

    if (data.tipo) {
      attributes.TIPO_CONTACTO = data.tipo;
    }

    // Verificar si el contacto existe
    const exists = await contactExists(data.email);

    if (exists) {
      // Actualizar contacto existente
      const updateContact = new brevo.UpdateContact();
      updateContact.attributes = attributes;

      await client.contactsApi.updateContact(data.email, updateContact);

      // Agregar a listas si se especificaron (después de actualizar)
      if (listIds.length > 0) {
        for (const listId of listIds) {
          try {
            await client.contactsApi.addContactToList(listId, {
              emails: [data.email],
            });
          } catch (error: any) {
            // Ignorar error si ya está en la lista (código 400)
            if (error.status !== 400 && error.code !== 400) {
              console.warn(`[Brevo] Could not add to list ${listId}:`, error);
            }
          }
        }
      }
    } else {
      // Crear nuevo contacto
      const createContact = new brevo.CreateContact();
      createContact.email = data.email;
      createContact.attributes = attributes;

      // Agregar a listas si se especificaron
      if (listIds.length > 0) {
        createContact.listIds = listIds;
      }

      await client.contactsApi.createContact(createContact);
    }

    return true;
  } catch (error) {
    console.error("[Brevo] Error upserting contact:", error);
    return false;
  }
}

/**
 * Sincroniza un comprador a Brevo
 * Solo sincroniza compradores reales con consentimiento
 */
export async function syncBuyerToBrevo(
  email: string,
  orderData: {
    fechaPrimeraCompra: Date;
    totalGastado: number;
    idioma?: string;
    pais?: string;
    consentimiento: boolean;
  }
): Promise<boolean> {
  if (!orderData.consentimiento) {
    console.log(`[Brevo] Skipping buyer ${email} - no consent`);
    return false;
  }

  const listIds = LIST_IDS.COMPRADORES > 0 ? [LIST_IDS.COMPRADORES] : [];

  return await upsertContact(
    {
      email,
      fechaPrimeraCompra: orderData.fechaPrimeraCompra.toISOString(),
      totalGastado: orderData.totalGastado,
      idioma: orderData.idioma,
      pais: orderData.pais,
      consentimiento: orderData.consentimiento,
      tipo: "comprador",
    },
    listIds
  );
}

/**
 * Sincroniza un usuario registrado a Brevo
 */
export async function syncRegisteredUserToBrevo(
  email: string,
  userData: {
    idioma?: string;
    pais?: string;
    consentimiento: boolean;
  }
): Promise<boolean> {
  if (!userData.consentimiento) {
    console.log(`[Brevo] Skipping registered user ${email} - no consent`);
    return false;
  }

  const listIds = LIST_IDS.REGISTRADOS > 0 ? [LIST_IDS.REGISTRADOS] : [];

  return await upsertContact(
    {
      email,
      idioma: userData.idioma,
      pais: userData.pais,
      consentimiento: userData.consentimiento,
      tipo: "registrado",
    },
    listIds
  );
}

/**
 * Sincroniza un suscriptor de newsletter a Brevo
 */
export async function syncNewsletterSubscriberToBrevo(
  email: string,
  subscriberData: {
    idioma?: string;
    pais?: string;
    consentimiento: boolean;
  }
): Promise<boolean> {
  if (!subscriberData.consentimiento) {
    console.log(`[Brevo] Skipping newsletter subscriber ${email} - no consent`);
    return false;
  }

  const listIds = LIST_IDS.NEWSLETTER > 0 ? [LIST_IDS.NEWSLETTER] : [];

  return await upsertContact(
    {
      email,
      idioma: subscriberData.idioma,
      pais: subscriberData.pais,
      consentimiento: subscriberData.consentimiento,
      tipo: "newsletter",
    },
    listIds
  );
}

/**
 * Actualiza el total gastado de un comprador
 */
export async function updateBuyerTotalSpent(
  email: string,
  newTotal: number
): Promise<boolean> {
  const client = getBrevoClient();
  if (!client) {
    return false;
  }

  try {
    const updateContact = new brevo.UpdateContact();
    updateContact.attributes = {
      TOTAL_GASTADO: newTotal,
    };

    await client.contactsApi.updateContact(email, updateContact);
    return true;
  } catch (error) {
    console.error("[Brevo] Error updating buyer total:", error);
    return false;
  }
}

/**
 * Elimina un contacto de Brevo (derecho al olvido - GDPR)
 */
export async function deleteContact(email: string): Promise<boolean> {
  const client = getBrevoClient();
  if (!client) {
    return false;
  }

  try {
    await client.contactsApi.deleteContact(email);
    return true;
  } catch (error: any) {
    if (error.status === 404 || error.code === 404) {
      // Ya no existe, considerar éxito
      return true;
    }
    console.error("[Brevo] Error deleting contact:", error);
    return false;
  }
}

/**
 * Obtiene información de un contacto desde Brevo
 */
export async function getContactInfo(
  email: string
): Promise<brevo.GetExtendedContactDetails | null> {
  const client = getBrevoClient();
  if (!client) {
    return null;
  }

  try {
    const response = await client.contactsApi.getContactInfo(email);
    return response.body;
  } catch (error: any) {
    if (error.status === 404 || error.code === 404) {
      return null;
    }
    console.error("[Brevo] Error getting contact info:", error);
    return null;
  }
}

