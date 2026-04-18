import type { UISurface } from "@/lib/ui-surface";

type Props = {
  title: string;
  bullets: string[];
  surface?: UISurface;
};

export default function PdpBenefitsSection({
  title,
  bullets,
  surface = "dark",
}: Props) {
  const L = surface === "light";
  if (bullets.length === 0) return null;

  return (
    <section
      className={
        L
          ? "border-t border-neutral-200/90 py-16 md:py-20"
          : "border-t border-white/[0.07] py-16 md:py-20"
      }
      aria-labelledby="pdp-benefits-heading"
    >
      <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-16">
        <h2
          id="pdp-benefits-heading"
          className={
            L
              ? "text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500"
              : "text-xs font-semibold uppercase tracking-[0.2em] text-text-muted"
          }
        >
          {title}
        </h2>
        <ul className="mt-8 space-y-4">
          {bullets.map((line) => (
            <li
              key={line}
              className={
                L
                  ? "flex gap-3 text-base leading-relaxed text-neutral-800"
                  : "flex gap-3 text-base leading-relaxed text-text-primary/90"
              }
            >
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-gold" />
              {line}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
