import Image from "next/image";
import ScrollReveal from "@/components/blog/ScrollReveal";

type ImageStorySectionProps = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  premiumOutdoorBranding?: boolean;
};

/**
 * Full-bleed narrative strip with centered overlay — matches blog ImageSection + copy.
 */
export default function ImageStorySection({
  imageSrc,
  imageAlt,
  title,
  premiumOutdoorBranding = false,
}: ImageStorySectionProps) {
  return (
    <section
      className={
        premiumOutdoorBranding
          ? "relative bg-brand-forest-black"
          : "relative bg-dark-base"
      }
    >
      <div className="relative min-h-[52vh] w-full md:min-h-[58vh] lg:min-h-[62vh]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="100vw"
          loading="lazy"
          className="object-cover object-center"
        />
        <div
          className={
            premiumOutdoorBranding
              ? "absolute inset-0 bg-[color-mix(in_srgb,var(--brand-forest-black)_40%,transparent)]"
              : "absolute inset-0 bg-dark-base/40"
          }
        />
        <div
          className={
            premiumOutdoorBranding
              ? "absolute inset-0 bg-gradient-to-t from-brand-forest-black via-[color-mix(in_srgb,var(--brand-forest-black)_20%,transparent)] to-[color-mix(in_srgb,var(--brand-forest-black)_50%,transparent)]"
              : "absolute inset-0 bg-gradient-to-t from-dark-base via-dark-base/20 to-dark-base/50"
          }
        />

        <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
          <ScrollReveal>
            <p
              className={
                premiumOutdoorBranding
                  ? "font-body max-w-3xl text-center font-light leading-tight tracking-tight text-brand-warm-sand text-[clamp(1.5rem,4vw,2.75rem)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)]"
                  : "max-w-3xl text-center font-light leading-tight tracking-tight text-text-primary text-[clamp(1.5rem,4vw,2.75rem)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)]"
              }
            >
              {title}
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
