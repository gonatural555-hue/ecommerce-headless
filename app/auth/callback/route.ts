import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * OAuth / magic link / confirmación de email (Supabase).
 * Añadir en Supabase Dashboard → Authentication → URL: `https://tudominio.com/auth/callback`
 * y en desarrollo: `http://localhost:3000/auth/callback`
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/es/account";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("[auth/callback]", error);
      return NextResponse.redirect(new URL("/es/auth?error=auth", request.url));
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
