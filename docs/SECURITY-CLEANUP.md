# 🔒 Limpieza de Secretos - Instrucciones de Seguridad

## ⚠️ Situación Actual

GitHub ha bloqueado el push (GH013) debido a una API Key de Brevo/Sendinblue que fue commiteada por error en el historial de git.

## ✅ Estado del Repositorio Actual

### Código Verificado ✅
- ✅ **NO hay API keys hardcodeadas** en el código fuente
- ✅ **Todas las referencias usan `process.env.BREVO_API_KEY`**
- ✅ **Archivos `.env*` están en `.gitignore`**
- ✅ **Documentación usa solo placeholders seguros**

### Archivos Seguros
- `lib/brevo.ts` - Usa `process.env.BREVO_API_KEY`
- `lib/email/brevo.ts` - Usa `process.env.BREVO_API_KEY`
- `app/api/brevo/sync/route.ts` - Usa `process.env.BREVO_SYNC_SECRET`
- `docs/brevo-setup.md` - Solo placeholders (`YOUR_BREVO_API_KEY`)

## 🧹 Limpieza del Historial de Git

### Opción 1: Reescritura de Historial (Recomendado si el repo es privado o tienes control total)

**⚠️ ADVERTENCIA:** Esto reescribe el historial. Si otros desarrolladores tienen clones del repo, necesitarán hacer un hard reset.

```bash
# 1. Identificar el commit problemático
git log --all --full-history --source -- docs/brevo-setup.md

# 2. Ver el contenido del archivo en commits anteriores
git log -p --all -- docs/brevo-setup.md

# 3. Usar git filter-repo (herramienta recomendada) o BFG Repo-Cleaner
# Instalar git-filter-repo:
# pip install git-filter-repo

# 4. Eliminar el secreto del historial
git filter-repo --path docs/brevo-setup.md --invert-paths
# O si quieres mantener el archivo pero limpiar el contenido:
git filter-repo --replace-text <(echo "xkeysib-REAL_KEY_HERE==>xkeysib-PLACEHOLDER_KEY")

# 5. Force push (SOLO si tienes control total del repo)
git push origin --force --all
git push origin --force --tags
```

### Opción 2: Rebase Interactivo (Si el commit problemático es reciente)

```bash
# 1. Ver los últimos commits
git log --oneline -10

# 2. Iniciar rebase interactivo desde antes del commit problemático
git rebase -i HEAD~N  # N = número de commits a revisar

# 3. En el editor, cambiar 'pick' por 'edit' en el commit problemático
# 4. Cuando git se detenga en ese commit:
git checkout HEAD -- docs/brevo-setup.md
# Editar el archivo para eliminar cualquier secreto real
# Luego:
git add docs/brevo-setup.md
git commit --amend --no-edit
git rebase --continue

# 5. Force push (SOLO si trabajas solo o coordinaste con el equipo)
git push origin --force
```

### Opción 3: Rotar la API Key (Más Seguro)

**Si no puedes limpiar el historial o el repo es público:**

1. **Rotar la API Key en Brevo:**
   - Ve a Brevo Dashboard > Settings > API Keys
   - Elimina la API Key comprometida
   - Crea una nueva API Key
   - Actualiza la variable de entorno en Vercel

2. **Verificar que no haya más secretos:**
   ```bash
   # Buscar posibles secretos en el historial
   git log -p --all -S "xkeysib-" --source --all
   ```

3. **Asegurar que el código actual esté limpio:**
   ```bash
   # Verificar que no hay secretos en el working directory
   grep -r "xkeysib-" --exclude-dir=node_modules .
   ```

## 🔐 Configuración en Vercel

### Variables de Entorno Requeridas

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** > **Environment Variables**
4. Agrega/Verifica estas variables:

```
BREVO_API_KEY=<tu-nueva-api-key>
BREVO_LIST_COMPRADORES=<id-lista>
BREVO_LIST_REGISTRADOS=<id-lista> (opcional)
BREVO_LIST_NEWSLETTER=<id-lista> (opcional)
BREVO_SYNC_SECRET=<secret-seguro> (opcional)
```

5. Asegúrate de que estén habilitadas para **Production**, **Preview** y **Development**
6. Haz un nuevo deploy para aplicar los cambios

## ✅ Verificación Final

### Checklist Pre-Push

- [ ] No hay archivos `.env*` en el repositorio
- [ ] No hay API keys hardcodeadas en el código
- [ ] La documentación solo usa placeholders
- [ ] `.gitignore` incluye `.env*`
- [ ] Las variables están configuradas en Vercel
- [ ] El código usa solo `process.env.*`

### Comandos de Verificación

```bash
# 1. Verificar que no hay .env files commiteados
git ls-files | grep -E "\.env"

# 2. Buscar posibles secretos en el código actual
grep -r "xkeysib-" --exclude-dir=node_modules --exclude-dir=.git .

# 3. Verificar que el código usa process.env
grep -r "BREVO_API_KEY" --exclude-dir=node_modules --include="*.ts" --include="*.tsx" .

# 4. Verificar .gitignore
cat .gitignore | grep -E "\.env"
```

## 🚀 Después de la Limpieza

1. **Rotar la API Key comprometida** (si aplica)
2. **Actualizar Vercel** con la nueva API Key
3. **Verificar que el código funciona** en desarrollo local
4. **Hacer un deploy de prueba** en Vercel
5. **Verificar que GitHub permite el push** (el error GH013 debería desaparecer)

## 📝 Notas Importantes

- **NUNCA** desbloquees secretos desde GitHub UI
- **NUNCA** hardcodees secretos en el código
- **SIEMPRE** usa variables de entorno
- **SIEMPRE** verifica `.gitignore` antes de commits
- **ROTA** las API keys si fueron expuestas

## 🔗 Referencias

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Git Filter Repo](https://github.com/newren/git-filter-repo)

