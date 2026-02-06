/**
 * Google Sheets Integration - Order Control
 * 
 * Sistema de sincronización de pedidos con Google Sheets para control operativo.
 */

import { google } from "googleapis";
import type { Order } from "./orders";

export type OrderSheetRow = {
  orderId: string;
  fecha: string;
  email: string;
  monto: number;
  estado: string;
  emailEnviado: "Sí" | "No";
};

/**
 * Inicializa el cliente de Google Sheets
 */
function getSheetsClient() {
  const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS;
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

  if (!credentials || !spreadsheetId) {
    return null;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(credentials),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    return {
      sheets: google.sheets({ version: "v4", auth }),
      spreadsheetId,
    };
  } catch (error) {
    console.error("[Google Sheets] Error initializing client:", error);
    return null;
  }
}

/**
 * Obtiene el nombre de la hoja a usar
 */
function getSheetName(): string {
  return process.env.GOOGLE_SHEETS_SHEET_NAME || "Pedidos";
}

/**
 * Inicializa la hoja con los headers si no existen
 */
export async function initializeSheet(): Promise<boolean> {
  const client = getSheetsClient();
  if (!client) {
    console.warn("[Google Sheets] Client not configured");
    return false;
  }

  const sheetName = getSheetName();

  try {
    // Verificar si la hoja existe
    const spreadsheet = await client.sheets.spreadsheets.get({
      spreadsheetId: client.spreadsheetId,
    });

    const sheetExists = spreadsheet.data.sheets?.some(
      (sheet) => sheet.properties?.title === sheetName
    );

    if (!sheetExists) {
      // Crear la hoja
      await client.sheets.spreadsheets.batchUpdate({
        spreadsheetId: client.spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                },
              },
            },
          ],
        },
      });
    }

    // Verificar si tiene headers
    const range = `${sheetName}!A1:F1`;
    const response = await client.sheets.spreadsheets.values.get({
      spreadsheetId: client.spreadsheetId,
      range,
    });

    const values = response.data.values;

    // Si no hay headers, crearlos
    if (!values || values.length === 0) {
      await client.sheets.spreadsheets.values.update({
        spreadsheetId: client.spreadsheetId,
        range,
        valueInputOption: "RAW",
        requestBody: {
          values: [
            [
              "Order ID",
              "Fecha",
              "Email",
              "Monto",
              "Estado",
              "Email enviado",
            ],
          ],
        },
      });

      // Formatear headers
      await client.sheets.spreadsheets.batchUpdate({
        spreadsheetId: client.spreadsheetId,
        requestBody: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: spreadsheet.data.sheets?.find(
                    (s) => s.properties?.title === sheetName
                  )?.properties?.sheetId,
                  startRowIndex: 0,
                  endRowIndex: 1,
                  startColumnIndex: 0,
                  endColumnIndex: 6,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: {
                      red: 0.2,
                      green: 0.2,
                      blue: 0.2,
                    },
                    textFormat: {
                      foregroundColor: {
                        red: 1.0,
                        green: 1.0,
                        blue: 1.0,
                      },
                      bold: true,
                    },
                  },
                },
                fields: "userEnteredFormat(backgroundColor,textFormat)",
              },
            },
          ],
        },
      });
    }

    return true;
  } catch (error) {
    console.error("[Google Sheets] Error initializing sheet:", error);
    return false;
  }
}

/**
 * Convierte una orden a formato de fila de Google Sheets
 */
function orderToSheetRow(order: Order, emailSent: boolean): OrderSheetRow {
  return {
    orderId: order.id,
    fecha: order.createdAt.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    email: order.email,
    monto: order.totalAmount,
    estado: order.status === "created" ? "Creado" : order.status === "paid" ? "Pagado" : "Completado",
    emailEnviado: emailSent ? "Sí" : "No",
  };
}

/**
 * Agrega o actualiza una orden en Google Sheets
 */
