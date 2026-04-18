import Image from "next/image";
import ScrollReveal from "@/components/blog/ScrollReveal";

type ImageSectionProps = {
  imageSrc: string;
  caption?: string;
  imageAlt: string;
};

/**
 * Full-bleed cinematic strip: image as narrative anchor, optional caption.
 */
export default function ImageSection({
  imageSrc,
  caption,
  imageAlt,
}: ImageSectionProps) {
  return (
    <section className="bg-dark-base">
      <ScrollReveal className="w-full">
        <div className="relative min-h-[48vh] w-full md:min-h-[56vh] lg:min-h-[62vh]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="100vw"
            loading="lazy"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-dark-base/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-base/80 via-transparent to-dark-base/30" />
        </div>
        {caption ? (
          <p className="mx-auto max-w-3xl px-6 py-8 text-center text-xs font-medium uppercase tracking-[0.28em] text-text-muted sm:px-10 md:py-10">
            {caption}
          </p>
        ) : null}
      </ScrollReveal>
    </section>
  );
}
