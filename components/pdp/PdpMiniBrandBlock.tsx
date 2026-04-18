import type { UISurface } from "@/lib/ui-surface";

type Props = {
  message: string;
  surface?: UISurface;
};

export default function PdpMiniBrandBlock({ message, surface = "dark" }: Props) {
  const L = surface === "light";

  return (
    <section
      className={
        L
          ? "border-t border-neutral-200/90 bg-gradient-to-b from-neutral-50/90 to-white py-20 md:py-28"
          : "border-t border-white/[0.07] bg-gradient-to-b from-dark-base to-dark-surface/40 py-20 md:py-28"
      }
    >
      <div className="mx-auto max-w-2xl px-6 text-center sm:px-10 lg:px-16">
        <p
          className={
            L
              ? "font-medium leading-relaxed text-neutral-800 text-[clamp(1.25rem,3.5vw,1.65rem)]"
              : "font-medium leading-relaxed text-text-primary/95 text-[clamp(1.25rem,3.5vw,1.65rem)]"
          }
        >
          {message}
        </p>
      </div>
    </section>
  );
}
