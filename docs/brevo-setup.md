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

#### ⚠️ IMPORTANTE: Seguridad de Secretos

**NUNCA commitees API keys o secretos al repositorio.** Todos los secretos deben configurarse exclusivamente mediante variables de entorno.

#### Para Desarrollo Local

Crea un archivo `.env.local` en la raíz del proyecto (este archivo ya está en `.gitignore`):

```env
# Brevo Configuration
BREVO_API_KEY=YOUR_BREVO_API_KEY_HERE
BREVO_LIST_COMPRADORES=YOUR_LIST_ID_HERE
BREVO_LIST_REGISTRADOS=YOUR_LIST_ID_HERE
BREVO_LIST_NEWSLETTER=YOUR_LIST_ID_HERE

# Opcional: Secret para proteger el endpoint de sincronización
BREVO_SYNC_SECRET=YOUR_SECRET_HERE
```

**Reemplaza los valores `YOUR_*_HERE` con tus valores reales.** Este archivo nunca debe ser commiteado.

#### Para Producción (Vercel)

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Navega a **Settings** > **Environment Variables**
3. Agrega las siguientes variables:

| Variable | Valor | Entornos |
|----------|-------|----------|
| `BREVO_API_KEY` | Tu API Key de Brevo | Production, Preview, Development |
| `BREVO_LIST_COMPRADORES` | ID de la lista de compradores | Production, Preview, Development |
| `BREVO_LIST_REGISTRADOS` | ID de la lista de registrados (opcional) | Production, Preview, Development |
| `BREVO_LIST_NEWSLETTER` | ID de la lista de newsletter (opcional) | Production, Preview, Development |
| `BREVO_SYNC_SECRET` | Secret para proteger el endpoint (opcional) | Production, Preview, Development |

4. Haz clic en **Save** para cada variable
5. Vercel aplicará automáticamente estas variables en el próximo deploy

#### Verificación

El código verifica automáticamente si las variables están configuradas:
- Si falta `BREVO_API_KEY`, el sistema loguea un warning pero no rompe el flujo
- Los emails y sincronizaciones solo funcionan si las variables están correctamente configuradas

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
Authorization: Bearer YOUR_BREVO_SYNC_SECRET
Content-Type: application/json

{
  "type": "buyer", // "buyer" | "registered" | "newsletter"
  "contacts": [
    {
      "email": "cliente@example.com",
      "fechaPrimeraCompra": "2024-01-15T10:00:00Z",
      "totalGastado": 150.00,
      "idioma": "es",
      "pais": "AR",
      "consentimiento": true
    }
  ]
}
```

**Nota:** Reemplaza `YOUR_BREVO_SYNC_SECRET` con el valor de `BREVO_SYNC_SECRET` configurado en tus variables de entorno. Si no configuraste `BREVO_SYNC_SECRET`, el endpoint no requiere autenticación (no recomendado para producción).

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

