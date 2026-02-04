"use client";

import Image from "next/image";
import { PRODUCT_BLUR_DATA_URL } from "@/lib/product-image-helper";

type Props = {
  featured: string | null;
  gallery: string[];
  title: string;
  noImageLabel?: string;
};

export default function ProductImageGridDesktop({
  featured,
  gallery,
  title,
  noImageLabel = "No image",
}: Props) {
  const allImages = featured
    ? [featured, ...gallery.filter((img) => img !== featured)]
    : gallery;

  if (allImages.length === 0) {
    return (
      <div className="aspect-square bg-dark-surface rounded-2xl overflow-hidden flex items-center justify-center border border-white/10">
        <span className="text-text-muted">{noImageLabel}</span>
      </div>
    );
  }

  const firstImage = allImages[0];
  const restImages = allImages.slice(1);

  return (
    <div className="space-y-4">
      {/* Primera imagen grande */}
      <div className="relative w-full aspect-square bg-dark-surface rounded-2xl overflow-hidden border border-white/10">
        <Image
          src={firstImage}
          alt={`${title} - Vista principal`}
          fill
          priority
          placeholder="blur"
          blurDataURL={PRODUCT_BLUR_DATA_URL}
          className="object-contain w-full h-full"
          sizes="(min-width: 1024px) 60vw, 100vw"
        />
      </div>

      {/* Resto de imágenes en grid 2 columnas */}
      {restImages.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {restImages.map((img, index) => (
            <div
              key={img}
              className="relative w-full aspect-square bg-dark-surface rounded-2xl overflow-hidden border border-white/10"
            >
              <Image
                src={img}
                alt={`${title} - Vista ${index + 2}`}
                fill
                loading="lazy"
                placeholder="blur"
                blurDataURL={PRODUCT_BLUR_DATA_URL}
                className="object-contain w-full h-full"
                sizes="(min-width: 1024px) 30vw, 50vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

