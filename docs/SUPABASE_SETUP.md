# Configuración Supabase (Go Natural)

## 1. Crear proyecto

1. [supabase.com](https://supabase.com) → New project.
2. **Settings → API**: copiar `Project URL` y `anon` `public` key a `.env.local` como `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## 2. Esquema y RLS

1. **SQL Editor** → nueva query.
2. Pegar el contenido de `supabase/migrations/001_init_schema.sql` y ejecutar (**Run**).
3. Comprueba en **Table Editor** que existan `profiles`, `addresses`, `orders`, `order_items`.

Las políticas **RLS** permiten a cada usuario leer/escribir solo sus filas. Los pedidos PayPal se insertan con el JWT del usuario en la ruta `/api/orders/paypal`.

## 3. Autenticación

1. **Authentication → URL configuration**:
   - **Site URL**: `http://localhost:3000` (producción: tu dominio).
   - **Redirect URLs**: incluye `http://localhost:3000/auth/callback` y el equivalente en producción.
2. Email: en desarrollo puedes desactivar “Confirm email” en **Authentication → Providers → Email** para probar sin bandeja.

## 4. Trigger `profiles`

El trigger `on_auth_user_created` crea una fila en `profiles` al registrarse un usuario. Si el SQL falla por sintaxis del trigger, revisa la versión de Postgres (Supabase suele usar PG 15): alterna `EXECUTE PROCEDURE` / `EXECUTE FUNCTION` según el mensaje de error.

## 5. Orden de operaciones en pagos

1. Cliente autenticado completa PayPal.
2. `POST /api/orders/paypal` valida sesión, inserta en `orders` + `order_items`, luego ejecuta `lib/orders` (p. ej. Google Sheets).

La base Supabase es la **fuente de verdad** del pedido; Sheets es secundario.
