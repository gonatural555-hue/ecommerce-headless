"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Product } from "@/lib/products";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { useCart } from "@/context/CartContext";
import { PRODUCT_BLUR_DATA_URL } from "@/lib/product-image-helper";
import { trackSelectItem } from "@/lib/analytics/ga4";
import type { UISurface } from "@/lib/ui-surface";

type Props = {
  product: Product;
  locale?: Locale;
  labels?: {
    viewProduct?: string;
    noImage?: string;
    addToCart?: string;
  };
  /** Origen del listado para GA4 `select_item` (p. ej. categoría, destacados). */
  analyticsListId?: string;
  analyticsListName?: string;
  /** Tarjeta sobre fondo claro (p. ej. cross-sell en PDP). */
  surface?: UISurface;
};

function isValidImageSrc(src?: string | null) {
  if (!src) return false;
  if (src.startsWith("http")) return true;
  if (src.startsWith("/")) return true;
  return false;
}

export default function ProductCardSimple({
  product,
  locale = defaultLocale,
  labels,
  analyticsListId,
  analyticsListName = "product_list",
  surface = "dark",
}: Props) {
  const L = surface === "light";
  const localized = product.translations?.[locale];
  const title = localized?.title || product.title;
  const description =
    localized?.shortDescription ||
    localized?.description ||
    product.shortDescription ||
    product.description;
  const imageList = useMemo(
    () => (product.images || []).filter((src) => isValidImageSrc(src)),
    [product.images]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = imageList[activeIndex] || imageList[0];
  const hasValidImage = Boolean(activeImage);
  const isExternal = hasValidImage && activeImage!.startsWith("http");
  const isLocal = hasValidImage && activeImage!.startsWith("/");
  const viewProductLabel = labels?.viewProduct || "View product";
  const noImageLabel = labels?.noImage || "No image";
  const addToCartLabel = labels?.addToCart || "Agregar al carrito";
  const { addItem } = useCart();

  return (
    <Link
      href={`/${locale}/products/${product.id}`}
      onClick={() => {
        trackSelectItem({
          item: {
            item_id: product.id,
            item_name: title,
            price: product.price,
            item_category: product.category,
          },
          itemListId: analyticsListId,
          itemListName: analyticsListName,
        });
      }}
    >
      <article
        className={
          L
            ? "group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:hover:translate-y-0 hover:-translate-y-0.5 hover:shadow-md"
            : "group overflow-hidden rounded-xl border border-white/5 bg-dark-surface/70 shadow-[0_6px_16px_rgba(0,0,0,0.24)] transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:hover:translate-y-0 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
        }
      >
        {/* IMAGE */}
        <div
          className={
            L
              ? "relative w-full bg-neutral-100 overflow-hidden"
              : "relative w-full bg-dark-surface overflow-hidden"
          }
        >
          {hasValidImage ? (
            isExternal ? (
              <img
                src={activeImage!}
                alt={title}
                loading="lazy"
                decoding="async"
                className="block w-full h-auto object-contain object-center transition-transform duration-300 ease-out group-hover:scale-[1.02]"
              />
            ) : isLocal ? (
              <Image
                src={activeImage!}
                alt={title}
                width={1200}
                height={900}
                className="block w-full h-auto object-contain object-center transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                placeholder="blur"
                blurDataURL={PRODUCT_BLUR_DATA_URL}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div
                className={
                  L
                    ? "flex items-center justify-center h-full text-sm text-neutral-500"
                    : "flex items-center justify-center h-full text-sm text-text-muted"
                }
              >
                {noImageLabel}
              </div>
            )
          ) : (
            <div
              className={
                L
                  ? "flex items-center justify-center h-full text-sm text-neutral-500"
                  : "flex items-center justify-center h-full text-sm text-text-muted"
              }
            >
              {noImageLabel}
            </div>
          )}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className={
                L
                  ? "absolute inset-0 bg-gradient-to-t from-neutral-900/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
                  : "absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
              }
            />
            <div className="absolute inset-x-0 bottom-4 flex items-center justify-center">
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  addItem({
                    id: product.id,
                    title,
                    price: product.price,
                    image: activeImage,
                  });
                }}
                className={
                  L
                    ? "pointer-events-auto rounded-full border border-neutral-300 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900 backdrop-blur-sm opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 hover:border-accent-gold/60 hover:text-accent-gold active:scale-[0.98]"
                    : "pointer-events-auto rounded-full border border-white/20 bg-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 hover:border-accent-gold/60 hover:text-accent-gold/90 active:scale-[0.98]"
                }
                aria-label={addToCartLabel}
              >
                {addToCartLabel}
              </button>
            </div>
          </div>
        </div>
        {imageList.length > 1 && (
          <div
            className="px-4 md:px-5 pb-4 md:pb-5"
            onClick={(event) => event.preventDefault()}
          >
            <div className="flex items-center gap-2">
              {imageList.slice(0, 5).map((_, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={`${product.id}-dot-${index}`}
                    type="button"
                    aria-label={`Preview ${title} ${index + 1}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    className={[
                      "h-2.5 w-2.5 rounded-full border transition-colors",
                      isActive
                        ? "border-accent-gold bg-accent-gold"
                        : L
                          ? "border-neutral-300 bg-transparent hover:border-neutral-500"
                          : "border-white/20 bg-transparent hover:border-white/40",
                    ].join(" ")}
                  />
                );
              })}
            </div>
        </div>
        )}

        {/* INFO */}
        <div className="p-4 md:p-5 space-y-2">
          <h2
            className={
              L
                ? "text-base font-semibold text-neutral-900 line-clamp-2"
                : "text-base font-semibold text-text-primary line-clamp-2"
            }
          >
            {title}
          </h2>
          <p
            className={
              L
                ? "text-xs text-neutral-600 line-clamp-2"
                : "text-xs text-text-muted line-clamp-2"
            }
          >
            {description}
          </p>
          <div className="flex items-center justify-between pt-1.5">
            <span
              className={
                L ? "text-sm text-neutral-900" : "text-sm text-text-primary"
              }
            >
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xs text-accent-gold transition-colors duration-200 ease-out group-hover:text-accent-gold/90">
              {viewProductLabel}
            </span>
          </div>
        </div>

      </article>
    </Link>
  );
}
