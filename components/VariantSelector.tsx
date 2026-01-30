"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import type {
  ProductVariants,
  VariantDefinition,
  VariantMatrix,
} from "@/lib/product-variants";

type VariantSelectorProps = {
  variants: ProductVariants;
  value?: Record<string, string>;
  onChange?: (selections: Record<string, string>) => void;
};

/**
 * Valida si una combinación de selecciones es válida según variantMatrix
 */
function isValidCombination(
  selections: Record<string, string>,
  variantMatrix?: VariantMatrix
): boolean {
  if (!variantMatrix || variantMatrix.length === 0) {
    return true; // Sin matriz, todas las combinaciones son válidas
  }

  // Verificar si existe alguna combinación en la matriz que coincida
  return variantMatrix.some((matrixRow) => {
    // Todas las claves en selections deben coincidir con matrixRow
    return Object.keys(selections).every((key) => {
      const selectionValue = selections[key];
      const matrixValue = matrixRow[key];

      // Si la matriz no tiene esta clave, no es válida
      if (matrixValue === undefined) {
        return false;
      }

      // Comparar valores (pueden ser value o label)
      return matrixValue === selectionValue;
    });
  });
}

/**
 * Verifica si una opción específica es válida dado el estado actual de selecciones
 */
function isOptionValid(
  variantType: string,
  optionValue: string,
  currentSelections: Record<string, string>,
  variantMatrix?: VariantMatrix
): boolean {
  if (!variantMatrix || variantMatrix.length === 0) {
    return true; // Sin matriz, todas las opciones son válidas
  }

  // Crear una combinación temporal con esta opción
  const testSelections = {
    ...currentSelections,
    [variantType]: optionValue,
  };

  return isValidCombination(testSelections, variantMatrix);
}

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

  return (
    <div className="space-y-6">
      {variantDefinitions.map((variant) => {
        const currentValue = selections[variant.type];
        const isSelected = (option: { label: string; value?: string }) => {
          const optionKey = option.value || option.label;
          return currentValue === optionKey;
        };

        return (
          <section key={variant.type} className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-text-primary">
                {variant.label}
              </h3>
              {currentValue && (
                <span className="text-sm text-text-muted">
                  {variant.options.find(
                    (opt) =>
                      (opt.value || opt.label) === currentValue
                  )?.label || currentValue}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {variant.options.map((option) => {
                const optionKey = option.value || option.label;
                const isActive = isSelected(option);
                const isValid = isOptionValid(
                  variant.type,
                  optionKey,
                  selections,
                  variantMatrix
                );

                return (
                  <button
                    key={optionKey}
                    type="button"
                    onClick={() =>
                      handleSelect(variant.type, optionKey, option.label)
                    }
                    disabled={!isValid}
                    className={[
                      "w-full rounded-lg border px-3 py-2 text-sm font-medium transition-colors duration-200 ease-out",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark-base",
                      !isValid
                        ? "opacity-40 cursor-not-allowed border-white/10 bg-dark-surface/40 text-text-muted"
                        : isActive
                        ? "border-accent-gold bg-dark-surface text-text-primary ring-1 ring-accent-gold/50"
                        : "border-white/15 bg-dark-surface/60 text-text-primary hover:border-white/30",
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
