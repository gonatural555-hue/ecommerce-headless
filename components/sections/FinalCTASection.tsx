import Link from "next/link";

type FinalCTASectionProps = {
  title: string;
  ctaLabel: string;
  ctaHref: string;
};

export default function FinalCTASection({
  title,
  ctaLabel,
  ctaHref,
}: FinalCTASectionProps) {
  return (
    <section className="relative bg-dark-base bg-[url('/assets/images/hero/home-image-1.webp')] bg-cover bg-center bg-no-repeat py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-black/45" aria-hidden="true" />
      <div className="relative max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-text-primary">
          {title}
        </h2>
        <div className="mt-8">
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center rounded-md bg-accent-gold px-6 py-3 text-sm font-medium text-dark-base transition-colors duration-200 ease-out hover:bg-accent-gold/90"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

