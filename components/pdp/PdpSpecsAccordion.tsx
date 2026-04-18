"use client";

import { useState } from "react";
import type { UISurface } from "@/lib/ui-surface";

type Item = {
  id: string;
  title: string;
  lines: string[];
};

type Props = {
  items: Item[];
  surface?: UISurface;
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

/**
 * Acordeón múltiple para specs técnicas + detalles de producto (materiales, cuidados).
 */
export default function PdpSpecsAccordion({ items, surface = "dark" }: Props) {
  const L = surface === "light";
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  if (!items.length) return null;

  const shell = L
    ? "border border-neutral-200/90 bg-white/80"
    : "border border-white/[0.08] bg-dark-surface/35";

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-3xl space-y-3 px-6 sm:px-10 lg:px-16">
        {items.map((item) => {
          const open = openId === item.id;
          return (
            <div key={item.id} className={`overflow-hidden rounded-xl ${shell}`}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : item.id)}
                className={
                  L
                    ? "flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-medium text-neutral-900 transition hover:bg-neutral-50/80"
                    : "flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-medium text-text-primary transition hover:bg-white/[0.04]"
                }
                aria-expanded={open}
              >
                {item.title}
                <Chevron open={open} />
              </button>
              {open ? (
                <ul
                  className={
                    L
                      ? "space-y-2 border-t border-neutral-200/90 px-5 pb-4 pt-3 text-sm leading-relaxed text-neutral-600"
                      : "space-y-2 border-t border-white/[0.06] px-5 pb-4 pt-3 text-sm leading-relaxed text-text-muted"
                  }
                >
                  {item.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
