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
  /** Productos con fotos horizontales (gafas, etc.) */
  aspectMode?: AspectMode;
  /** Contener imagen (p. ej. pantalón ski) en lugar de cover */
  imageFit?: "cover" | "contain";
};

/**
 * Galería PDP premium: miniaturas (vertical desktop / inferior móvil), fade entre fotos,
 * contador, zoom suave al hover, lightbox al clic.
 */
export default function ProductGallery({
  images,
  title,
  noImageLabel = "Sin imagen",
  surface = "dark",
  aspectMode = "square",
  imageFit = "cover",
}: Props) {
  const light = surface === "light";
  const list = useMemo(
    () => images.filter(Boolean),
    [images]
  );

  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

  useEffect(() => {
    setIndex(0);
    setDragOffset(0);
    setIsDragging(false);
  }, [list]);

  const safeIndex = Math.min(index, Math.max(0, list.length - 1));
  const canSwipe = list.length > 1;

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

  const stageAspect =
    aspectMode === "cinematic"
      ? "aspect-[16/10] max-h-[min(420px,52vh)]"
      : "aspect-square max-h-[min(480px,62vh)]";

  const stageShell = light
    ? "rounded-2xl border border-neutral-200/90 bg-gradient-to-b from-neutral-100 to-neutral-100/80 shadow-[0_18px_48px_-24px_rgba(0,0,0,0.18)] ring-1 ring-black/[0.04]"
    : "rounded-2xl border border-white/[0.08] bg-dark-surface/40 shadow-[0_24px_56px_-28px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.05]";

  if (list.length === 0) {
    return (
      <div
        className={`flex min-h-[280px] items-center justify-center ${stageAspect} ${stageShell}`}
      >
        <span className={light ? "text-neutral-500" : "text-text-muted"}>
          {noImageLabel}
        </span>
      </div>
    );
  }

  const imgClass =
    imageFit === "contain"
      ? "object-contain object-center transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
      : "object-cover object-center transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.04] motion-reduce:group-hover:scale-100";

  return (
    <div className="flex w-full max-w-full flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-5">
      {/* Miniaturas: abajo en móvil, izquierda en desktop */}
      {list.length > 1 ? (
        <div
          className={
            "order-2 flex shrink-0 gap-2 overflow-x-auto pb-1 scrollbar-rail-premium lg:order-none lg:max-h-[min(480px,62vh)] lg:w-[4.25rem] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0"
          }
        >
          {list.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${title} — ${i + 1} / ${list.length}`}
              aria-current={i === safeIndex ? "true" : undefined}
              className={[
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border transition-all duration-200 ease-out md:h-[4.5rem] md:w-[4.5rem]",
                i === safeIndex
                  ? "border-accent-gold ring-1 ring-accent-gold/50"
                  : light
                    ? "border-neutral-200 hover:border-neutral-400"
                    : "border-white/12 hover:border-white/30",
              ].join(" ")}
            >
              <Image
                src={src}
                alt=""
                width={72}
                height={72}
                loading="lazy"
                placeholder="blur"
                blurDataURL={PRODUCT_BLUR_DATA_URL}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      <div className="relative order-1 min-w-0 flex-1 lg:order-none lg:max-w-[min(100%,480px)]">
        <div
          className={`group relative w-full overflow-hidden will-change-transform ${stageAspect} ${stageShell}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <div
            className={
              light
                ? "pointer-events-none absolute right-3 top-3 z-20 rounded-full border border-neutral-200/80 bg-white/90 px-2.5 py-1 text-[11px] font-medium tabular-nums text-neutral-800 backdrop-blur-sm"
                : "pointer-events-none absolute right-3 top-3 z-20 rounded-full border border-white/10 bg-black/45 px-2.5 py-1 text-[11px] font-medium tabular-nums text-white/90 backdrop-blur-sm"
            }
          >
            {String(safeIndex + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
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
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.6}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </button>
          </div>

          <div
            className="absolute inset-0 z-10 cursor-zoom-in p-3 sm:p-4"
            onClick={() => setLightboxOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setLightboxOpen(true);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`${title} — ampliar galería`}
          >
            <div className="relative h-full min-h-[200px] w-full overflow-hidden rounded-xl">
              {list.map((src, i) => (
                <div
                  key={`${src}-layer-${i}`}
                  className={[
                    "absolute inset-0 transition-opacity duration-300 ease-out motion-reduce:transition-none",
                    i === safeIndex
                      ? "z-[1] opacity-100"
                      : "pointer-events-none z-0 opacity-0",
                  ].join(" ")}
                >
                  {/* `fill` exige un ancestro `relative` con tamaño — sin esto la imagen no pinta */}
                  <div className="relative h-full w-full min-h-0">
                    <Image
                      src={src}
                      alt={`${title} — ${i + 1}`}
                      fill
                      priority={i === 0}
                      loading={i === safeIndex ? "eager" : "lazy"}
                      placeholder="blur"
                      blurDataURL={PRODUCT_BLUR_DATA_URL}
                      className={imgClass}
                      sizes="(max-width: 1024px) 92vw, 420px"
                    />
                  </div>
                </div>
              ))}
            </div>
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
