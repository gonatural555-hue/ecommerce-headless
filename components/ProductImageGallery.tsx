"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { PRODUCT_BLUR_DATA_URL } from "@/lib/product-image-helper";
import type { UISurface } from "@/lib/ui-surface";

type Props = {
  featured: string | null;
  gallery: string[];
  title: string;
  noImageLabel?: string;
  featuredContainerClassName?: string;
  featuredImageClassName?: string;
  surface?: UISurface;
};

export default function ProductImageGallery({
  featured,
  gallery,
  title,
  noImageLabel = "No image",
  featuredContainerClassName,
  featuredImageClassName,
  surface = "dark",
}: Props) {
  const light = surface === "light";
  const allImages = useMemo(() => {
    return featured
      ? [featured, ...gallery.filter((img) => img !== featured)]
      : gallery;
  }, [featured, gallery]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

  useEffect(() => {
    setCurrentIndex(0);
    setDragOffset(0);
    setIsDragging(false);
  }, [featured, gallery]);

  const selectedImage = allImages[currentIndex] || "";
  const canSwipe = allImages.length > 1;
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!canSwipe) return;
    setIsDragging(true);
    startXRef.current = event.touches[0]?.clientX ?? 0;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !canSwipe) return;
    const currentX = event.touches[0]?.clientX ?? 0;
    setDragOffset(currentX - startXRef.current);
  };

  const handleTouchEnd = () => {
    if (!isDragging || !canSwipe) return;
    const threshold = 60;
    const delta = dragOffset;
    setIsDragging(false);
    setDragOffset(0);

    if (delta <= -threshold && currentIndex < allImages.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return;
    }
    if (delta >= threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (allImages.length === 0) {
    return (
      <div
        className={
          light
            ? "flex aspect-square items-center justify-center overflow-hidden rounded-none border-0 bg-transparent"
            : "flex aspect-square items-center justify-center overflow-hidden rounded-none border-0 bg-transparent"
        }
      >
        <span className={light ? "text-neutral-500" : "text-text-muted"}>
          {noImageLabel}
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-x-hidden">
      {/* Featured / Main Image */}
      <div
        className={[
          light
            ? "relative w-full max-w-full aspect-square overflow-hidden mb-4 rounded-none border-0 bg-transparent"
            : "relative w-full max-w-full aspect-square overflow-hidden mb-4 rounded-none border-0 bg-transparent",
          "mx-auto max-w-[80vw] max-h-[80vw] md:mx-0 md:max-w-none md:max-h-none lg:mx-auto lg:max-w-[520px] lg:max-h-[520px]",
          featuredContainerClassName,
        ]
          .filter(Boolean)
          .join(" ")}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <div
          className={[
            "flex h-full w-full",
            isDragging ? "" : "transition-transform duration-300 ease-out",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            transform: `translateX(calc(${-currentIndex * 100}% + ${dragOffset}px))`,
          }}
        >
          {allImages.map((img, index) => (
            <div key={img} className="relative h-full w-full flex-shrink-0">
              <Image
                src={img}
                alt={`${title} - Vista ${index + 1}`}
                fill
                priority={index === 0}
                loading={index === currentIndex ? "eager" : "lazy"}
                placeholder="blur"
                blurDataURL={PRODUCT_BLUR_DATA_URL}
                className={[
                  "object-contain w-full h-full",
                  featuredImageClassName,
                ]
                  .filter(Boolean)
                  .join(" ")}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-3 max-w-full overflow-x-auto pb-2 scrollbar-rail-premium md:justify-center">
          {allImages.map((img, index) => (
            <button
              key={img}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-md transition-shadow duration-200 ease-out ${
                selectedImage === img
                  ? `ring-2 ring-accent-gold ring-offset-2 ${
                      light ? "ring-offset-neutral-100" : "ring-offset-dark-base"
                    }`
                  : light
                    ? "ring-1 ring-inset ring-neutral-200/70 hover:ring-neutral-300/90"
                    : "ring-1 ring-inset ring-white/15 hover:ring-white/25"
              }`}
            >
              <Image
                src={img}
                alt={`${title} - Vista ${index + 1}`}
                width={80}
                height={80}
                loading="lazy"
                placeholder="blur"
                blurDataURL={PRODUCT_BLUR_DATA_URL}
                className="h-full w-full object-contain object-center"
              />
            </button>
          ))}
        </div>
      )}

    </div>
  );
}

