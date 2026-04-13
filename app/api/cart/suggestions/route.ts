import { NextRequest, NextResponse } from "next/server";
import { getCartSuggestedProducts } from "@/lib/categories";

/**
 * GET /api/cart/suggestions?ids=id1,id2
 * Resuelve sugerencias en el servidor para no incluir getProducts + catálogo en el bundle del cliente.
 */
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("ids") || "";
  const cartProductIds = raw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const products = getCartSuggestedProducts(cartProductIds, {
    targetMin: 8,
    max: 12,
  });

  return NextResponse.json({ products });
}
