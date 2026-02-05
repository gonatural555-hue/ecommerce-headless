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

  // Grid de 1 columna si hay 4 o menos imágenes, 2 columnas si hay más de 4
  const useTwoColumns = allImages.length > 4;
  const gridCols = useTwoColumns ? "grid-cols-2" : "grid-cols-1";

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {allImages.map((img, index) => (
        <div
          key={img}
          className="relative w-full aspect-square bg-dark-surface rounded-2xl overflow-hidden border border-white/10"
          style={{
            maxHeight: useTwoColumns ? "600px" : "800px",
          }}
        >
          <Image
            src={img}
            alt={`${title} - Vista ${index + 1}`}
            fill
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            placeholder="blur"
            blurDataURL={PRODUCT_BLUR_DATA_URL}
            className="object-contain w-full h-full"
            sizes={useTwoColumns ? "(min-width: 1024px) 30vw, 50vw" : "(min-width: 1024px) 60vw, 100vw"}
          />
        </div>
      ))}
    </div>
  );
}

