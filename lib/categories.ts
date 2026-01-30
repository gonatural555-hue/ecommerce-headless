import { Product, getProducts } from "@/lib/products";

export interface Category {
  slug: string;
  name: string;
  description: string;
  parentSlug?: string;
}

export const CATEGORIES: Category[] = [
  // ===== CATEGORÍAS PRINCIPALES (PADRE) =====
  {
    slug: "fishing",
    name: "Fishing",
    description: "Todo lo necesario para la pesca deportiva y recreativa.",
  },
  {
    slug: "mountain-snow",
    name: "Mountain & Snow",
    description: "Equipamiento para montaña y deportes de nieve.",
  },
  {
    slug: "water-sports",
    name: "Water Sports",
    description: "Equipamiento para deportes acuáticos y actividades en el agua.",
  },
  {
    slug: "outdoor-adventure",
    name: "Outdoor & Adventure",
    description: "Equipamiento para aventuras al aire libre y exploración.",
  },
  {
    slug: "active-sports",
    name: "Active Sports",
    description: "Equipamiento para deportes activos y entrenamiento.",
  },
  // ===== SUBCATEGORÍAS (HIJO) =====
  // Fishing subcategorías
  {
    slug: "fishing-equipment",
    name: "Fishing Equipment",
    description: "Equipamiento esencial para pescadores (cañas, carretes, combos).",
    parentSlug: "fishing",
  },
  {
    slug: "fishing-gadgets",
    name: "Fishing Gadgets",
    description: "Gadgets, herramientas y accesorios innovadores para pesca.",
    parentSlug: "fishing",
  },
  // Mountain & Snow subcategorías
  {
    slug: "ski",
    name: "Ski",
    description: "Equipamiento y accesorios para esquí.",
    parentSlug: "mountain-snow",
  },
  {
    slug: "snowboard",
    name: "Snowboard",
    description: "Equipamiento y accesorios para snowboard.",
    parentSlug: "mountain-snow",
  },
  // Water Sports subcategorías
  {
    slug: "surfing",
    name: "Surfing",
    description: "Accesorios y equipamiento para surf.",
    parentSlug: "water-sports",
  },
  {
    slug: "diving-swimming-equipment",
    name: "Diving & Swimming Equipment",
    description: "Equipamiento profesional para buceo y natación.",
    parentSlug: "water-sports",
  },
  // Outdoor & Adventure subcategorías
  {
    slug: "trekking",
    name: "Trekking",
    description: "Equipamiento esencial para trekking y senderismo.",
    parentSlug: "outdoor-adventure",
  },
  {
    slug: "camping-survival-gear",
    name: "Camping & Survival Gear",
    description: "Equipamiento de camping y supervivencia.",
    parentSlug: "outdoor-adventure",
  },
  {
    slug: "outdoor-lighting",
    name: "Outdoor Lighting",
    description: "Iluminación para camping y actividades outdoor.",
    parentSlug: "outdoor-adventure",
  },
  {
    slug: "sleeping-systems",
    name: "Sleeping Systems",
    description: "Sistemas de descanso para camping y aventuras.",
    parentSlug: "outdoor-adventure",
  },
  // Active Sports subcategorías
  {
    slug: "cycling",
    name: "Cycling",
    description: "Accesorios y equipamiento para ciclismo.",
    parentSlug: "active-sports",
  },
  {
    slug: "running",
    name: "Running",
    description: "Equipamiento y accesorios para running.",
    parentSlug: "active-sports",
  },
];

