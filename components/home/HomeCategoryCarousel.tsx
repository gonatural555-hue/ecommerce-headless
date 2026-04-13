"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/products";
import type { Locale } from "@/lib/i18n/config";
import ProductCardSimple from "@/components/ProductCardSimple";

type Props = {
  title: string;
  backgroundImage: string;
  products: Product[];
  locale: Locale;
  categoryHref: string;
  viewCategoryLabel: string;
  labels: {
    viewProduct: string;
    addToCart: string;
    noImage: string;
  };
};

const CARD_MIN = "min-w-[min(88vw,340px)] max-w-[340px] sm:min-w-[360px] sm:max-w-[380px]";

export default function HomeCategoryCarousel({
  title,
  backgroundImage,
  products,
  locale,
  categoryHref,
  viewCategoryLabel,
  labels,
}: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      className={`relative w-full overflow-hidden border-t border-white/5 transition-all duration-700 ease-out motion-reduce:transition-none ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 motion-reduce:translate-y-0 motion-reduce:opacity-100"
      }`}
    >
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={false}
        />
      </div>
      {/* Readability overlays */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#1F2D26]/95 via-[#1F2D26]/78 to-[#1F2D26]/45"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#1F2D26] via-transparent to-black/50"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay bg-gradient-to-br from-orange-500/30 via-red-600/20 to-purple-900/35 pointer-events-none"
        aria-hidden
      />

      <div className="relative z-10 py-16 md:py-24 lg:py-28">
        <div className="flex flex-col gap-4 px-5 sm:px-10 lg:px-14 max-w-[1600px] mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-left text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-tight text-[#FAF6F0] leading-tight drop-shadow-md max-w-[18ch]">
              {title}
            </h2>
            <Link
              href={categoryHref}
              className="shrink-0 text-sm font-semibold uppercase tracking-[0.2em] text-orange-100/90 border-b border-orange-200/40 pb-1 transition hover:text-white hover:border-orange-100/70"
            >
              {viewCategoryLabel}
            </Link>
          </div>

          <div
            className="mt-10 md:mt-12 -mx-5 sm:-mx-10 lg:-mx-14 px-5 sm:px-10 lg:px-14 overflow-x-auto overflow-y-visible pb-4 [scrollbar-width:thin] scroll-smooth snap-x snap-mandatory"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="flex gap-5 md:gap-7 w-max pr-8">
              {products.length === 0 ? (
                <p className="text-sm text-[#E8E4DC]/80 max-w-md py-8">
                  {viewCategoryLabel}
                </p>
              ) : (
                products.map((product) => (
                  <div
                    key={product.id}
                    className={`snap-start shrink-0 ${CARD_MIN} rounded-2xl transition-[transform,box-shadow] duration-500 ease-out will-change-transform hover:scale-[1.04] hover:z-10 hover:shadow-[0_28px_56px_-12px_rgba(0,0,0,0.55)] motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none`}
                  >
                    <ProductCardSimple
                      product={product}
                      locale={locale}
                      labels={labels}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
