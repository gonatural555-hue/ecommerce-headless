import Image from "next/image";
import { PRODUCT_BLUR_DATA_URL } from "@/lib/product-image-helper";
import type { UISurface } from "@/lib/ui-surface";

type Props = {
  imageSrc: string;
  imageAlt: string;
  overlayText: string;
  surface?: UISurface;
};

/**
 * Franja editorial full-bleed con copy emocional sobre la imagen.
 */
export default function PdpImageStorySection({
  imageSrc,
  imageAlt,
  overlayText,
  surface = "dark",
}: Props) {
  const L = surface === "light";
  return (
    <section
      className={
        L
          ? "relative min-h-[min(72vh,640px)] w-full overflow-hidden bg-neutral-900"
          : "relative min-h-[min(72vh,640px)] w-full overflow-hidden bg-dark-base"
      }
    >
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover object-center"
          sizes="100vw"
          placeholder="blur"
          blurDataURL={PRODUCT_BLUR_DATA_URL}
          loading="lazy"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-dark-base via-dark-base/55 to-dark-base/25"
          aria-hidden
        />
      </div>
      <div className="relative z-10 flex min-h-[min(72vh,640px)] items-end px-6 pb-16 pt-24 sm:px-10 sm:pb-20 lg:px-16">
        <p className="max-w-xl font-semibold leading-[1.15] tracking-tight text-text-primary text-[clamp(1.75rem,5vw,2.75rem)]">
          {overlayText}
        </p>
      </div>
    </section>
  );
}