// Mapeo de productos existentes a categorías por slug
// Los productos se asignan a subcategorías (hijo) cuando corresponde
// Si no hay subcategoría específica, se asigna a la categoría principal (padre)
const PRODUCT_CATEGORY_MAP: Record<string, string[]> = {
  // Productos genéricos - asignados a categorías principales
  "1": ["cycling", "active-sports"], // Gafas deportivas
  "2": ["trekking", "camping-survival-gear", "outdoor-adventure"], // Mochila táctica
  "3": ["running", "active-sports"], // Smartwatch
  // Fishing - asignados a subcategorías
  "gn-fishing-001": ["fishing-equipment"], // Caña de Pescar Telescópica de Carbono Ultraligera
  "gn-fishing-002": ["fishing-equipment"], // PHISHGER Caña de Pescar de Viaje en Carbono
  "gn-fishing-003": ["fishing-equipment"], // Kit Completo de Pesca Telescópico con Carrete
  "gn-fishing-004": ["fishing-equipment"], // Caña UL/L para Trucha en Carbono Sólido
  "gn-fishing-005": ["fishing-equipment"], // MAXIMUS Traveller Caña de Señuelo con Anillas FUJI
  "gn-fishing-eq-006": ["fishing-gadgets"], // Alicates de Pesca Multifunción con Cortador de Línea
  "gn-fishing-eq-007": ["fishing-equipment"], // KastKing Sharky III Carrete Giratorio Spinning
  "gn-fishing-eq-008": ["fishing-equipment"], // BEARKING BKT Carrete Giratorio Spinning
  // Mountain & Snow - asignados a subcategorías
  "gn-ski-snow-001": ["ski"], // Gafas de Esquí & Snowboard KAPVOE Fotocromáticas Magnéticas UV400
  "gn-ski-snow-002": ["ski"], // Parka Técnica de Invierno con Capucha – Outdoor Military Anorak
  "gn-ski-snow-003": ["ski"], // Chaqueta Impermeable Unisex JNLN – Cortaviento Térmica
  "gn-ski-snow-004": ["ski"], // Chaqueta Polar con Capucha – Lana Sintética
  "gn-ski-snow-005": ["ski"], // Chaqueta Softshell de Invierno – Resistente al Viento
  "gn-ski-snow-006": ["ski"], // Chaqueta Calefactable USB – 21 Zonas de Calor
  "gn-ski-snow-jacket-001": ["ski"], // Alpine Shell Jacket — Quiet Winter Layer
  "gn-ski-snow-pants-001": ["ski"], // Alpine Snow Pants — Quiet Winter Protection
  // Cycling - asignados a subcategoría
  "gn-cycling-010": ["cycling"], // Gafas de Ciclismo KAPVOE UV400 – Lente Polarizada Deportiva (Unisex)
  "gn-cycling-011": ["cycling"], // Gafas de Ciclismo KAPVOE Fotocromáticas UV400 – Lente Adaptativa (Unisex)
  "gn-cycling-012": ["cycling"], // Pasamontañas / Balaclava Térmica ROCKBROS – Cortaviento y Transpirable
  "gn-cycling-013": ["cycling"], // Cuello / Braga Polar ROCKBROS – Protección Térmica Multifunción
  "gn-cycling-014": ["cycling"], // Guantes de Ciclismo ROCKBROS Medio Dedo – Antideslizantes (Verano)
  "gn-cycling-015": ["cycling"], // Luz Trasera de Bicicleta ROCKBROS USB – IPX6 / IPX7
  "gn-cycling-016": ["cycling"], // Luz Trasera ROCKBROS con Sensor de Freno Inteligente (USB-C)
  "gn-cycling-clothes-001": ["cycling"], // Thermal Cycling Jacket – All-Season Performance Layer
  "gn-cycling-clothes-002": ["cycling"], // Thermal Cycling Jacket – Long-Ride Weather Layer
  // Water Sports - Diving & Swimming Equipment
  "gn-water-001": ["diving-swimming-equipment"], // Máscara de Snorkel Full Face con Soporte para Cámara
  "gn-water-002": ["diving-swimming-equipment"], // Calcetines de Agua de Neopreno 3 mm
  "gn-water-003": ["diving-swimming-equipment"], // Guantes de Buceo de Neopreno 3 mm
  "gn-water-004": ["diving-swimming-equipment"], // Aletas de Snorkel Ajustables de Viaje
  "gn-water-005": ["diving-swimming-equipment"], // Boya de Natación Inflable con Bolsa Estanca
  "gn-water-006": ["diving-swimming-equipment"], // Mochila / Bolsa Seca Impermeable PVC
  "gn-water-007": ["diving-swimming-equipment"], // Mini Tanque de Buceo TRIMIX 0.5L con Máscara – Snorkel y Buceo Recreativo
  // Outdoor & Adventure
  "gn-outdoor-001": ["camping-survival-gear"], // Tienda de Campaña Ultraligera 1–2 Personas (Económica)
  "gn-outdoor-002": ["camping-survival-gear"], // Tienda Naturehike Cloud Up (Premium)
  "gn-outdoor-003": ["outdoor-lighting"], // Linterna LED Táctica Recargable 2000 LM
  "gn-outdoor-004": ["outdoor-lighting"], // Linterna LED Compacta Mini
  "gn-outdoor-005": ["sleeping-systems"], // Cama Plegable de Camping 300 lb
  "gn-outdoor-006": ["sleeping-systems"], // Cuna Plegable Ultraligera WESTTUNE
  "gn-outdoor-007": ["camping-survival-gear"], // Saco de Dormir PACOONE (4 Estaciones)
  "gn-outdoor-008": ["camping-survival-gear"], // Colchoneta / Colchón Inflable TARKA – Autoinflable
  "gn-outdoor-009": ["camping-survival-gear"], // Nevera Portátil Rígida (22–25 L)
  "gn-outdoor-010": ["camping-survival-gear"], // Caja de Hielo Portátil – Cooler Outdoor (Variable)
  "gn-outdoor-shoes-001": ["trekking"], // Trekking Shoes — Quiet Terrain Stability
  "gn-outdoor-shoes-002": ["trekking"], // Trekking Shoes — Steady Long-Distance Comfort
};

export function getAllCategories(): Category[] {
  return CATEGORIES;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((cat) => cat.slug === slug);
}

export function getCategorySlugs(): string[] {
  return CATEGORIES.map((cat) => cat.slug);
}

export function getMainCategories(): Category[] {
  return CATEGORIES.filter((cat) => !cat.parentSlug);
}

export function getSubcategories(parentSlug: string): Category[] {
  return CATEGORIES.filter((cat) => cat.parentSlug === parentSlug);
}

export function getCategoryWithChildren(slug: string): {
  category: Category;
  subcategories: Category[];
} | null {
  const category = getCategoryBySlug(slug);
  if (!category) return null;

  const subcategories = getSubcategories(slug);
  return { category, subcategories };
}

export function getProductsByCategorySlug(slug: string): Product[] {
  const allProducts = getProducts();
  const category = getCategoryBySlug(slug);
  
  // Si es categoría principal, incluir productos de sus subcategorías
  const slugsToMatch = category && !category.parentSlug
    ? [slug, ...getSubcategories(slug).map((sub) => sub.slug)]
    : [slug];
  
  return allProducts.filter((product) => {
    const categorySlugs = PRODUCT_CATEGORY_MAP[product.id] || [];
    return categorySlugs.some((productSlug) => slugsToMatch.includes(productSlug));
  });
}

