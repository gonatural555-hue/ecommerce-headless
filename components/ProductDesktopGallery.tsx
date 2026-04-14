"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { PRODUCT_BLUR_DATA_URL } from "@/lib/product-image-helper";
import type { UISurface } from "@/lib/ui-surface";

type Props = {
  featured: string | null;
  gallery: string[];
  title: string;
  noImageLabel?: string;
  /** Wider frame for tall products (e.g. ski pants). */
  showFullImage?: boolean;
  surface?: UISurface;
};

const FADE_MS = 200;

export default function ProductDesktopGallery({
  featured,
  gallery,
  title,
  noImageLabel = "No image",
  showFullImage,
  surface = "dark",
}: Props) {
  const light = surface === "light";
  const allImages = useMemo(() => {
    return featured
      ? [featured, ...gallery.filter((img) => img !== featured)]
      : [...gallery];
  }, [featured, gallery]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
    setFading(false);
  }, [featured, gallery]);

  const selectIndex = useCallback(
    (index: number) => {
      if (
        index === activeIndex ||
        index < 0 ||
        index >= allImages.length ||
        fading
      ) {
        return;
      }
      setFading(true);
      window.setTimeout(() => {
        setActiveIndex(index);
        setFading(false);
      }, FADE_MS);
    },
    [activeIndex, allImages.length, fading]
  );

  if (allImages.length === 0) {
    return (
      <div
        className={
          light
            ? "aspect-[4/5] max-h-[520px] bg-neutral-100 rounded-2xl overflow-hidden flex items-center justify-center border border-neutral-200"
            : "aspect-[4/5] max-h-[520px] bg-dark-surface rounded-2xl overflow-hidden flex items-center justify-center border border-white/10"
        }
      >
        <span className={light ? "text-neutral-500" : "text-text-muted"}>
          {noImageLabel}
        </span>
      </div>
    );
  }

  const activeSrc = allImages[activeIndex] ?? allImages[0];

  const mainFrameClass = showFullImage
    ? light
      ? "relative w-full h-[min(520px,65vh)] min-h-[300px] max-h-[520px] rounded-2xl border border-neutral-200 bg-neutral-100 overflow-hidden"
      : "relative w-full h-[min(520px,65vh)] min-h-[300px] max-h-[520px] rounded-2xl border border-white/10 bg-dark-surface/50 overflow-hidden"
    : light
    ? "relative w-full aspect-[4/5] max-h-[520px] mx-auto rounded-2xl border border-neutral-200 bg-neutral-100 overflow-hidden"
    : "relative w-full aspect-[4/5] max-h-[520px] mx-auto rounded-2xl border border-white/10 bg-dark-surface/50 overflow-hidden";

  const zoomClass = showFullImage
    ? "object-contain transition-transform duration-300 ease-out group-hover:scale-[1.015]"
    : "object-contain transition-transform duration-300 ease-out group-hover:scale-[1.02]";

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      <div className={mainFrameClass}>
        <div
          className={[
            "group absolute inset-3 lg:inset-5 transition-opacity duration-200 ease-out",
            fading ? "opacity-0" : "opacity-100",
          ].join(" ")}
        >
          <div className="relative h-full w-full min-h-[240px]">
            <Image
              src={activeSrc}
              alt={`${title} — ${activeIndex + 1}`}
              fill
              priority={activeIndex === 0}
              loading={activeIndex === 0 ? "eager" : "lazy"}
              placeholder="blur"
              blurDataURL={PRODUCT_BLUR_DATA_URL}
              sizes="(min-width: 1024px) 35vw, 100vw"
              className={zoomClass}
            />
          </div>
        </div>
      </div>

      {allImages.length > 1 ? (
        <div className="flex gap-2.5 overflow-x-auto pb-1 pt-0.5 [scrollbar-width:thin]">
          {allImages.map((thumb, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`${thumb}-${index}`}
                type="button"
                onClick={() => selectIndex(index)}
                aria-label={`${title} — vista ${index + 1}`}
                aria-current={isActive ? "true" : undefined}
                className={[
                  "shrink-0 rounded-xl p-0.5 transition-all duration-200 ease-out",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/70 focus-visible:ring-offset-2",
                  light
                    ? "focus-visible:ring-offset-white"
                    : "focus-visible:ring-offset-dark-base",
                  isActive
                    ? "ring-1 ring-accent-gold/80 shadow-[0_0_0_1px_rgba(212,175,55,0.2)]"
                    : light
                    ? "ring-1 ring-transparent hover:ring-neutral-300"
                    : "ring-1 ring-transparent hover:ring-white/20",
                ].join(" ")}
              >
                <div
                  className={
                    light
                      ? "relative h-[72px] w-[72px] overflow-hidden rounded-lg border border-neutral-200 bg-white"
                      : "relative h-[72px] w-[72px] overflow-hidden rounded-lg border border-white/10 bg-dark-surface/60"
                  }
                >
                  <Image
                    src={thumb}
                    alt=""
                    width={72}
                    height={72}
                    className="h-full w-full object-cover"
                    placeholder="blur"
                    blurDataURL={PRODUCT_BLUR_DATA_URL}
                  />
                </div>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
