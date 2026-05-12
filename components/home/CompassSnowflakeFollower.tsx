"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

type Props = {
  /** Cuando el puntero está sobre una tarjeta de categoría, el copo pasa a blanco. */
  overCategoryCard: boolean;
};

const LERP = 0.078;
const LAG_OFFSET = 20;

/**
 * Copo de nieve decorativo que sigue al cursor con inercia (no sustituye el cursor).
 * Solo en desktop (puntero fino) y sin prefers-reduced-motion.
 */
export default function CompassSnowflakeFollower({ overCategoryCard }: Props) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });
  const visibleRef = useRef(false);
  const syncedRef = useRef(false);

  useEffect(() => {
    if (reduceMotion) return;
    const fine = window.matchMedia("(pointer: fine)");
    const desktop = window.matchMedia("(min-width: 768px)");
    if (!fine.matches || !desktop.matches) return;

    let alive = true;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      if (!syncedRef.current) {
        posRef.current.x = e.clientX;
        posRef.current.y = e.clientY;
        syncedRef.current = true;
      }
      visibleRef.current = true;
    };

    const onLeaveWin = () => {
      visibleRef.current = false;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("blur", onLeaveWin);
    document.documentElement.addEventListener("mouseleave", onLeaveWin);

    const tick = () => {
      if (!alive) return;
      const t = targetRef.current;
      const p = posRef.current;
      p.x += (t.x - p.x) * LERP;
      p.y += (t.y - p.y) * LERP;

      const el = rootRef.current;
      if (el) {
        el.style.transform = `translate3d(${p.x - LAG_OFFSET}px, ${p.y - LAG_OFFSET}px, 0)`;
        el.style.opacity = visibleRef.current ? "0.9" : "0";
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("blur", onLeaveWin);
      document.documentElement.removeEventListener("mouseleave", onLeaveWin);
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed left-0 top-0 z-[5] hidden opacity-0 will-change-transform md:block"
      style={{ transform: "translate3d(-9999px, -9999px, 0)" }}
      aria-hidden
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        className={`transition-[color,filter] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          overCategoryCard
            ? "text-white [filter:drop-shadow(0_0_5px_rgba(255,255,255,0.28))]"
            : "text-[#141a17]"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      >
        <path d="M12 2.5v19M2.5 12h19M6 6l12 12M18 6 6 18" />
        <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
}
