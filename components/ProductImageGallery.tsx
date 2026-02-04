"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { PRODUCT_BLUR_DATA_URL } from "@/lib/product-image-helper";

type Props = {
  featured: string | null;
  gallery: string[];
  title: string;
  noImageLabel?: string;
  featuredContainerClassName?: string;
  featuredImageClassName?: string;
};

export default function ProductImageGallery({
  featured,
  gallery,
  title,
  noImageLabel = "No image",
  featuredContainerClassName,
  featuredImageClassName,
}: Props) {
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
      <div className="aspect-square bg-dark-surface rounded-2xl overflow-hidden flex items-center justify-center border border-white/10">
        <span className="text-text-muted">{noImageLabel}</span>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-x-hidden">
      {/* Featured / Main Image */}
      <div
        className={[
          // Square container with dark surface to keep images fully visible.
          "relative w-full max-w-full aspect-square bg-dark-surface rounded-2xl overflow-hidden mb-4 border border-white/10",
          // Desktop: keep gallery contained and premium-sized.
          "mx-auto max-w-[80vw] max-h-[80vw] md:mx-0 md:max-w-none md:max-h-none xl:mx-auto xl:max-w-[520px] xl:max-h-[520px]",
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
        <div className="flex gap-3 max-w-full overflow-x-auto pb-2 md:justify-center xl:gap-4">
          {allImages.map((img, index) => (
            <button
              key={img}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 xl:w-24 xl:h-24 rounded-xl border overflow-hidden transition-all duration-200 ease-out hover:-translate-y-0.5 ${
                selectedImage === img
                  ? "border-accent-gold ring-1 ring-accent-gold/60"
                  : "border-white/15 hover:border-white/30"
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
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

    </div>
  );
}

