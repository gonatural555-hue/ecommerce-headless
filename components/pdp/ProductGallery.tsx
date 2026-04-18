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

  /** Contenedor principal: móvil más compacto; desktop más presencia (rounded-2xl, profundidad suave). */
  const stageShell = light
    ? "rounded-xl border border-neutral-200/85 bg-neutral-100/95 shadow-[0_10px_32px_-18px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.04] lg:rounded-2xl lg:border-neutral-200/70 lg:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.1)]"
    : "rounded-xl border border-white/[0.1] bg-dark-surface/72 shadow-[0_14px_40px_-22px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.07] lg:rounded-2xl lg:border-white/[0.12] lg:bg-[linear-gradient(168deg,rgba(255,255,255,0.07)_0%,rgba(18,24,22,0.96)_42%,#0b0f0e_100%)] lg:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_22px_56px_-30px_rgba(0,0,0,0.58)] lg:ring-white/[0.09]";

  /** Desktop: marco más ancho (hero); móvil sin cambios de tamaño máximo base */
  const stageFrameClass =
    aspectMode === "cinematic"
      ? `relative w-full max-w-[min(100%,560px)] overflow-hidden ${stageShell} aspect-[16/10] max-h-[min(420px,72vh)] lg:max-w-[min(100%,680px)] xl:max-w-[min(100%,720px)] 2xl:max-w-[min(100%,760px)] lg:max-h-[min(460px,78vh)]`
      : `relative w-full max-w-[min(100%,560px)] overflow-hidden ${stageShell} aspect-square lg:max-w-[min(100%,640px)] xl:max-w-[min(100%,700px)] 2xl:max-w-[min(100%,720px)]`;

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
        className={`flex min-h-[280px] w-full max-w-[560px] items-center justify-center rounded-xl border border-dashed lg:max-w-[min(100%,640px)] xl:max-w-[min(100%,700px)] 2xl:max-w-[min(100%,720px)] ${
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
    <div className="flex w-full max-w-full flex-col gap-4 lg:flex-row lg:items-start lg:gap-7 xl:gap-8">
      {/* Miniaturas: debajo en móvil; desktop: columna más ancha + hit area claro */}
      {list.length > 1 ? (
        <div
          className={
            "order-2 flex shrink-0 gap-2 overflow-x-auto overflow-y-hidden pb-1 scrollbar-rail-premium lg:order-1 lg:w-[4.75rem] lg:flex-col lg:gap-3 lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0 " +
            "lg:max-h-[min(720px,88vh)] xl:w-20"
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
                "lg:h-[4.75rem] lg:w-[4.75rem] lg:rounded-xl xl:h-20 xl:w-20",
                i === safeIndex
                  ? "border-accent-gold ring-2 ring-accent-gold/45 scale-[1.03] z-[1] lg:ring-[3px] lg:ring-accent-gold/50 lg:shadow-[0_0_28px_-6px_rgba(212,175,55,0.45)]"
                  : light
                    ? "border-neutral-200 hover:border-neutral-400 hover:scale-[1.02] lg:hover:border-neutral-500"
                    : "border-white/15 hover:border-white/40 hover:scale-[1.02] lg:border-white/18 lg:hover:border-white/45 lg:hover:shadow-[0_0_20px_-8px_rgba(255,255,255,0.12)]",
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

      {/* Columna principal: desktop ancho alineado al grid PDP (hero) */}
      <div className="order-1 flex min-h-0 min-w-[240px] w-full flex-1 flex-col items-stretch lg:order-2 lg:min-w-[300px] lg:max-w-[min(100%,720px)] 2xl:max-w-[min(100%,760px)]">
        <div
          className={`group mx-auto w-full lg:mx-0 ${stageFrameClass}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          {/* Fondo + viñeta suave (desktop: más profundidad sin sombras baratas) */}
          <div
            className={
              light
                ? "pointer-events-none absolute inset-0 bg-neutral-100"
                : "pointer-events-none absolute inset-0 bg-dark-surface/35"
            }
            aria-hidden
          />
          {!light ? (
            <div
              className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_85%_70%_at_50%_42%,rgba(255,255,255,0.07)_0%,transparent_58%)] opacity-90 lg:opacity-100"
              aria-hidden
            />
          ) : (
            <div
              className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_65%_at_50%_45%,rgba(255,255,255,0.35)_0%,transparent_55%)] opacity-70"
              aria-hidden
            />
          )}

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
              className="animate-fade-in absolute inset-0 z-[2] p-1 lg:p-1.5 xl:p-2"
            >
              <Image
                src={currentSrc}
                alt={`${title} — ${safeIndex + 1}`}
                fill
                priority={safeIndex === 0}
                loading={safeIndex === 0 ? "eager" : "lazy"}
                placeholder="blur"
                blurDataURL={PRODUCT_BLUR_DATA_URL}
                sizes="(max-width: 1024px) 100vw, (max-width: 1536px) min(700px, 58vw), 720px"
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
                ? "pointer-events-none absolute right-3 top-3 z-20 rounded-full border border-neutral-200/80 bg-white/92 px-2.5 py-1 text-[11px] font-medium tabular-nums tracking-wide text-neutral-800 backdrop-blur-sm lg:right-4 lg:top-4"
                : "pointer-events-none absolute right-3 top-3 z-20 rounded-full border border-white/12 bg-black/50 px-2.5 py-1 text-[11px] font-medium tabular-nums tracking-wide text-white/92 backdrop-blur-md lg:right-4 lg:top-4"
            }
          >
            {String(safeIndex + 1).padStart(2, "0")} /{" "}
            {String(list.length).padStart(2, "0")}
          </div>

          <div className="absolute left-3 top-3 z-20 lg:left-auto lg:right-4 lg:top-auto lg:bottom-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(true);
              }}
              className={
                light
                  ? "rounded-full border border-neutral-200/90 bg-white/92 p-2 text-neutral-700 shadow-sm backdrop-blur-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/70 lg:p-2.5"
                  : "rounded-full border border-white/16 bg-black/55 p-2 text-white/95 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)] backdrop-blur-md transition hover:border-white/25 hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/70 lg:p-2.5"
              }
              aria-label={`${title} — pantalla completa`}
            >
              <svg
                className="h-4 w-4 lg:h-[1.05rem] lg:w-[1.05rem]"
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
