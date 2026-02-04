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
  className?: string;
};

export default function AddToCartButton({
  id,
  title,
  price,
  image,
  variantSelections,
  disabled,
  label,
  className,
}: Props) {
  const { addItem } = useCart();

  return (
    <button
      onClick={() => addItem({ id, title, price, image, variantSelections })}
      disabled={disabled}
      className={[
        "w-full md:w-auto px-6 py-3 bg-accent-gold text-dark-base rounded-md font-semibold",
        "transition-all duration-300 ease-out hover:bg-accent-gold/90 hover:shadow-[0_12px_26px_rgba(200,155,60,0.25)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/80 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-base",
        "active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label || "Add to cart"}
    </button>
  );
}
