import Image from "next/image";
import ScrollReveal from "@/components/blog/ScrollReveal";

type EditorialBreakProps = {
  variant: "image" | "text";
  title: string;
  imageSrc?: string;
  imageAlt?: string;
};

export default function EditorialBreak({
  variant,
  title,
  imageSrc,
  imageAlt = "",
}: EditorialBreakProps) {
  if (variant === "image" && imageSrc) {
    return (
      <section className="my-16 md:my-24 lg:my-28">
        <ScrollReveal>
          <div className="relative min-h-[200px] w-full overflow-hidden md:min-h-[280px]">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="100vw"
              loading="lazy"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-dark-base/45" />
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <p className="max-w-2xl text-center font-light leading-tight tracking-tight text-text-primary text-[clamp(1.25rem,3.5vw,2rem)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
                {title}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>
    );
  }

  return (
    <section className="border-y border-white/[0.05] bg-[#0a0e0d] py-14 md:py-20">
      <ScrollReveal>
        <p className="mx-auto max-w-2xl px-6 text-center font-light leading-snug tracking-tight text-text-primary text-[clamp(1.2rem,3vw,1.85rem)]">
          {title}
        </p>
      </ScrollReveal>
    </section>
  );
}
