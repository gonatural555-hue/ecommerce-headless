import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = process.cwd();
const PRODUCTS_CONFIG_PATH = path.join(PROJECT_ROOT, 'scripts', 'products');

// Función de validación (copiada del script de validación)
function validateProductJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    if (!content.trim()) {
      return { valid: false, error: 'Archivo vacío' };
    }

    const data = JSON.parse(content);

    if (!data.slug || typeof data.slug !== 'string') {
      return { valid: false, error: 'Falta campo "slug"' };
    }

    if (!data.images || typeof data.images !== 'object') {
      return { valid: false, error: 'Falta campo "images"' };
    }

    const requiredArrays = ['featured', 'gallery', 'lifestyle', 'extras'];
    for (const key of requiredArrays) {
      if (!Array.isArray(data.images[key])) {
        return { valid: false, error: `images.${key} no es un array` };
      }
    }

    const fileName = path.basename(filePath, '.json');
    if (data.slug !== fileName) {
      return { valid: false, error: `Slug no coincide` };
    }

    const totalImages = 
      data.images.featured.length +
      data.images.gallery.length +
      data.images.lifestyle.length +
      data.images.extras.length;

    return {
      valid: true,
      total: totalImages,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return { valid: false, error: 'JSON inválido' };
    }
    return { valid: false, error: error.message };
  }
}

function run() {
  console.log('🧹 Limpiando archivos JSON inválidos o vacíos...\n');

  if (!fs.existsSync(PRODUCTS_CONFIG_PATH)) {
    console.log('❌ Directorio scripts/products no existe');
    return;
  }

  const files = fs.readdirSync(PRODUCTS_CONFIG_PATH)
    .filter(file => file.endsWith('.json'));

  if (files.length === 0) {
    console.log('⚠️  No se encontraron archivos JSON');
    return;
  }

  const toDelete = [];
  const toFix = [];

  for (const file of files) {
    const filePath = path.join(PRODUCTS_CONFIG_PATH, file);
    const validation = validateProductJson(filePath);

    if (!validation.valid) {
      toDelete.push({ file, reason: validation.error });
    } else if (validation.total === 0) {
      toDelete.push({ file, reason: 'Sin imágenes (regla 6)' });
    }
  }

  console.log(`📋 Archivos a eliminar: ${toDelete.length}`);
  if (toDelete.length > 0) {
    console.log('\nArchivos que serán eliminados:');
    toDelete.forEach(({ file, reason }) => {
      console.log(`   - ${file} (${reason})`);
    });

    console.log('\n⚠️  Esta acción eliminará los archivos listados.');
    console.log('   Para ejecutar la limpieza, descomenta las líneas de eliminación al final del script.');
    
    // Descomentar para ejecutar la eliminación:
    // for (const { file } of toDelete) {
    //   const filePath = path.join(PRODUCTS_CONFIG_PATH, file);
    //   fs.unlinkSync(filePath);
    //   console.log(`✅ Eliminado: ${file}`);
    // }
  } else {
    console.log('✅ No hay archivos para eliminar');
  }

  return toDelete;
}

run();