export async function upsertOrderToSheet(
  order: Order,
  emailSent: boolean = false
): Promise<boolean> {
  const client = getSheetsClient();
  if (!client) {
    console.warn("[Google Sheets] Client not configured, skipping sync");
    return false;
  }

  try {
    // Inicializar la hoja si es necesario
    await initializeSheet();

    const sheetName = getSheetName();
    const row = orderToSheetRow(order, emailSent);

    // Buscar si la orden ya existe
    const allData = await client.sheets.spreadsheets.values.get({
      spreadsheetId: client.spreadsheetId,
      range: `${sheetName}!A:A`, // Solo columna A (Order ID)
    });

    const orderIds = allData.data.values || [];
    const orderIndex = orderIds.findIndex(
      (row) => row[0] === order.id
    );

    const values = [
      [
        row.orderId,
        row.fecha,
        row.email,
        row.monto.toString(),
        row.estado,
        row.emailEnviado,
      ],
    ];

    if (orderIndex === -1) {
      // Orden nueva, agregar al final
      await client.sheets.spreadsheets.values.append({
        spreadsheetId: client.spreadsheetId,
        range: `${sheetName}!A:F`,
        valueInputOption: "RAW",
        requestBody: {
          values,
        },
      });
    } else {
      // Orden existente, actualizar (sumar 1 porque el índice incluye el header)
      const rowNumber = orderIndex + 1;
      await client.sheets.spreadsheets.values.update({
        spreadsheetId: client.spreadsheetId,
        range: `${sheetName}!A${rowNumber}:F${rowNumber}`,
        valueInputOption: "RAW",
        requestBody: {
          values,
        },
      });
    }

    return true;
  } catch (error) {
    console.error("[Google Sheets] Error upserting order:", error);
    return false;
  }
}

/**
 * Sincroniza múltiples órdenes a Google Sheets
 */
export async function syncOrdersToSheet(
  orders: Order[],
  emailSentMap?: Map<string, boolean>
): Promise<{ synced: number; failed: number }> {
  let synced = 0;
  let failed = 0;

  for (const order of orders) {
    const emailSent = emailSentMap?.get(order.id) || false;
    const success = await upsertOrderToSheet(order, emailSent);
    if (success) {
      synced++;
    } else {
      failed++;
    }
  }

  return { synced, failed };
}

/**
 * Obtiene todas las órdenes de Google Sheets
 */
export async function getOrdersFromSheet(): Promise<OrderSheetRow[]> {
  const client = getSheetsClient();
  if (!client) {
    console.warn("[Google Sheets] Client not configured");
    return [];
  }

  try {
    const sheetName = getSheetName();
    const response = await client.sheets.spreadsheets.values.get({
      spreadsheetId: client.spreadsheetId,
      range: `${sheetName}!A2:F`, // Desde la fila 2 (saltar header)
    });

    const values = response.data.values || [];
    const rows: OrderSheetRow[] = [];

    for (const row of values) {
      if (row.length >= 6 && row[0]) {
        rows.push({
          orderId: row[0] as string,
          fecha: row[1] as string,
          email: row[2] as string,
          monto: parseFloat(row[3] as string) || 0,
          estado: row[4] as string,
          emailEnviado: (row[5] as string) === "Sí" ? "Sí" : "No",
        });
      }
    }

    return rows;
  } catch (error) {
    console.error("[Google Sheets] Error getting orders:", error);
    return [];
  }
}

/**
 * Actualiza el estado de "Email enviado" para una orden
 */
export async function updateEmailSentStatus(
  orderId: string,
  emailSent: boolean
): Promise<boolean> {
  const client = getSheetsClient();
  if (!client) {
    return false;
  }

  try {
    const sheetName = getSheetName();
    const allData = await client.sheets.spreadsheets.values.get({
      spreadsheetId: client.spreadsheetId,
      range: `${sheetName}!A:A`,
    });

    const orderIds = allData.data.values || [];
    const orderIndex = orderIds.findIndex((row) => row[0] === orderId);

    if (orderIndex === -1) {
      return false;
    }

    const rowNumber = orderIndex + 1;
    const status = emailSent ? "Sí" : "No";

    await client.sheets.spreadsheets.values.update({
      spreadsheetId: client.spreadsheetId,
      range: `${sheetName}!F${rowNumber}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[status]],
      },
    });

    return true;
  } catch (error) {
    console.error("[Google Sheets] Error updating email status:", error);
    return false;
  }
}

