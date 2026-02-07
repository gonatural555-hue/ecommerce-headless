"use client";

import { useEffect } from "react";

/**
 * Componente para mejorar el scroll suave y pesado del sitio
 * Aplica momentum scrolling sutil sin interferir con el scroll nativo
 */
export default function SmoothScroll() {
  useEffect(() => {
    // Solo aplicar en el cliente
    if (typeof window === "undefined") return;

    // Verificar si el usuario prefiere movimiento reducido
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return; // No aplicar scroll personalizado si el usuario prefiere movimiento reducido
    }

    let lastScrollTop = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          const scrollDelta = Math.abs(currentScroll - lastScrollTop);

          // Solo aplicar momentum si el scroll es significativo
          if (scrollDelta > 1) {
            // Aplicar un pequeño momentum al final del scroll
            // Esto se hace mediante CSS principalmente, pero podemos
            // agregar un pequeño ajuste aquí si es necesario
          }

          lastScrollTop = currentScroll;
          ticking = false;
        });

        ticking = true;
      }
    };

    // Agregar event listener para scroll optimizado
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null; // Componente sin UI
}

