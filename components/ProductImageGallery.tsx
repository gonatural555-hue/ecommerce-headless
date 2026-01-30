"use client";

import { useEffect, useMemo, useState } from "react";
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

  const [selectedImage, setSelectedImage] = useState<string>(
    featured || gallery[0] || ""
  );

  useEffect(() => {
    setSelectedImage(featured || gallery[0] || "");
  }, [featured, gallery]);

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
          // Constrain mobile height to avoid overflow while preserving ratio.
          "relative w-full max-w-full aspect-[4/5] md:aspect-square max-h-[70vh] md:max-h-none bg-dark-surface rounded-2xl overflow-hidden mb-4 border border-white/10",
          featuredContainerClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Image
          src={selectedImage}
          alt={`${title} - Vista principal`}
          fill
          priority
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

      {/* Gallery Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-3 max-w-full overflow-x-auto pb-2">
          {allImages.map((img, index) => (
            <button
              key={img}
              type="button"
              onClick={() => setSelectedImage(img)}
              className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl border overflow-hidden transition-all ${
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

