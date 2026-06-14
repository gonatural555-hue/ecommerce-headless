"use client";

import { useCallback, useState } from "react";
import {
  DEFAULT_MEMBERSHIP_PROMO_LAYOUT,
  saveMembershipPromoLayout,
  type MembershipPromoLayout,
} from "@/lib/products-membership-promo-layout";

type Props = {
  layout: MembershipPromoLayout;
  onChange: (layout: MembershipPromoLayout) => void;
};

type SliderSpec = {
  key: keyof MembershipPromoLayout;
  label: string;
  min: number;
  max: number;
  unit?: string;
};

const SLIDERS: SliderSpec[] = [
  { key: "containerMaxWidthPx", label: "Max-width contenedor", min: 640, max: 1600, unit: "px" },
  { key: "containerWidthPct", label: "Ancho contenedor", min: 50, max: 100, unit: "%" },
  { key: "marginTopPx", label: "Margin-top", min: -400, max: 400, unit: "px" },
  { key: "marginBottomPx", label: "Margin-bottom", min: -400, max: 400, unit: "px" },
  { key: "translateXPx", label: "Translate X", min: -400, max: 400, unit: "px" },
  { key: "translateYPx", label: "Translate Y", min: -400, max: 400, unit: "px" },
  { key: "imageMaxWidthPx", label: "Ancho max PNG", min: 120, max: 720, unit: "px" },
  { key: "imageMaxHeightPx", label: "Alto max PNG", min: 160, max: 800, unit: "px" },
  { key: "imageScalePct", label: "Scale PNG", min: 25, max: 200, unit: "%" },
  { key: "imageTranslateXPx", label: "Posición X PNG", min: -400, max: 400, unit: "px" },
  { key: "imageTranslateYPx", label: "Posición Y PNG", min: -400, max: 400, unit: "px" },
];

export default function MembershipPromoDirectorPanel({ layout, onChange }: Props) {
  const [copied, setCopied] = useState(false);

  const update = useCallback(
    (patch: Partial<MembershipPromoLayout>) => {
      const next = { ...layout, ...patch };
      onChange(next);
      saveMembershipPromoLayout(next);
    },
    [layout, onChange]
  );

  const handleResetAll = () => {
    const next = { ...DEFAULT_MEMBERSHIP_PROMO_LAYOUT };
    onChange(next);
    saveMembershipPromoLayout(next);
  };

  const handleCopy = async () => {
    const payload = JSON.stringify(layout, null, 2);
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <aside
      className="fixed bottom-4 right-4 z-[80] flex max-h-[min(88dvh,720px)] w-[min(100vw-2rem,340px)] flex-col rounded-xl border border-white/15 bg-[rgba(18,22,26,0.94)] font-inter text-xs text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md"
      aria-label="Director — banner 15% descuento"
    >
      <div className="shrink-0 border-b border-white/10 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D9A441]">
          Director
        </p>
        <p className="mt-1 text-[11px] leading-snug text-white/65">
          Banner 15% descuento · ?director=true · localStorage
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleResetAll}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-[11px] font-medium text-white/85 transition hover:bg-white/10"
          >
            Reset todo
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-lg border border-[#D9A441]/40 bg-[#D9A441]/15 px-3 py-1.5 text-[11px] font-medium text-[#F4EBDD] transition hover:bg-[#D9A441]/25"
          >
            {copied ? "Copiado" : "Copiar JSON"}
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {SLIDERS.map(({ key, label, min, max, unit = "" }) => (
          <label
            key={key}
            className="block rounded-lg border border-white/10 bg-black/20 px-3 py-2"
          >
            <span className="mb-1 flex justify-between text-[11px] font-medium text-white/90">
              <span>{label}</span>
              <span className="font-mono text-[10px] tabular-nums text-white/45">
                {layout[key]}
                {unit}
              </span>
            </span>
            <input
              type="range"
              min={min}
              max={max}
              step={1}
              value={layout[key]}
              onChange={(e) => update({ [key]: Number(e.target.value) })}
              className="w-full accent-[#D9A441]"
              aria-label={label}
            />
          </label>
        ))}
      </div>
    </aside>
  );
}
