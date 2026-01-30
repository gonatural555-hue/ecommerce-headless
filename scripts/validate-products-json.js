import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = process.cwd();
const PRODUCTS_CONFIG_PATH = path.join(PROJECT_ROOT, 'scripts', 'products');

function validateProductJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Verificar que no esté vacío
    if (!content.trim()) {
      return { valid: false, error: 'Archivo vacío' };
    }

    const data = JSON.parse(content);

    // Validar estructura requerida
    if (!data.slug || typeof data.slug !== 'string') {
      return { valid: false, error: 'Falta campo "slug" o no es string' };
    }

    if (!data.images || typeof data.images !== 'object') {
      return { valid: false, error: 'Falta campo "images" o no es objeto' };
    }

    // Validar arrays de imágenes
    const requiredArrays = ['featured', 'gallery', 'lifestyle', 'extras'];
    for (const key of requiredArrays) {
      if (!Array.isArray(data.images[key])) {
        return { valid: false, error: `images.${key} no es un array` };
      }
    }

    // Verificar que el slug coincida con el nombre del archivo
    const fileName = path.basename(filePath, '.json');
    if (data.slug !== fileName) {
      return { valid: false, error: `Slug "${data.slug}" no coincide con nombre de archivo "${fileName}"` };
    }

    // Contar total de imágenes
    const totalImages = 
      data.images.featured.length +
      data.images.gallery.length +
      data.images.lifestyle.length +
      data.images.extras.length;

    // Validar URLs si hay imágenes
    if (totalImages > 0) {
      const allImages = [
        ...data.images.featured,
        ...data.images.gallery,
        ...data.images.lifestyle,
        ...data.images.extras,
      ];

      for (const url of allImages) {
        if (typeof url !== 'string' || url.trim() === '') {
          return { valid: false, error: 'URL de imagen inválida o vacía' };
        }
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          return { valid: false, error: `URL no es válida: ${url}` };
        }
      }
    }

    return {
      valid: true,
      slug: data.slug,
      featured: data.images.featured.length,
      gallery: data.images.gallery.length,
      lifestyle: data.images.lifestyle.length,
      extras: data.images.extras.length,
      total: totalImages,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return { valid: false, error: `JSON inválido: ${error.message}` };
    }
    return { valid: false, error: `Error: ${error.message}` };
  }
}

function run() {
  console.log('🔍 Validando archivos JSON de productos...\n');

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

  const results = {
    valid: [],
    invalid: [],
    empty: [],
  };

  for (const file of files) {
    const filePath = path.join(PRODUCTS_CONFIG_PATH, file);
    const validation = validateProductJson(filePath);

    if (!validation.valid) {
      results.invalid.push({ file, error: validation.error });
      console.log(`❌ ${file}: ${validation.error}`);
    } else if (validation.total === 0) {
      results.empty.push({ file, slug: validation.slug });
      console.log(`⚠️  ${file}: Válido pero sin imágenes (debe eliminarse según regla 6)`);
    } else {
      results.valid.push({
        file,
        slug: validation.slug,
        featured: validation.featured,
        gallery: validation.gallery,
        lifestyle: validation.lifestyle,
        extras: validation.extras,
        total: validation.total,
      });
      console.log(`✅ ${file}: ${validation.total} imágenes (featured: ${validation.featured}, gallery: ${validation.gallery}, lifestyle: ${validation.lifestyle}, extras: ${validation.extras})`);
    }
  }

  console.log('\n📊 Resumen:');
  console.log(`   ✅ Válidos con imágenes: ${results.valid.length}`);
  console.log(`   ⚠️  Válidos sin imágenes (a eliminar): ${results.empty.length}`);
  console.log(`   ❌ Inválidos: ${results.invalid.length}`);

  if (results.empty.length > 0) {
    console.log('\n⚠️  Archivos a eliminar (sin imágenes):');
    results.empty.forEach(({ file }) => {
      console.log(`   - ${file}`);
    });
  }

  if (results.invalid.length > 0) {
    console.log('\n❌ Archivos con errores:');
    results.invalid.forEach(({ file, error }) => {
      console.log(`   - ${file}: ${error}`);
    });
  }

  return results;
}

run();

