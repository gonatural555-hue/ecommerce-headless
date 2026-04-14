import type { VariantMatrix } from "@/lib/product-variants";

export function isValidCombination(
  selections: Record<string, string>,
  variantMatrix?: VariantMatrix
): boolean {
  if (!variantMatrix || variantMatrix.length === 0) {
    return true;
  }

  return variantMatrix.some((matrixRow) => {
    return Object.keys(selections).every((key) => {
      const selectionValue = selections[key];
      const matrixValue = matrixRow[key];
      if (matrixValue === undefined) {
        return false;
      }
      return matrixValue === selectionValue;
    });
  });
}

export function isOptionValid(
  variantType: string,
  optionValue: string,
  currentSelections: Record<string, string>,
  variantMatrix?: VariantMatrix
): boolean {
  if (!variantMatrix || variantMatrix.length === 0) {
    return true;
  }

  const testSelections = {
    ...currentSelections,
    [variantType]: optionValue,
  };

  return isValidCombination(testSelections, variantMatrix);
}
