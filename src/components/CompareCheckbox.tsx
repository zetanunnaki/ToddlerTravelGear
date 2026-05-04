"use client";

import { useCompare, type CompareProduct } from "./CompareContext";

interface CompareCheckboxProps {
  product: CompareProduct;
}

export function CompareCheckbox({ product }: CompareCheckboxProps) {
  const { toggle, isSelected, selected } = useCompare();
  const checked = isSelected(product.id);
  const disabled = !checked && selected.length >= 3;

  return (
    <label
      className={`inline-flex items-center gap-1.5 text-xs cursor-pointer select-none ${
        disabled ? "opacity-40 cursor-not-allowed" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={() => toggle(product)}
        className="w-3.5 h-3.5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
      />
      <span className={checked ? "text-teal-700 font-medium" : "text-gray-500"}>
        Compare
      </span>
    </label>
  );
}
