"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useUser } from "@/context/UserContext";

function AuthPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const { isLoggedIn } = useUser();
  const [mounted, setMounted] = useState(false);
  
  const tab = (searchParams.get("tab") as "login" | "register" | null) || "login";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (mounted && isLoggedIn) {
      router.push(`/${locale}/account`);
    }
  }, [mounted, isLoggedIn, router, locale]);

  if (!mounted) {
    return (
      <main className="min-h-[100dvh] bg-dark-base flex items-center justify-center px-4">
        <div className="text-text-muted">Cargando...</div>
      </main>
    );
  }

  if (isLoggedIn) {
    return null;
  }

  return (
    <main className="min-h-[100dvh] bg-dark-base px-4 py-12 md:py-20 overflow-x-hidden">
      <div className="max-w-md mx-auto">
        {/* Back button */}
        <Link
          href={`/${locale}/products`}
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors duration-200 mb-8"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver
        </Link>

        {/* Auth Form Container */}
        <div className="bg-dark-surface/40 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <AuthForm initialTab={tab} isPage={true} />
        </div>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[100dvh] bg-dark-base flex items-center justify-center px-4">
          <div className="text-text-muted">Cargando...</div>
        </main>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}

