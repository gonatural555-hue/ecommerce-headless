/**
 * Tipos base para productos del ecommerce
 * 
 * Decisión: Separar tipos en archivo dedicado para:
 * - Reutilización en múltiples componentes
 * - Mantenimiento centralizado
 * - Type safety en toda la aplicación
 */

export interface Product {
  id: string;
  name: string;
  slug: string; // URL-friendly identifier para SEO
  description: string;
  price: number;
  compareAtPrice?: number; // Precio anterior para mostrar descuentos
  currency: string;
  images: ProductImage[];
  availability: ProductAvailability;
  category?: string;
  tags?: string[];
  rating?: ProductRating;
  variants?: ProductVariant[];
}

export interface ProductImage {
  url: string;
  alt: string; // Crítico para SEO y accesibilidad
  width?: number;
  height?: number;
}

export interface ProductRating {
  value: number; // 0-5
  count: number; // Número de reseñas
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

export type ProductAvailability = "in_stock" | "out_of_stock" | "preorder" | "backorder";

/**
 * Props para ProductGrid
 * 
 * Decisión: Interface extensible que permite:
 * - Paginación futura
 * - Filtros y ordenamiento
 * - Estados de carga
 * - Configuración flexible
 */
export interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4; // Responsive grid columns
  showQuickView?: boolean;
  showWishlist?: boolean;
  className?: string;
}






