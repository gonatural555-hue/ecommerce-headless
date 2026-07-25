# Deploy — GitHub + Vercel (Buenos Productos)

## Estado del repo

- **GitHub:** https://github.com/gonatural555-hue/ecommerce-headless
- **Rama:** `main`
- **Build local:** `npm run build` (debe pasar antes de deploy)

## 1. GitHub

El código ya está en GitHub. Para subir cambios nuevos:

```powershell
git status
git add .
git commit -m "tu mensaje"
git push origin main
```

`.env.local` **no** se sube (está en `.gitignore`).

## 2. Vercel — primera vez

1. Entrá a https://vercel.com e iniciá sesión con GitHub.
2. **Add New → Project** → importá `gonatural555-hue/ecommerce-headless`.
3. Framework: **Next.js** (auto-detectado).
4. **Environment Variables:** copiá desde `.env.local` (ver `.env.example` para la lista completa).
5. En producción, agregá también:
   - `NEXT_PUBLIC_BASE_URL` = `https://tu-proyecto.vercel.app` (o tu dominio custom)
   - `PAYPAL_ENV` = `live` solo cuando estés listo para cobros reales
6. **Deploy**.

## 3. Vercel — CLI (opcional)

```powershell
npx vercel login
npx vercel link
npx vercel env pull .env.vercel.local
npx vercel --prod
```

## 4. Supabase post-deploy

1. Ejecutá todas las migraciones en **SQL Editor** (`supabase/migrations/`), incluida `005_withdrawal_requests.sql`.
2. **Authentication → URL Configuration:**
   - Site URL: tu URL de Vercel
   - Redirect URLs: `https://tu-dominio/auth/callback`

## 5. PayPal producción

En https://developer.paypal.com, agregá tu dominio Vercel a las URLs permitidas de la app Live.

## 6. Checklist rápido

- [ ] `npm run build` OK
- [ ] Variables en Vercel (Production)
- [ ] Migraciones Supabase aplicadas
- [ ] Auth redirect URLs actualizadas
- [ ] `NEXT_PUBLIC_BASE_URL` apunta al dominio final
- [ ] Probar checkout y formulario de arrepentimiento en producción
