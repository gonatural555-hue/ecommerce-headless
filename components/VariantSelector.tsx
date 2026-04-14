"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import type { ProductVariants, VariantDefinition } from "@/lib/product-variants";
import {
  isOptionValid,
  isValidCombination,
} from "@/lib/product-variant-matrix";
import type { UISurface } from "@/lib/ui-surface";

type VariantSelectorProps = {
  variants: ProductVariants;
  value?: Record<string, string>;
  onChange?: (selections: Record<string, string>) => void;
  /** Refined styling for desktop PDP; mobile should use default. */
  appearance?: "default" | "premium";
  surface?: UISurface;
};

/**
 * Selector visual de variantes reutilizable.
 * - Soporta múltiples tipos de variantes (color, talla, longitud, etc.)
 * - Valida combinaciones usando variantMatrix
 * - Deshabilita opciones que no forman combinaciones válidas
 * - Marca las opciones por defecto si existen
 */
export default function VariantSelector({
  variants,
  value,
  onChange,
  appearance = "default",
  surface = "dark",
}: VariantSelectorProps) {
  const { variants: variantDefinitions, variantMatrix } = variants;

  // Inicializar selecciones con valores por defecto
  const initialSelections = useMemo(() => {
    const selections: Record<string, string> = {};

    variantDefinitions.forEach((variant) => {
      if (variant.default) {
        // Buscar la opción que coincida con el default
        const defaultOption = variant.options.find(
          (opt) => opt.value === variant.default || opt.label === variant.default
        );
        if (defaultOption) {
          selections[variant.type] = defaultOption.value || defaultOption.label;
        } else if (variant.options.length > 0) {
          // Si no hay match, usar la primera opción
          selections[variant.type] =
            variant.options[0].value || variant.options[0].label;
        }
      } else if (variant.options.length > 0) {
        // Sin default, usar la primera opción
        selections[variant.type] =
          variant.options[0].value || variant.options[0].label;
      }
    });

    return selections;
  }, [variantDefinitions]);

  const [internalSelections, setInternalSelections] = useState<
    Record<string, string>
  >(initialSelections);

  const selections = value ?? internalSelections;

  useEffect(() => {
    if (value) return;
    setInternalSelections(initialSelections);
  }, [initialSelections, value]);

  const handleSelect = useCallback(
    (variantType: string, optionValue: string, optionLabel: string) => {
      const newSelections = {
        ...selections,
        [variantType]: optionValue || optionLabel,
      };

      // Validar combinación antes de actualizar
      if (isValidCombination(newSelections, variantMatrix)) {
        if (!value) {
          setInternalSelections(newSelections);
        }
        onChange?.(newSelections);
      }
    },
    [selections, variantMatrix, onChange, value]
  );

  if (!variantDefinitions || variantDefinitions.length === 0) {
    return null;
  }

  const isPremium = appearance === "premium";
  const light = surface === "light";

  const headingTitle = light
    ? isPremium
      ? "text-sm font-semibold tracking-wide text-neutral-900"
      : "text-base font-semibold text-neutral-900"
    : isPremium
      ? "text-sm font-semibold tracking-wide text-text-primary"
      : "text-base font-semibold text-text-primary";

  const headingMuted = light ? "text-sm text-neutral-600" : "text-sm text-text-muted";

  return (
    <div className={isPremium ? "space-y-5" : "space-y-6"}>
      {variantDefinitions.map((variant) => {
        const currentValue = selections[variant.type];
        const isSelected = (option: { label: string; value?: string }) => {
          const optionKey = option.value || option.label;
          return currentValue === optionKey;
        };

        return (
          <section
            key={variant.type}
            className={isPremium ? "space-y-2.5" : "space-y-3"}
          >
            <div className="flex items-center gap-2">
              <h3 className={headingTitle}>
                {variant.label}
              </h3>
              {currentValue && (
                <span className={headingMuted}>
                  {variant.options.find(
                    (opt) =>
                      (opt.value || opt.label) === currentValue
                  )?.label || currentValue}
                </span>
              )}
            </div>

            <div
              className={
                isPremium
                  ? "grid grid-cols-2 sm:grid-cols-3 gap-2.5"
                  : "grid grid-cols-2 sm:grid-cols-3 gap-2"
              }
            >
              {variant.options.map((option) => {
                const optionKey = option.value || option.label;
                const isActive = isSelected(option);
                const isValid = isOptionValid(
                  variant.type,
                  optionKey,
                  selections,
                  variantMatrix
                );

                const baseFocus = [
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2",
                  light
                    ? "focus-visible:ring-offset-white"
                    : "focus-visible:ring-offset-dark-base",
                ].join(" ");

                const premiumClasses = !isValid
                  ? light
                    ? "opacity-40 cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-500"
                    : "opacity-40 cursor-not-allowed border-white/10 bg-dark-surface/30 text-text-muted"
                  : isActive
                  ? light
                    ? "border-accent-gold/90 bg-white text-neutral-900 ring-1 ring-accent-gold shadow-[0_0_0_1px_rgba(212,175,55,0.25)]"
                    : "border-accent-gold/85 bg-dark-surface text-text-primary ring-1 ring-accent-gold shadow-[0_0_0_1px_rgba(212,175,55,0.22)]"
                  : light
                  ? "border-neutral-200 bg-neutral-50 text-neutral-900 hover:border-accent-gold/50 hover:shadow-[0_0_14px_rgba(200,155,60,0.08)]"
                  : "border-white/12 bg-dark-surface/50 text-text-primary hover:border-accent-gold/40 hover:shadow-[0_0_14px_rgba(200,155,60,0.07)]";

                const defaultClasses = !isValid
                  ? light
                    ? "opacity-40 cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-500"
                    : "opacity-40 cursor-not-allowed border-white/10 bg-dark-surface/40 text-text-muted"
                  : isActive
                  ? light
                    ? "border-accent-gold bg-white text-neutral-900 ring-1 ring-accent-gold/60"
                    : "border-accent-gold bg-dark-surface text-text-primary ring-1 ring-accent-gold/50"
                  : light
                  ? "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400"
                  : "border-white/15 bg-dark-surface/60 text-text-primary hover:border-white/30";

                return (
                  <button
                    key={optionKey}
                    type="button"
                    onClick={() =>
                      handleSelect(variant.type, optionKey, option.label)
                    }
                    disabled={!isValid}
                    className={[
                      "w-full rounded-lg border px-3 py-2 text-sm font-medium ease-out",
                      isPremium
                        ? "transition-all duration-200"
                        : "transition-colors duration-200",
                      baseFocus,
                      isPremium ? premiumClasses : defaultClasses,
                    ].join(" ")}
                    aria-pressed={isActive}
                    aria-disabled={!isValid}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
