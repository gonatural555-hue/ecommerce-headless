"use client";

import { useCart } from "@/context/CartContext";

type Props = {
  id: string;
  title: string;
  price: number;
  image?: string;
  variantSelections?: {
    type: string;
    typeLabel?: string;
    value: string;
    label?: string;
  }[];
  disabled?: boolean;
  label?: string;
};

export default function AddToCartButton({
  id,
  title,
  price,
  image,
  variantSelections,
  disabled,
  label,
}: Props) {
  const { addItem } = useCart();

  return (
    <button
      onClick={() => addItem({ id, title, price, image, variantSelections })}
      disabled={disabled}
      className="mt-6 w-full md:w-auto px-6 py-3 bg-accent-gold text-dark-base rounded-md transition-colors duration-300 ease-out hover:bg-accent-gold/90 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {label || "Add to cart"}
    </button>
  );
}
