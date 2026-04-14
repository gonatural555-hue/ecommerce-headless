"use client";

import { useCart } from "@/context/CartContext";
import type { UISurface } from "@/lib/ui-surface";

export type AddToCartLinePayload = {
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
};

type Props = AddToCartLinePayload & {
  disabled?: boolean;
  label?: string;
  className?: string;
  /** PDP claro: anillo de foco sobre fondo blanco. */
  surface?: UISurface;
  /** Tras `addItem` exitoso (analytics sigue en CartContext). */
  onAfterAdd?: (item: AddToCartLinePayload) => void;
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
  surface = "dark",
  onAfterAdd,
}: Props) {
  const { addItem } = useCart();
  const ringOffset =
    surface === "light"
      ? "focus-visible:ring-offset-white"
      : "focus-visible:ring-offset-dark-base";

  return (
    <button
      onClick={() => {
        const payload = { id, title, price, image, variantSelections };
        addItem(payload);
        onAfterAdd?.(payload);
      }}
      disabled={disabled}
      className={[
        "w-full px-6 py-3 bg-accent-gold text-dark-base rounded-md font-semibold",
        "transition-all duration-300 ease-out hover:bg-accent-gold/90 hover:shadow-[0_12px_26px_rgba(200,155,60,0.25)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/80 focus-visible:ring-offset-2",
        ringOffset,
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
