import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    // Validar que STRIPE_SECRET_KEY existe
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY no está definida en variables de entorno");
      return NextResponse.json(
        { 
          error: "Configuración de Stripe incompleta. Verifica que STRIPE_SECRET_KEY esté en .env.local" 
        },
        { status: 500 }
      );
    }

    // Inicializar Stripe solo si la key existe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-12-15.clover",
    });

    const { items } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items del carrito requeridos" },
        { status: 400 }
      );
    }

    // Validar que cada item tenga los campos necesarios
    for (const item of items) {
      if (!item.id || !item.title || !item.price || !item.quantity) {
        return NextResponse.json(
          { error: "Cada item debe tener id, title, price y quantity" },
          { status: 400 }
        );
      }
    }

    // Obtener la URL base desde la request o variable de entorno
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      request.headers.get("origin") ||
      "http://localhost:3000";

    // Crear line items para Stripe
    const lineItems = items.map((item: {
      id: string;
      title: string;
      price: number;
      quantity: number;
    }) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          metadata: {
            product_id: item.id,
          },
        },
        unit_amount: Math.round(item.price * 100), // Stripe usa centavos
      },
      quantity: item.quantity,
    }));

    // Crear sesión de Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
      metadata: {
        // Guardar IDs de productos para referencia
        product_ids: items.map((item: { id: string }) => item.id).join(","),
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "No se pudo generar URL de checkout" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creando sesión de Stripe:", error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

