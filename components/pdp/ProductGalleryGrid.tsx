"use client";

import Image from "next/image";
import { PRODUCT_BLUR_DATA_URL } from "@/lib/product-image-helper";
import type { UISurface } from "@/lib/ui-surface";

type Props = {
  images: string[];
  title: string;
  noImageLabel?: string;
  surface?: UISurface;
};

/**
 * Galería desktop estilo editorial: rejilla 2 columnas, varias imágenes visibles.
 */
export default function ProductGalleryGrid({
  images,
  title,
  noImageLabel = "Sin imagen",
  surface = "dark",
}: Props) {
  const L = surface === "light";

  if (images.length === 0) {
    return (
      <div
        className={
          L
            ? "flex min-h-[280px] items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-100 text-neutral-500"
            : "flex min-h-[280px] items-center justify-center rounded-2xl border border-white/10 bg-dark-surface/40 text-text-muted"
        }
      >
        {noImageLabel}
      </div>
    );
  }

  const cellBorder = L
    ? "border border-neutral-200/90 bg-neutral-100"
    : "border border-white/10 bg-dark-surface/35";

  return (
    <div className="grid grid-cols-2 gap-4 xl:gap-5">
      {images.map((src, index) => (
        <div
          key={`${src}-${index}`}
          className={[
            "group relative aspect-[4/5] w-full overflow-hidden rounded-xl",
            cellBorder,
          ].join(" ")}
        >
          <Image
            src={src}
            alt={`${title} — ${index + 1}`}
            fill
            priority={index < 2}
            loading={index < 4 ? "eager" : "lazy"}
            placeholder="blur"
            blurDataURL={PRODUCT_BLUR_DATA_URL}
            sizes="(min-width: 1024px) 30vw, 100vw"
            className="object-contain object-center transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        </div>
      ))}
    </div>
  );
}
