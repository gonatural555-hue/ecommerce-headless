import type { VariantDefinition } from "@/lib/product-variants";

export function isColorVariantType(type: string): boolean {
  const t = type.toLowerCase();
  return t === "color" || t === "colour" || t.includes("color");
}

export function isSizeVariantType(type: string): boolean {
  const t = type.toLowerCase();
  return (
    t === "size" ||
    t === "talla" ||
    t === "talle" ||
    t.includes("size") ||
    t.includes("talla")
  );
}

/** Heurística para relleno visual de swatches (no copia de marcas externas). */
export function swatchFillForOption(value: string, label: string): string {
  const key = (value || label).toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  const map: Record<string, string> = {
    negro: "#1c1c1c",
    black: "#1c1c1c",
    blanco: "#f4f4f4",
    white: "#f4f4f4",
    verde: "#2d4a3a",
    green: "#2d4a3a",
    marron: "#5c4033",
    brown: "#5c4033",
    naranja: "#c45c26",
    orange: "#c45c26",
    amarillo: "#d4a017",
    yellow: "#d4a017",
    rojo: "#9b2335",
    red: "#9b2335",
    azul: "#1e3a5f",
    blue: "#1e3a5f",
    gris: "#6b7280",
    gray: "#6b7280",
    grey: "#6b7280",
  };
  return map[key] ?? "#9ca3af";
}

export function splitVariantDefinitions(variants: VariantDefinition[]): {
  color?: VariantDefinition;
  size?: VariantDefinition;
  other: VariantDefinition[];
} {
  let color: VariantDefinition | undefined;
  let size: VariantDefinition | undefined;
  const other: VariantDefinition[] = [];

  for (const v of variants) {
    if (!color && isColorVariantType(v.type)) {
      color = v;
    } else if (!size && isSizeVariantType(v.type)) {
      size = v;
    } else {
      other.push(v);
    }
  }

  return { color, size, other };
}
