# Configuración de Google Sheets para Control de Pedidos

## Estructura de la Hoja

El sistema crea automáticamente una hoja con las siguientes columnas:

| Order ID | Fecha | Email | Monto | Estado | Email enviado |
|----------|-------|-------|-------|--------|---------------|
| order_123 | 15/01/2024 | cliente@email.com | 150.00 | Completado | Sí |

## Configuración

### 1. Crear una cuenta de servicio en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google Sheets:
   - Ve a "APIs & Services" > "Library"
   - Busca "Google Sheets API"
   - Haz clic en "Enable"

### 2. Crear credenciales de cuenta de servicio

1. Ve a "APIs & Services" > "Credentials"
2. Haz clic en "Create Credentials" > "Service Account"
3. Completa el formulario y crea la cuenta
4. Haz clic en la cuenta creada y ve a la pestaña "Keys"
5. Haz clic en "Add Key" > "Create new key"
6. Selecciona "JSON" y descarga el archivo

### 3. Compartir la hoja de Google Sheets

1. Crea una nueva hoja de cálculo en Google Sheets
2. Copia el ID de la hoja desde la URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```
3. Comparte la hoja con el email de la cuenta de servicio (encontrado en el JSON descargado)
4. Dale permisos de "Editor"

### 4. Configurar variables de entorno

Agrega estas variables a tu `.env.local`:

```env
# Google Sheets Configuration
GOOGLE_SHEETS_ID=tu_spreadsheet_id_aqui
GOOGLE_SHEETS_CREDENTIALS={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
GOOGLE_SHEETS_SHEET_NAME=Pedidos

# Opcional: Secret para proteger el endpoint de sincronización
SYNC_ORDERS_SECRET=tu_secret_aqui
```

**Importante:** El `GOOGLE_SHEETS_CREDENTIALS` debe ser el contenido completo del archivo JSON como una cadena de texto (una sola línea).

## Uso

### Sincronización Automática

El sistema sincroniza automáticamente cuando:
- Se crea una orden (`ORDER_CREATED`)
- Se marca como pagada (`ORDER_PAID`)
- Se completa (`ORDER_COMPLETED`)

### Sincronización Manual (Proceso Diario)

Para sincronizar manualmente todas las órdenes:

```bash
POST /api/sync-orders
Authorization: Bearer YOUR_SECRET
Content-Type: application/json

{
  "orders": [
    {
      "id": "order_123",
      "email": "cliente@email.com",
      "items": [...],
      "totalAmount": 150.00,
      "currency": "USD",
      "paymentMethod": "paypal",
      "status": "completed",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "emailSentMap": {
    "order_123": true
  }
}
```

### Obtener Órdenes desde Google Sheets

```bash
GET /api/sync-orders
```

## Columnas de la Hoja

- **Order ID**: Identificador único de la orden
- **Fecha**: Fecha de creación (formato DD/MM/YYYY)
- **Email**: Email del cliente
- **Monto**: Monto total de la orden
- **Estado**: Creado / Pagado / Completado
- **Email enviado**: Sí / No

## Notas

- La hoja se inicializa automáticamente con los headers si no existen
- Los estados se actualizan automáticamente cuando cambia el estado de la orden
- El campo "Email enviado" se actualiza cuando se envía un email transaccional

