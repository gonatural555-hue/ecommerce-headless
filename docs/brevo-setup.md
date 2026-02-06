# Configuración de Brevo (Sendinblue) - CRM & Email Automation

## Configuración Inicial

### 1. Crear cuenta en Brevo

1. Ve a [Brevo](https://www.brevo.com/) y crea una cuenta
2. Verifica tu cuenta de email

### 2. Obtener API Key

1. Ve a "Settings" > "API Keys"
2. Crea una nueva API Key con permisos de "Contacts" y "Email"
3. Copia la API Key (solo se muestra una vez)

### 3. Crear Listas en Brevo

1. Ve a "Contacts" > "Lists"
2. Crea las siguientes listas:
   - **"Clientes Go Natural"** (o el nombre que prefieras para compradores)
   - **"Usuarios Registrados"** (opcional)
   - **"Suscriptores Newsletter"** (opcional)
3. Copia el ID de cada lista (visible en la URL o en la configuración)

### 4. Configurar Atributos Personalizados

1. Ve a "Contacts" > "Attributes"
2. Crea los siguientes atributos personalizados:
   - **FECHA_PRIMERA_COMPRA** (Date)
   - **TOTAL_GASTADO** (Number)
   - **IDIOMA** (Text)
   - **PAIS** (Text)
   - **TIPO_CONTACTO** (Text) - Valores: "comprador", "registrado", "newsletter"

### 5. Configurar Variables de Entorno

Agrega estas variables a tu `.env.local`:

```env
# Brevo Configuration
BREVO_API_KEY=tu_api_key_aqui
BREVO_LIST_COMPRADORES=1
BREVO_LIST_REGISTRADOS=2
BREVO_LIST_NEWSLETTER=3

# Opcional: Secret para proteger el endpoint de sincronización
BREVO_SYNC_SECRET=tu_secret_aqui
```

## Funcionalidades

### Sincronización Automática

El sistema sincroniza automáticamente cuando:
- Se crea una orden pagada/completada → Se agrega a lista de compradores
- Se registra un usuario (con consentimiento) → Se agrega a lista de registrados
- Se suscribe al newsletter (con consentimiento) → Se agrega a lista de newsletter

### Sincronización Manual

Para sincronizar contactos manualmente:

```bash
POST /api/brevo/sync
Authorization: Bearer YOUR_SECRET
Content-Type: application/json

{
  "type": "buyer", // "buyer" | "registered" | "newsletter"
  "contacts": [
    {
      "email": "cliente@email.com",
      "fechaPrimeraCompra": "2024-01-15T10:00:00Z",
      "totalGastado": 150.00,
      "idioma": "es",
      "pais": "AR",
      "consentimiento": true
    }
  ]
}
```

## Cumplimiento GDPR

### Consentimiento Explícito

- **Usuarios UE**: Requieren consentimiento explícito antes de sincronizar
- **Usuarios fuera de UE**: Consentimiento implícito por compra (pero se verifica si hay consentimiento explícito)

### Países UE que Requieren Consentimiento

Austria, Bélgica, Bulgaria, Croacia, Chipre, República Checa, Dinamarca, Estonia, Finlandia, Francia, Alemania, Grecia, Hungría, Irlanda, Italia, Letonia, Lituania, Luxemburgo, Malta, Países Bajos, Polonia, Portugal, Rumania, Eslovaquia, Eslovenia, España, Suecia.

### Manejo de Consentimiento

El sistema usa `lib/consent-utils.ts` para:
- Verificar consentimiento antes de sincronizar
- Guardar estado de consentimiento en localStorage
- Detectar si el usuario es de la UE

## Separación de Contactos

### Compradores
- Lista: `BREVO_LIST_COMPRADORES`
- Atributos: email, fechaPrimeraCompra, totalGastado, idioma, país
- Se sincroniza cuando: orden pagada o completada

### Usuarios Registrados
- Lista: `BREVO_LIST_REGISTRADOS`
- Atributos: email, idioma, país
- Se sincroniza cuando: usuario se registra con consentimiento

### Suscriptores Newsletter
- Lista: `BREVO_LIST_NEWSLETTER`
- Atributos: email, idioma, país
- Se sincroniza cuando: usuario se suscribe con consentimiento

## Prevención de Duplicados

- El sistema verifica si el contacto existe antes de crear
- Si existe, actualiza los atributos en lugar de duplicar
- Los contactos pueden estar en múltiples listas

## Notas Importantes

- **NO se envían campañas automáticamente** - Solo se sincronizan contactos
- **NO se rompe el flujo de compra** - La sincronización es asíncrona y no bloquea
- **Solo compradores reales** - Se sincronizan solo órdenes pagadas/completadas
- **Consentimiento explícito requerido** - Para usuarios UE, se requiere consentimiento antes de sincronizar

