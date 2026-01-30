import fs from "fs";
import path from "path";

const PRODUCTS_DIR = path.join(process.cwd(), "scripts", "products");

const files = fs.readdirSync(PRODUCTS_DIR);

files.forEach((file) => {
  if (!file.endsWith(".json")) return;

  const filePath = path.join(PRODUCTS_DIR, file);

  try {
    const raw = fs.readFileSync(filePath, "utf-8");

    if (!raw.trim()) {
      throw new Error("Archivo vacío");
    }

    JSON.parse(raw);
    console.log(`✅ JSON OK → ${file}`);
  } catch (error) {
    console.error(`❌ JSON ROTO → ${file}`);
    console.error(`   Motivo: ${error.message}`);
  }
});
