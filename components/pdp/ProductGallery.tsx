"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ProductImageLightbox from "@/components/pdp/ProductImageLightbox";
import { PRODUCT_BLUR_DATA_URL } from "@/lib/product-image-helper";
import type { UISurface } from "@/lib/ui-surface";

type AspectMode = "square" | "cinematic";

type Props = {
  images: string[];
  title: string;
  noImageLabel?: string;
  surface?: UISurface;
  /** Productos con franja más ancha (gafas, etc.) */
  aspectMode?: AspectMode;
  /** Fotos 1:1 → `contain` evita recorte; `cover` solo si hiciera falta llenar el marco */
  imageFit?: "cover" | "contain";
};

/**
 * Galería PDP: miniaturas + imagen principal con marco estable (aspect-ratio + max-width).
 * - `fill` solo dentro de un único contenedor `relative` con altura definida por aspect-ratio.
 * - Por defecto `object-contain` para assets 1:1 (sin recorte ni estiramientos).
 */
export default function ProductGallery({
  images,
  title,
  noImageLabel = "Sin imagen",
  surface = "dark",
  aspectMode = "square",
  imageFit = "contain",
}: Props) {
  const light = surface === "light";
  const list = useMemo(() => images.filter(Boolean), [images]);

  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [mainError, setMainError] = useState(false);
  const startXRef = useRef(0);

  useEffect(() => {
    setIndex(0);
    setDragOffset(0);
    setIsDragging(false);
    setMainError(false);
  }, [list]);

  const safeIndex = Math.min(index, Math.max(0, list.length - 1));
  const canSwipe = list.length > 1;
  const currentSrc = list[safeIndex] ?? list[0] ?? "";

  useEffect(() => {
    setMainError(false);
  }, [safeIndex, currentSrc]);

  const go = useCallback(
    (next: number) => {
      if (list.length === 0) return;
      setIndex((i) => Math.min(Math.max(0, next), list.length - 1));
    },
    [list.length]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!canSwipe) return;
    setIsDragging(true);
    startXRef.current = e.touches[0]?.clientX ?? 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !canSwipe) return;
    const x = e.touches[0]?.clientX ?? 0;
    setDragOffset(x - startXRef.current);
  };

  const handleTouchEnd = () => {
    if (!isDragging || !canSwipe) return;
    const threshold = 50;
    const d = dragOffset;
    setIsDragging(false);
    setDragOffset(0);
    if (d <= -threshold) go(safeIndex + 1);
    else if (d >= threshold) go(safeIndex - 1);
  };

  const stageShell = light
    ? "rounded-xl border border-neutral-200/90 bg-neutral-100/95 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.15)] ring-1 ring-black/[0.04]"
    : "rounded-xl border border-white/[0.1] bg-dark-surface/50 shadow-[0_20px_48px_-28px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.06]";

  /** Marco principal: altura definida por aspect-ratio; max-width fija equilibrio con la columna de info */
  const stageFrameClass =
    aspectMode === "cinematic"
      ? `relative w-full max-w-[min(100%,560px)] overflow-hidden ${stageShell} aspect-[16/10] max-h-[min(420px,72vh)]`
      : `relative w-full max-w-[min(100%,560px)] overflow-hidden ${stageShell} aspect-square`;

  const imgObject =
    imageFit === "contain"
      ? "object-contain object-center"
      : "object-cover object-center";

  const imgMotion =
    imageFit === "contain"
      ? "transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
      : "transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:group-hover:scale-100";

  if (list.length === 0) {
    return (
      <div
        className={`flex min-h-[280px] w-full max-w-[560px] items-center justify-center rounded-xl border border-dashed ${
          light
            ? "border-neutral-300 bg-neutral-100 text-neutral-500"
            : "border-white/15 bg-dark-surface/40 text-text-muted"
        }`}
      >
        <span>{noImageLabel}</span>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-full flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
      {/* Miniaturas: debajo en móvil, columna fija a la izquierda en desktop */}
      {list.length > 1 ? (
        <div
          className={
            "order-2 flex shrink-0 gap-2 overflow-x-auto overflow-y-hidden pb-1 scrollbar-rail-premium lg:order-1 lg:w-16 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0 " +
            "lg:max-h-[min(560px,80vh)]"
          }
          aria-label="Miniaturas"
        >
          {list.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${title} — ${i + 1} / ${list.length}`}
              aria-current={i === safeIndex ? "true" : undefined}
              className={[
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border transition-all duration-200 ease-out",
                i === safeIndex
                  ? "border-accent-gold ring-2 ring-accent-gold/40 scale-[1.03] z-[1]"
                  : light
                    ? "border-neutral-200 hover:border-neutral-400 hover:scale-[1.02]"
                    : "border-white/15 hover:border-white/35 hover:scale-[1.02]",
              ].join(" ")}
            >
              <Image
                src={src}
                alt=""
                width={64}
                height={64}
                loading={i < 4 ? "eager" : "lazy"}
                placeholder="blur"
                blurDataURL={PRODUCT_BLUR_DATA_URL}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      {/* Columna principal: evita colapso a 0px en flex (min-width + max-width del bloque) */}
      <div className="order-1 flex min-h-0 min-w-[240px] w-full flex-1 flex-col items-stretch lg:order-2 lg:max-w-[560px]">
        <div
          className={`group mx-auto w-full lg:mx-0 ${stageFrameClass}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          {/* Fondo detrás de object-contain (letterboxing limpio) */}
          <div
            className={
              light
                ? "pointer-events-none absolute inset-0 bg-neutral-100"
                : "pointer-events-none absolute inset-0 bg-dark-surface/40"
            }
            aria-hidden
          />

          {mainError || !currentSrc ? (
            <div
              className={
                "absolute inset-0 z-[2] flex items-center justify-center px-4 text-center text-sm " +
                (light ? "text-neutral-500" : "text-text-muted")
              }
            >
              {noImageLabel}
            </div>
          ) : (
            <div
              key={`${currentSrc}-${safeIndex}`}
              className="animate-fade-in absolute inset-0 z-[2]"
            >
              <Image
                src={currentSrc}
                alt={`${title} — ${safeIndex + 1}`}
                fill
                priority={safeIndex === 0}
                loading={safeIndex === 0 ? "eager" : "lazy"}
                placeholder="blur"
                blurDataURL={PRODUCT_BLUR_DATA_URL}
                sizes="(max-width: 1024px) 100vw, 560px"
                onError={() => setMainError(true)}
                className={`${imgObject} ${imgMotion}`}
              />
            </div>
          )}

          <button
            type="button"
            className="absolute inset-0 z-[5] m-0 cursor-zoom-in border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-gold/70"
            onClick={() => setLightboxOpen(true)}
            aria-label={`${title} — ampliar galería`}
          />

          <div
            className={
              light
                ? "pointer-events-none absolute right-3 top-3 z-20 rounded-full border border-neutral-200/80 bg-white/90 px-2.5 py-1 text-[11px] font-medium tabular-nums text-neutral-800 backdrop-blur-sm"
                : "pointer-events-none absolute right-3 top-3 z-20 rounded-full border border-white/10 bg-black/45 px-2.5 py-1 text-[11px] font-medium tabular-nums text-white/90 backdrop-blur-sm"
            }
          >
            {String(safeIndex + 1).padStart(2, "0")} /{" "}
            {String(list.length).padStart(2, "0")}
          </div>

          <div className="absolute left-3 top-3 z-20">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(true);
              }}
              className={
                light
                  ? "rounded-full border border-neutral-200/90 bg-white/90 p-2 text-neutral-700 shadow-sm backdrop-blur-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/70"
                  : "rounded-full border border-white/15 bg-black/45 p-2 text-white/95 shadow-sm backdrop-blur-sm transition hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/70"
              }
              aria-label={`${title} — pantalla completa`}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.6}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <ProductImageLightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={list}
        initialIndex={safeIndex}
        title={title}
      />
    </div>
  );
}
