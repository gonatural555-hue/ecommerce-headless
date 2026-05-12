"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef } from "react";

export type CompassCardinalLabels = {
  north: string;
  south: string;
  east: string;
  west: string;
};

type Props = {
  ariaLabel?: string;
  cardinalLabels: CompassCardinalLabels;
  /** `brand`: paleta Go Natural sobre hero crema. `expedition`: bronce oscuro (legacy). */
  variant?: "expedition" | "brand";
};

function shortestAngleDiff(from: number, to: number): number {
  let diff = to - from;
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return diff;
}

const NEEDLE_LERP = 0.048;

export default function HeroCompassCursor({
  ariaLabel = "Brújula",
  cardinalLabels,
  variant = "expedition",
}: Props) {
  const isBrand = variant === "brand";
  const reduceMotion = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const tickGradId = `compass-tick-${uid}`;
  const needleBrassId = `needle-brass-${uid}`;
  const needleSteelId = `needle-steel-${uid}`;
  const needleNorthBrandId = `needle-north-brand-${uid}`;
  const rootRef = useRef<HTMLButtonElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);
  const targetAngleRef = useRef(0);
  const currentAngleRef = useRef(0);

  const { north, south, east, west } = cardinalLabels;

  useEffect(() => {
    const updateTarget = (clientX: number, clientY: number) => {
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const rad = Math.atan2(clientY - cy, clientX - cx);
      targetAngleRef.current = (rad * 180) / Math.PI;
    };

    const onMouse = (e: MouseEvent) => updateTarget(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) updateTarget(t.clientX, t.clientY);
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  useEffect(() => {
    let rafId = 0;
    let alive = true;

    const loop = () => {
      if (!alive) return;

      const target = targetAngleRef.current;
      let cur = currentAngleRef.current;

      if (reduceMotion) {
        cur = target;
      } else {
        const diff = shortestAngleDiff(cur, target);
        cur += diff * NEEDLE_LERP;
      }

      currentAngleRef.current = cur;

      const needle = needleRef.current;
      if (needle) {
        needle.style.transform = `translate(-50%, -50%) rotate(${cur}deg)`;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
    };
  }, [reduceMotion]);

  const labelClass = isBrand
    ? "pointer-events-none absolute font-sans text-[9px] font-bold uppercase tracking-[0.28em] text-[#2E4A36]/70 md:text-[10px] md:tracking-[0.3em]"
    : "pointer-events-none absolute font-sans text-[10px] font-semibold uppercase tracking-[0.32em] text-earth-brown/72 md:text-[11px] md:tracking-[0.34em]";

  const dialSize = isBrand
    ? "h-[clamp(7.25rem,13vw,10.25rem)] w-[clamp(7.25rem,13vw,10.25rem)]"
    : "h-[clamp(10rem,19vw,14.75rem)] w-[clamp(10rem,19vw,14.75rem)]";

  const focusRing = isBrand
    ? "focus-visible:ring-2 focus-visible:ring-[#C9622B]/50 focus-visible:ring-offset-[5px] focus-visible:ring-offset-[#F4EBDD]"
    : "focus-visible:ring-2 focus-visible:ring-accent-gold/40 focus-visible:ring-offset-4 focus-visible:ring-offset-white";

  const dropShadow = isBrand
    ? "drop-shadow-[0_14px_36px_-12px_rgba(46,74,54,0.22)]"
    : "drop-shadow-[0_22px_48px_-18px_rgba(17,23,19,0.38)]";

  return (
    <button
      ref={rootRef}
      type="button"
      aria-label={ariaLabel}
      className={`relative isolate shrink-0 px-[2.1rem] pb-[2.5rem] pt-[2.1rem] transition-[filter,transform] duration-500 ease-out focus:outline-none md:px-[2.35rem] md:pb-[2.65rem] md:pt-[2.35rem] ${focusRing}`}
    >
      <span className={`${labelClass} left-1/2 top-0 -translate-x-1/2`} aria-hidden>
        {north}
      </span>
      <span className={`${labelClass} bottom-0 left-1/2 -translate-x-1/2`} aria-hidden>
        {south}
      </span>
      <span className={`${labelClass} left-0 top-1/2 -translate-y-1/2`} aria-hidden>
        {west}
      </span>
      <span className={`${labelClass} right-0 top-1/2 -translate-y-1/2`} aria-hidden>
        {east}
      </span>

      <div className={`relative mx-auto flex ${dialSize} items-center justify-center ${dropShadow}`}>
        {/* Carcasa exterior */}
        <div
          className={
            isBrand
              ? "absolute inset-0 rounded-full bg-gradient-to-br from-[#2E4A36] via-[#6E1F28] to-[#2A2E4B] shadow-[inset_0_2px_4px_rgba(255,255,255,0.12),inset_0_-6px_14px_rgba(0,0,0,0.35),0_10px_28px_-8px_rgba(46,74,54,0.35)] ring-1 ring-[#2E4A36]/30"
              : "absolute inset-0 rounded-full bg-gradient-to-br from-[#3d3429] via-[#2a241c] to-[#1a1612] shadow-[inset_0_2px_3px_rgba(255,255,255,0.08),inset_0_-4px_12px_rgba(0,0,0,0.55),0_12px_32px_-8px_rgba(0,0,0,0.45)] ring-1 ring-black/40"
          }
          aria-hidden
        />
        <div
          className={
            isBrand
              ? "absolute inset-[5px] rounded-full bg-gradient-to-br from-[#C9622B]/35 via-[#D9A441]/25 to-[#2E4A36]/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
              : "absolute inset-[5px] rounded-full bg-gradient-to-br from-[#5c4f3f] via-[#3a3228] to-[#252018] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
          }
          aria-hidden
        />

        {/* Cara interior */}
        <div
          className={
            isBrand
              ? "absolute inset-[11px] overflow-hidden rounded-full bg-gradient-to-b from-[#F4EBDD] via-[#ede4d4] to-[#e2d6c4] shadow-[inset_0_3px_10px_rgba(255,255,255,0.75),inset_0_-8px_16px_rgba(46,74,54,0.08)] ring-1 ring-[#2E4A36]/12"
              : "absolute inset-[11px] overflow-hidden rounded-full bg-gradient-to-b from-[#f7f4ed] via-[#e8e2d6] to-[#d8d0c2] shadow-[inset_0_3px_8px_rgba(255,255,255,0.65),inset_0_-6px_14px_rgba(0,0,0,0.12)] ring-1 ring-white/50"
          }
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-full opacity-[0.18]"
            style={{
              background: isBrand
                ? "radial-gradient(ellipse 75% 50% at 50% 22%, rgba(255,255,255,0.9), transparent 52%), radial-gradient(circle at 72% 78%, rgba(201,98,43,0.12), transparent 42%), radial-gradient(circle at 22% 70%, rgba(110,31,40,0.06), transparent 40%)"
                : "radial-gradient(ellipse 80% 55% at 50% 28%, rgba(255,255,255,0.95), transparent 55%), radial-gradient(circle at 70% 75%, rgba(217,138,36,0.08), transparent 45%)",
            }}
            aria-hidden
          />
        </div>

        <svg
          className={
            isBrand
              ? "pointer-events-none absolute inset-[14%] z-[1] text-[#2E4A36]/45"
              : "pointer-events-none absolute inset-[14%] z-[1] text-[#4a4338]/55"
          }
          viewBox="0 0 100 100"
          aria-hidden
        >
          <defs>
            <linearGradient id={tickGradId} x1="0%" y1="0%" x2="100%" y2="0%">
              {isBrand ? (
                <>
                  <stop offset="0%" stopColor="#2E4A36" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="#6E1F28" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#2E4A36" stopOpacity="0.25" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#6b5e4f" stopOpacity="0.35" />
                  <stop offset="50%" stopColor="#3d362c" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#6b5e4f" stopOpacity="0.35" />
                </>
              )}
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="47.2" fill="none" stroke={`url(#${tickGradId})`} strokeWidth="0.35" opacity="0.9" />
          <circle cx="50" cy="50" r="43.5" fill="none" stroke="currentColor" strokeWidth="0.22" opacity="0.45" />
          {Array.from({ length: 36 }).map((_, i) => {
            const deg = i * 10;
            const major = i % 3 === 0;
            return (
              <line
                key={deg}
                x1="50"
                y1="50"
                x2="50"
                y2={major ? "9.5" : "11.2"}
                stroke="currentColor"
                strokeWidth={major ? 0.55 : 0.28}
                strokeLinecap="round"
                opacity={major ? 0.85 : 0.4}
                transform={`rotate(${deg} 50 50)`}
              />
            );
          })}
          {[0, 90, 180, 270].map((deg) => (
            <line
              key={`m${deg}`}
              x1="50"
              y1="50"
              x2="50"
              y2="7"
              stroke={isBrand ? "#2E4A36" : "#2c2620"}
              strokeWidth="0.65"
              strokeLinecap="square"
              opacity={isBrand ? 0.42 : 0.5}
              transform={`rotate(${deg} 50 50)`}
            />
          ))}
        </svg>

        <div
          ref={needleRef}
          className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[76%] w-[76%] will-change-transform motion-reduce:!transition-none"
          style={{ transform: "translate(-50%, -50%) rotate(0deg)" }}
        >
          <svg className="h-full w-full drop-shadow-[0_3px_8px_rgba(46,74,54,0.2)]" viewBox="-50 -50 100 100" aria-hidden>
            <defs>
              <linearGradient id={needleBrassId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e8c066" />
                <stop offset="45%" stopColor="#c8942e" />
                <stop offset="100%" stopColor="#8a5a18" />
              </linearGradient>
              <linearGradient id={needleSteelId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9a9a98" />
                <stop offset="50%" stopColor="#f0eeea" />
                <stop offset="100%" stopColor="#7a7874" />
              </linearGradient>
              <linearGradient id={needleNorthBrandId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6E1F28" />
                <stop offset="55%" stopColor="#C9622B" />
                <stop offset="100%" stopColor="#D9A441" />
              </linearGradient>
            </defs>
            <path
              d="M-5 18 L5 18 L3 28 L-3 28 Z"
              fill={isBrand ? "#2E4A36" : `url(#${needleBrassId})`}
              stroke={isBrand ? "#1a2e22" : "#2a2218"}
              strokeWidth="0.35"
              strokeOpacity="0.45"
            />
            <line
              x1="0"
              y1="10"
              x2="0"
              y2="30"
              stroke={isBrand ? "#2E4A36" : "#3a3228"}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <polygon
              points="0,-40 -8.5,12 8.5,12"
              fill={isBrand ? `url(#${needleNorthBrandId})` : `url(#${needleBrassId})`}
              stroke={isBrand ? "#4a1520" : "#1f1810"}
              strokeWidth="0.45"
              strokeOpacity="0.4"
            />
            <polygon points="0,-36 -4.5,10 4.5,10" fill={`url(#${needleSteelId})`} opacity={isBrand ? 0.35 : 0.55} />
            <circle cx="0" cy="0" r="5.5" fill={`url(#${needleSteelId})`} stroke={isBrand ? "#2E4A36" : "#4a4338"} strokeWidth="0.5" />
            <circle cx="0" cy="0" r="2.8" fill={isBrand ? "#2A2E4B" : "#2a241c"} stroke="#8a7a68" strokeWidth="0.35" />
            <circle cx="-1" cy="-1" r="1" fill="white" opacity="0.35" />
          </svg>
        </div>

        <div
          className={
            isBrand
              ? "pointer-events-none absolute inset-[13px] rounded-full ring-1 ring-[#2E4A36]/10 ring-inset"
              : "pointer-events-none absolute inset-[13px] rounded-full ring-1 ring-white/25 ring-inset"
          }
          aria-hidden
        />
      </div>
    </button>
  );
}
