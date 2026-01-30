import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = process.cwd();
const PRODUCTS_CONFIG_PATH = path.join(PROJECT_ROOT, 'scripts', 'products');
const PRODUCTS_LIB_PATH = path.join(PROJECT_ROOT, 'lib', 'products.ts');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Directorio creado: ${dirPath}`);
  }
}

/**
 * Genera la estructura base de un JSON de producto usando el ID
 */
function generateProductBase(productId) {
  return {
    id: productId,
    images: {
      featured: [],
      gallery: [],
      lifestyle: [],
      extras: []
    }
  };
}

/**
 * Extrae todos los productos desde lib/products.ts usando regex
 * @returns Array de objetos con { id, title }
 */
function extractProductsFromLib() {
  const content = fs.readFileSync(PRODUCTS_LIB_PATH, 'utf-8');
  const products = [];
  
  // Regex para encontrar productos con id y title
  const productRegex = /\{\s*id:\s*"([^"]+)",\s*title:\s*"([^"]+)"/g;
  let match;
  
  while ((match = productRegex.exec(content)) !== null) {
    const id = match[1];
    const title = match[2];
    products.push({ id, title });
  }
  
  return products;
}

/**
 * Lee archivos JSON existentes y los migra de slug a id si es necesario
 */
function readExistingJsonFiles() {
  const jsonFiles = fs.readdirSync(PRODUCTS_CONFIG_PATH)
    .filter(file => file.endsWith('.json'));
  
  const existingFiles = new Set();
  
  for (const file of jsonFiles) {
    const filePath = path.join(PRODUCTS_CONFIG_PATH, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      // Si el archivo tiene slug pero no id, necesitamos migrarlo
      if (data.slug && !data.id) {
        existingFiles.add(data.slug);
      } else if (data.id) {
        // Si ya tiene id, registrar el id
        existingFiles.add(data.id);
      }
    } catch (err) {
      console.warn(`⚠️  Error leyendo ${file}:`, err.message);
    }
  }
  
  return existingFiles;
}

/**
 * Migra un archivo JSON de slug a id
 */
function migrateJsonFromSlugToId(oldFilePath, newFilePath, productId) {
  try {
    const content = fs.readFileSync(oldFilePath, 'utf-8');
    const data = JSON.parse(content);
    
    // Si ya tiene id correcto, solo renombrar
    if (data.id === productId) {
      fs.renameSync(oldFilePath, newFilePath);
      return true;
    }
    
    // Si tiene slug, migrar a id
    if (data.slug) {
      const migratedData = {
        id: productId,
        images: data.images || {
          featured: [],
          gallery: [],
          lifestyle: [],
          extras: []
        }
      };
      
      // Preservar otros campos si existen
      if (data.title) migratedData.title = data.title;
      if (data.price) migratedData.price = data.price;
      if (data.category) migratedData.category = data.category;
      if (data.description) migratedData.description = data.description;
      if (data.features) migratedData.features = data.features;
      
      fs.writeFileSync(newFilePath, JSON.stringify(migratedData, null, 2), 'utf-8');
      
      // Eliminar el archivo viejo si el nombre es diferente
      if (oldFilePath !== newFilePath) {
        fs.unlinkSync(oldFilePath);
      }
      
      return true;
    }
    
    return false;
  } catch (err) {
    console.warn(`⚠️  Error migrando ${oldFilePath}:`, err.message);
    return false;
  }
}

function run() {
  console.log('🟢 Script generate-products-base.js iniciado');
  console.log('🔄 Refactorizado para usar product.id como fuente de verdad\n');

  ensureDir(PRODUCTS_CONFIG_PATH);

  // Extraer productos desde lib/products.ts
  const products = extractProductsFromLib();
  console.log(`📋 Productos encontrados en lib/products.ts: ${products.length}`);

  // Leer archivos JSON existentes
  const existingFiles = readExistingJsonFiles();
  console.log(`📋 Archivos JSON existentes: ${existingFiles.size}\n`);

  let created = 0;
  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  // Para cada producto, crear o migrar su archivo JSON
  for (const product of products) {
    const newFilePath = path.join(PRODUCTS_CONFIG_PATH, `${product.id}.json`);
    
    // Si el archivo ya existe con el nombre correcto, verificar estructura
    if (fs.existsSync(newFilePath)) {
      try {
        const content = fs.readFileSync(newFilePath, 'utf-8');
        const data = JSON.parse(content);
        
        // Si tiene id correcto, está bien
        if (data.id === product.id) {
          // Verificar que tenga la estructura de imágenes
          if (!data.images) {
            const updatedData = {
              ...data,
              images: {
                featured: [],
                gallery: [],
                lifestyle: [],
                extras: []
              }
            };
            fs.writeFileSync(newFilePath, JSON.stringify(updatedData, null, 2), 'utf-8');
            console.log(`🔄 Actualizado: ${product.id}.json (agregada estructura de imágenes)`);
            migrated++;
          } else {
            console.log(`⏭️  Saltado (ya existe): ${product.id}.json`);
            skipped++;
          }
          continue;
        }
      } catch (err) {
        console.warn(`⚠️  Error leyendo ${newFilePath}:`, err.message);
        errors++;
        continue;
      }
    }
    
    // Buscar si existe un archivo con slug que necesite migración
    let foundOldFile = false;
    const jsonFiles = fs.readdirSync(PRODUCTS_CONFIG_PATH)
      .filter(file => file.endsWith('.json'));
    
    for (const file of jsonFiles) {
      const oldFilePath = path.join(PRODUCTS_CONFIG_PATH, file);
      try {
        const content = fs.readFileSync(oldFilePath, 'utf-8');
        const data = JSON.parse(content);
        
        // Si encontramos un archivo con slug que podría corresponder a este producto
        // (esto es una migración parcial, solo para archivos que ya existen)
        if (data.slug && file === `${data.slug}.json`) {
          // Intentar migrar si el slug parece relacionado
          // Por ahora, solo migramos si el archivo tiene el mismo nombre base
          // En una migración completa, necesitaríamos un mapeo manual
          foundOldFile = true;
          break;
        }
      } catch (err) {
        // Continuar con el siguiente archivo
      }
    }
    
    // Si no encontramos un archivo viejo, crear uno nuevo
    if (!foundOldFile) {
      const productBase = generateProductBase(product.id);
      const jsonContent = JSON.stringify(productBase, null, 2);
      
      fs.writeFileSync(newFilePath, jsonContent, 'utf-8');
      console.log(`✅ Creado: ${product.id}.json`);
      created++;
    }
  }

  console.log('\n📊 Resumen:');
  console.log(`   ✅ Creados: ${created}`);
  console.log(`   🔄 Migrados/Actualizados: ${migrated}`);
  console.log(`   ⏭️  Saltados: ${skipped}`);
  if (errors > 0) {
    console.log(`   ⚠️  Errores: ${errors}`);
  }
  console.log(`   📦 Total productos: ${products.length}`);

  console.log('\n💡 Nota: Los archivos JSON ahora usan "id" en lugar de "slug"');
  console.log('   Los archivos se nombran como: {product.id}.json');
  console.log('   Ejemplo: gn-fishing-eq-008.json\n');

  console.log('🟢 Script finalizado');
}

run();

