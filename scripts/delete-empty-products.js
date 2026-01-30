import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = process.cwd();
const PRODUCTS_CONFIG_PATH = path.join(PROJECT_ROOT, 'scripts', 'products');

function validateProductJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    if (!content.trim()) {
      return { valid: false, error: 'Archivo vacío', total: 0 };
    }

    const data = JSON.parse(content);

    if (!data.slug || typeof data.slug !== 'string') {
      return { valid: false, error: 'Falta campo "slug"', total: 0 };
    }

    if (!data.images || typeof data.images !== 'object') {
      return { valid: false, error: 'Falta campo "images"', total: 0 };
    }

    const requiredArrays = ['featured', 'gallery', 'lifestyle', 'extras'];
    for (const key of requiredArrays) {
      if (!Array.isArray(data.images[key])) {
        return { valid: false, error: `images.${key} no es un array`, total: 0 };
      }
    }

    const fileName = path.basename(filePath, '.json');
    if (data.slug !== fileName) {
      return { valid: false, error: `Slug no coincide`, total: 0 };
    }

    const totalImages = 
      data.images.featured.length +
      data.images.gallery.length +
      data.images.lifestyle.length +
      data.images.extras.length;

    return {
      valid: totalImages > 0,
      total: totalImages,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return { valid: false, error: 'JSON inválido', total: 0 };
    }
    return { valid: false, error: error.message, total: 0 };
  }
}

function run() {
  console.log('🗑️  Eliminando archivos JSON vacíos o sin imágenes...\n');

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

  for (const file of files) {
    const filePath = path.join(PRODUCTS_CONFIG_PATH, file);
    const validation = validateProductJson(filePath);

    if (!validation.valid || validation.total === 0) {
      toDelete.push({ file, reason: validation.error || 'Sin imágenes' });
    }
  }

  if (toDelete.length === 0) {
    console.log('✅ No hay archivos para eliminar');
    return;
  }

  console.log(`📋 Archivos a eliminar: ${toDelete.length}\n`);

  let deleted = 0;
  let errors = 0;

  for (const { file, reason } of toDelete) {
    const filePath = path.join(PRODUCTS_CONFIG_PATH, file);
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Eliminado: ${file} (${reason})`);
      deleted++;
    } catch (error) {
      console.log(`❌ Error al eliminar ${file}: ${error.message}`);
      errors++;
    }
  }

  console.log(`\n📊 Resumen:`);
  console.log(`   ✅ Eliminados: ${deleted}`);
  if (errors > 0) {
    console.log(`   ❌ Errores: ${errors}`);
  }
  console.log(`   📦 Archivos restantes: ${files.length - deleted}`);
}

run();

