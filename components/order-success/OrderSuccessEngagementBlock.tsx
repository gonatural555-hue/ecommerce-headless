"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { INSTAGRAM_URL, TIKTOK_URL } from "@/lib/social-links";
import HorizontalSwipeHint from "@/components/HorizontalSwipeHint";

/** Mismos slugs destacados que en `app/[locale]/page.tsx` (posts reales en messages.blog.posts). */
const ORDER_SUCCESS_BLOG_SLUGS = [
  "camping-fin-de-semana-basico",
  "no-mires-para-arriba",
  "atreverse-un-poco-mas",
] as const;

function isLikelyPath(value: string) {
  return Boolean(value && value.startsWith("/"));
}

export default function OrderSuccessEngagementBlock() {
  const locale = useLocale();
  const t = useTranslations();

  const blogCards = useMemo(() => {
    return ORDER_SUCCESS_BLOG_SLUGS.map((slug) => {
      const title = t(`blog.posts.${slug}.title`);
      const excerpt = t(`blog.posts.${slug}.excerpt`);
      const imgKey = `blog.posts.${slug}.sections.0.image`;
      const rawImage = t(imgKey);
      const image = isLikelyPath(rawImage) ? rawImage : "/assets/images/blog/blog-hero.webp";
      return { slug, title, excerpt, image };
    });
  }, [t, locale]);

  const showSocial = Boolean(INSTAGRAM_URL || TIKTOK_URL);

  return (
    <section className="rounded-2xl border border-dashed border-white/15 bg-dark-base/50 p-8 md:p-10 text-center">
      <p className="text-sm md:text-base text-text-primary/95 font-medium leading-relaxed max-w-2xl mx-auto">
        {t("orderSuccessPage.brandQuote")}
      </p>

      {showSocial ? (
        <div className="mt-10 pt-10 border-t border-white/10">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-gold/90 mb-4">
            {t("orderSuccessPage.followUs")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {INSTAGRAM_URL ? (
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("orderSuccessPage.instagramAria")}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-text-primary transition hover:border-accent-gold/40 hover:bg-accent-gold/10 hover:text-accent-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/50"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm10.5 1.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
                </svg>
              </a>
            ) : null}
            {TIKTOK_URL ? (
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("orderSuccessPage.tiktokAria")}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-text-primary transition hover:border-accent-gold/40 hover:bg-accent-gold/10 hover:text-accent-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/50"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="mt-10 pt-10 border-t border-white/10 text-left">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-accent-gold/90 mb-2 text-center md:text-left">
          {t("orderSuccessPage.blogCarouselTitle")}
        </h3>
        <p className="text-xs text-text-muted max-w-2xl mx-auto md:mx-0 mb-6 text-center md:text-left leading-relaxed">
          {t("orderSuccessPage.blogCarouselSubtitle")}
        </p>
        <HorizontalSwipeHint className="mb-3 md:hidden" />
        <div
          className="-mx-2 overflow-x-auto overflow-y-visible pb-2 scroll-smooth snap-x snap-mandatory scrollbar-rail-premium focus-within:outline-none"
          tabIndex={0}
          role="region"
          aria-label={t("orderSuccessPage.blogCarouselAria")}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="flex gap-4 md:gap-5 w-max px-2">
            {blogCards.map((post) => (
              <Link
                key={post.slug}
                href={`/${locale}/blog/${post.slug}`}
                className="group snap-start shrink-0 w-[min(85vw,280px)] sm:w-72 rounded-2xl border border-white/10 bg-dark-surface/50 overflow-hidden text-left transition duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.45)] motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/50"
              >
                <div className="relative aspect-[16/10] w-full bg-dark-base">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    className="object-cover object-center transition duration-300 group-hover:opacity-95"
                    sizes="(max-width: 640px) 85vw, 288px"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-semibold text-text-primary leading-snug line-clamp-2 group-hover:text-accent-gold/95 transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
