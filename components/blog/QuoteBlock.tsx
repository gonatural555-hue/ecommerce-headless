import ScrollReveal from "@/components/blog/ScrollReveal";

type QuoteBlockProps = {
  text: string;
};

/**
 * Standalone typographic beat — large, centered, minimal chrome.
 */
export default function QuoteBlock({ text }: QuoteBlockProps) {
  return (
    <section className="bg-dark-base py-16 md:py-24 lg:py-28">
      <ScrollReveal>
        <blockquote className="mx-auto max-w-4xl px-6 text-center sm:px-10">
          <p className="font-light leading-tight tracking-tight text-text-primary text-[clamp(1.65rem,4.2vw,3.25rem)]">
            {text}
          </p>
        </blockquote>
      </ScrollReveal>
    </section>
  );
}
