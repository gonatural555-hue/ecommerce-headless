import type { MetadataRoute } from "next";
<<<<<<< HEAD
import { locales } from "@/lib/i18n/config";
import { getProducts } from "@/lib/products";
import { getCategorySlugs } from "@/lib/categories";
import { getMessages } from "@/lib/i18n/messages";
import { blogSections } from "@/lib/blog-sections";
import { LEGAL_SLUGS, getSiteUrl } from "@/lib/seo";

const BASE_PAGES = [
  "",
  "go-natural",
  "products",
  "categories",
  "about",
  "contact",
  "blog",
=======
import { locales, type Locale } from "@/lib/i18n/config";
import { getGoodIdeasProducts } from "@/lib/good-ideas-products";
import {
  blogPostPath,
  homePath,
  productPath,
} from "@/lib/routing/paths";
import { getGoodIdeasBlogPostEntries } from "@/lib/good-ideas-blog-loader";
import { getSiteUrl, legalPathByLocale, type LegalSlugKey } from "@/lib/seo";

const BASE_PAGE_SUFFIXES = ["", "products", "about", "contact", "blog"] as const;

const LEGAL_PAGE_KEYS: LegalSlugKey[] = [
  "privacy",
  "cookies",
  "terms",
  "disclaimer",
  "returns",
  "shipping",
  "regret",
>>>>>>> 8e880344766638a7513f3b6c9d14c843a23fe9c1
];

function localePageUrl(locale: Locale, suffix: string): string {
  const base = getSiteUrl();
  if (!suffix) return `${base}${homePath(locale)}`;
  return `${base}/${locale}/${suffix}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const urls: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    BASE_PAGE_SUFFIXES.forEach((suffix) => {
      urls.push({ url: localePageUrl(locale, suffix), lastModified: now });
    });
  });

<<<<<<< HEAD
  const messages = await getMessages("en");
  const postSlugs = Object.keys(messages.blog.posts);
=======
  const giProducts = getGoodIdeasProducts();
  locales.forEach((locale) => {
    giProducts.forEach((product) => {
      urls.push({
        url: `${getSiteUrl()}${productPath(locale, product.id)}`,
        lastModified: now,
      });
    });
  });

>>>>>>> 8e880344766638a7513f3b6c9d14c843a23fe9c1
  locales.forEach((locale) => {
    getGoodIdeasBlogPostEntries(locale).forEach((entry) => {
      urls.push({
        url: `${getSiteUrl()}${blogPostPath(locale, entry.slug)}`,
        lastModified: entry.publishedAt ? new Date(entry.publishedAt) : now,
      });
    });
  });

  locales.forEach((locale) => {
<<<<<<< HEAD
    blogSections.forEach((section) => {
      urls.push({
        url: `${baseUrl}/${locale}/blog/${section.slug}`,
=======
    LEGAL_PAGE_KEYS.forEach((key) => {
      urls.push({
        url: `${getSiteUrl()}${legalPathByLocale(key)[locale]}`,
>>>>>>> 8e880344766638a7513f3b6c9d14c843a23fe9c1
        lastModified: now,
      });
    });
  });

<<<<<<< HEAD
  locales.forEach((locale) => {
    urls.push({
      url: `${baseUrl}/${locale}/${LEGAL_SLUGS.privacy[locale]}`,
      lastModified: now,
    });
    urls.push({
      url: `${baseUrl}/${locale}/${LEGAL_SLUGS.cookies[locale]}`,
      lastModified: now,
    });
    urls.push({
      url: `${baseUrl}/${locale}/${LEGAL_SLUGS.terms[locale]}`,
      lastModified: now,
    });
    urls.push({
      url: `${baseUrl}/${locale}/${LEGAL_SLUGS.disclaimer[locale]}`,
      lastModified: now,
    });
  });

=======
>>>>>>> 8e880344766638a7513f3b6c9d14c843a23fe9c1
  return urls;
}
