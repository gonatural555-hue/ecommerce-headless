import type { Product } from "@/lib/products";

const BASE_IMAGE_ROOT = "/assets/images/products/gn-ski-snow-001";

const BASE_DESCRIPTION = {
  es: "Gafas de esquí KAPVOE con lentes fotocromáticas, protección UV400 y diseño antivaho, ideales para esquí y snowboard en condiciones de luz variables.",
  en: "KAPVOE ski goggles with photochromic lenses, UV400 protection, and anti-fog design, ideal for skiing and snowboarding in changing light.",
  fr: "Masque de ski KAPVOE avec verres photochromiques, protection UV400 et traitement antibuée, idéal en conditions de lumière variables.",
  it: "Maschera da sci KAPVOE con lenti fotocromatiche, protezione UV400 e trattamento antiappannamento, ideale con luce variabile.",
} as const;

const BASE_FEATURES = {
  es: [
    "Lentes fotocromáticas",
    "Protección UV400",
    "Tratamiento antivaho",
    "Diseño outdoor",
  ],
  en: [
    "Photochromic lenses",
    "UV400 protection",
    "Anti-fog treatment",
    "Outdoor-ready design",
  ],
  fr: [
    "Verres photochromiques",
    "Protection UV400",
    "Traitement antibuée",
    "Design outdoor",
  ],
  it: [
    "Lenti fotocromatiche",
    "Protezione UV400",
    "Trattamento antiappannamento",
    "Design outdoor",
  ],
} as const;

const MODELS = [
  {
    id: "gn-ski-snow-001-sk7a1",
    modelFolder: "model-1",
    titles: {
      es: "KAPVOE SK7-A1 — Gafas Fotocromáticas Glacier",
      en: "KAPVOE SK7-A1 — Glacier Photochromic Ski Goggles",
      fr: "KAPVOE SK7-A1 — Masque photochromique Glacier",
      it: "KAPVOE SK7-A1 — Maschera fotocromatica Glacier",
    },
  },
  {
    id: "gn-ski-snow-001-sk7b2",
    modelFolder: "model-2",
    titles: {
      es: "KAPVOE SK7-B2 — Gafas Fotocromáticas Solar Gold",
      en: "KAPVOE SK7-B2 — Solar Gold Photochromic Ski Goggles",
      fr: "KAPVOE SK7-B2 — Masque photochromique Solar Gold",
      it: "KAPVOE SK7-B2 — Maschera fotocromatica Solar Gold",
    },
  },
  {
    id: "gn-ski-snow-001-sk7c3",
    modelFolder: "model-3",
    titles: {
      es: "KAPVOE SK7-C3 — Gafas Fotocromáticas Storm Chrome",
      en: "KAPVOE SK7-C3 — Storm Chrome Photochromic Ski Goggles",
      fr: "KAPVOE SK7-C3 — Masque photochromique Storm Chrome",
      it: "KAPVOE SK7-C3 — Maschera fotocromatica Storm Chrome",
    },
  },
  {
    id: "gn-ski-snow-001-sk7d4",
    modelFolder: "model-4",
    titles: {
      es: "KAPVOE SK7-D4 — Gafas Fotocromáticas Midnight IR",
      en: "KAPVOE SK7-D4 — Midnight IR Photochromic Ski Goggles",
      fr: "KAPVOE SK7-D4 — Masque photochromique Midnight IR",
      it: "KAPVOE SK7-D4 — Maschera fotocromatica Midnight IR",
    },
  },
  {
    id: "gn-ski-snow-001-sk7e5",
    modelFolder: "model-5",
    titles: {
      es: "KAPVOE SK7-E5 — Gafas Fotocromáticas Aurora Rose",
      en: "KAPVOE SK7-E5 — Aurora Rose Photochromic Ski Goggles",
      fr: "KAPVOE SK7-E5 — Masque photochromique Aurora Rose",
      it: "KAPVOE SK7-E5 — Maschera fotocromatica Aurora Rose",
    },
  },
  {
    id: "gn-ski-snow-001-sk7f6",
    modelFolder: "model-6",
    titles: {
      es: "KAPVOE SK7-F6 — Gafas Fotocromáticas Volt Amber",
      en: "KAPVOE SK7-F6 — Volt Amber Photochromic Ski Goggles",
      fr: "KAPVOE SK7-F6 — Masque photochromique Volt Amber",
      it: "KAPVOE SK7-F6 — Maschera fotocromatica Volt Amber",
    },
  },
  {
    id: "gn-ski-snow-001-sk7g7",
    modelFolder: "model-7",
    titles: {
      es: "KAPVOE SK7-G7 — Gafas Fotocromáticas Carbon Edge",
      en: "KAPVOE SK7-G7 — Carbon Edge Photochromic Ski Goggles",
      fr: "KAPVOE SK7-G7 — Masque photochromique Carbon Edge",
      it: "KAPVOE SK7-G7 — Maschera fotocromatica Carbon Edge",
    },
  },
] as const;

/** Siete PDPs independientes (ex variantes de gn-ski-snow-001). */
export const KAPVOE_SKI_GOGGLE_PRODUCTS: Product[] = MODELS.map((model) => ({
  id: model.id,
  slug: model.id,
  title: model.titles.es,
  price: 69.9,
  category: "Ski & Snow Equipment",
  images: [`${BASE_IMAGE_ROOT}/${model.modelFolder}/image.webp`],
  description: BASE_DESCRIPTION.es,
  features: [...BASE_FEATURES.es],
  translations: {
    en: {
      title: model.titles.en,
      description: BASE_DESCRIPTION.en,
      features: [...BASE_FEATURES.en],
    },
    es: {
      title: model.titles.es,
      description: BASE_DESCRIPTION.es,
      features: [...BASE_FEATURES.es],
    },
    fr: {
      title: model.titles.fr,
      description: BASE_DESCRIPTION.fr,
      features: [...BASE_FEATURES.fr],
    },
    it: {
      title: model.titles.it,
      description: BASE_DESCRIPTION.it,
      features: [...BASE_FEATURES.it],
    },
  },
}));

export const KAPVOE_SKI_GOGGLE_FLAGSHIP_ID = "gn-ski-snow-001-sk7a1" as const;

export const DEPRECATED_KAPVOE_SKI_GOGGLE_PARENT_ID = "gn-ski-snow-001" as const;
