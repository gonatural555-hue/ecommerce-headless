import Link from "next/link";
import Image from "next/image";
import { getProducts, getProductById } from "@/lib/products";
import { getProductImages } from "@/lib/product-images";
import { getProductVariants } from "@/lib/product-variants";
import type { Product } from "@/lib/products";
import ProductCardSimple from "@/components/ProductCardSimple";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import { locales, type Locale } from "@/lib/i18n/config";
import { buildMetadata, formatTemplate } from "@/lib/seo";
import ProductDetailClient from "@/components/ProductDetailClient";
import ProductReviews from "@/components/ProductReviews";
import EditorialPostCards from "@/components/editorial/EditorialPostCards";
import { pickPostsForProduct } from "@/lib/internal-links";
import { REVIEWS_SEED, getReviewsByProductSlug } from "@/lib/reviews-data";
import { PRODUCT_BLUR_DATA_URL } from "@/lib/product-image-helper";

type Props = {
  params: Promise<{
    locale: Locale;
    id: string;
  }>;
};


// Helper para generar copy basado en el producto
function getProductCopy(product: {
  title: string;
  category: string;
  description: string;
  features?: string[];
}) {
  const titleLower = product.title.toLowerCase();
  const categoryLower = product.category.toLowerCase();

  // Determinar uso y beneficios según el producto
  let useCase = "";
  let whyBetter = "";
  let idealFor: string[] = [];
  let benefits: string[] = [];

  if (titleLower.includes("gafas") || titleLower.includes("lentes")) {
    useCase =
      "Protegen tus ojos de rayos UV y cambios de luz durante actividades al aire libre. Las lentes fotocromáticas se adaptan automáticamente a la intensidad de la luz, sin necesidad de cambiar de gafas.";
    whyBetter =
      "A diferencia de gafas genéricas, estas se adaptan a las condiciones de luz cambiantes. No necesitás llevar múltiples pares ni cambiarlos constantemente durante tu actividad.";
    idealFor = ["Ciclismo", "Running", "Trekking", "Uso diario outdoor"];
    benefits = [
      "Protección UV400 completa contra rayos solares dañinos",
      "Adaptación automática a cambios de luz (fotocromáticas)",
      "Montura ligera que no pesa durante actividades prolongadas",
      "Almohadillas antideslizantes para mantenerlas en su lugar",
      "Resistente a impactos y caídas accidentales",
    ];
  } else if (titleLower.includes("mochila") || titleLower.includes("backpack")) {
    useCase =
      "Diseñada para cargar tu equipamiento de forma segura y cómoda durante trekking, camping y aventuras de varios días. El material impermeable protege tu contenido incluso en condiciones adversas.";
    whyBetter =
      "A diferencia de mochilas genéricas, esta combina capacidad (45L) con resistencia real al agua. El sistema MOLLE permite personalizar y expandir según tus necesidades específicas.";
    idealFor = ["Trekking", "Camping", "Aventuras de varios días", "Outdoor profesional"];
    benefits = [
      "Capacidad de 45L suficiente para escapadas de 2-4 días",
      "Material impermeable que protege en lluvia y humedad",
      "Sistema MOLLE para agregar bolsillos y accesorios",
      "Resistente a desgarros y uso intenso",
      "Distribución de peso equilibrada para comodidad",
    ];
  } else if (titleLower.includes("smartwatch") || titleLower.includes("watch")) {
    useCase =
      "Rastrea tu actividad física, rutas y métricas de rendimiento durante entrenamientos y aventuras. El GPS integrado te permite navegar y registrar tus recorridos sin depender del celular.";
    whyBetter =
      "A diferencia de smartwatches genéricos, este está pensado para uso outdoor real. La batería de 7 días aguanta escapadas largas sin necesidad de cargar constantemente.";
    idealFor = ["Running", "Ciclismo", "Trekking", "Entrenamientos diarios"];
    benefits = [
      "GPS preciso para rastrear rutas y navegación",
      "Monitor cardíaco continuo durante actividades",
      "Batería de 7 días para escapadas sin preocupaciones",
      "Múltiples modos deportivos para diferentes actividades",
      "Resistente al agua para uso en condiciones adversas",
    ];
  } else {
    // Fallback genérico
    useCase = product.description;
    whyBetter =
      "Diseñado para uso real en condiciones outdoor. Probado en situaciones reales, no solo en laboratorio.";
    idealFor = ["Actividades outdoor", "Uso diario", "Aventuras"];
    benefits = product.features || [];
  }

  return { useCase, whyBetter, idealFor, benefits };
}

export async function generateStaticParams() {
  const products = getProducts();
  return locales.flatMap((locale) =>
    products.map((product) => ({
      locale,
      id: product.id,
    }))
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, id } = await params;
  const product = getProductById(id);

  if (!product) {
    return {
      title: "Producto no encontrado | Go Natural",
    };
  }

  const messages = await getMessages(locale);
  const seo = messages.seo?.product;
  const localized = product.translations?.[locale];
  const localizedTitle = localized?.title || product.title;
  const title =
    localized?.seo?.title ||
    formatTemplate(seo?.titleTemplate || "{title} | Go Natural", {
      title: localizedTitle,
    });
  const description =
    localized?.seo?.description ||
    formatTemplate(
      seo?.descriptionTemplate ||
        "Detalles y especificaciones de {title}, pensado para uso outdoor real.",
      { title: localizedTitle }
    );
  const ogTitle = localized?.seo?.ogTitle || title;
  const ogDescription = localized?.seo?.ogDescription || description;
  const images = await getProductImages(product.id);
  const ogImage =
    images.featured?.[0] || images.gallery?.[0] || "/assets/images/blog/blog-hero.webp";
  const pathByLocale = locales.reduce(
    (acc, localeKey) => ({
      ...acc,
      [localeKey]: `/${localeKey}/products/${product.id}`,
    }),
    {} as Record<Locale, string>
  );

  return {
    ...buildMetadata({
      locale,
      title,
      description,
      pathByLocale,
      ogImage,
      ogTitle,
      ogDescription,
      ogType: "website",
    }),
  };
}

export default async function ProductPage({ params }: Props) {
  const { locale, id } = await params;
  const product = getProductById(id);

  if (!product) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-20">
        <h1 className="text-2xl font-semibold">Producto no encontrado</h1>
      </main>
    );
  }

  const localized = product.translations?.[locale];
  const localizedProduct: Product = {
    ...product,
    title: localized?.title ?? product.title,
    description: localized?.description ?? product.description,
    shortDescription: localized?.shortDescription ?? product.shortDescription,
    longDescription: localized?.longDescription ?? product.longDescription,
    features: localized?.features ?? product.features,
  };

  const { useCase, whyBetter, benefits } = getProductCopy(localizedProduct);
  const messages = await getMessages(locale);
  const t = createTranslator(messages);
  const relatedPosts = pickPostsForProduct(product, messages.blog.posts, 3)
    .map(([slug, post]) => ({
      href: `/${locale}/blog/${slug}`,
      title: post.title || "",
      image:
        post.heroImage ||
        post.sections?.[0]?.image ||
        "/assets/images/blog/blog-hero.webp",
    }))
    .filter((post) => post.title);
  const productImages = await getProductImages(product.id);
  const variantsFromJson = await getProductVariants(product.id);
  const productVariants =
    variantsFromJson ||
    (product.variants
      ? {
          variants: Array.isArray(product.variants)
            ? product.variants
            : [product.variants],
          variantMatrix: undefined,
        }
      : null);
  const productSlug = product.slug ?? product.id;
  const reviews = getReviewsByProductSlug(productSlug);
  const reviewsAverage =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;
  const reviewsSchema =
    reviews.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: localizedProduct.title,
          image: productImages.featured || product.images[0] || "",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: reviewsAverage.toFixed(1),
            reviewCount: reviews.length,
          },
          review: reviews.map((review) => ({
            "@type": "Review",
            reviewRating: {
              "@type": "Rating",
              ratingValue: review.rating,
            },
            author: {
              "@type": "Person",
              name: review.author,
            },
            datePublished: review.date,
            reviewBody: review.comment,
            name: review.title,
          })),
        }
      : null;

  // H1 optimizado para SEO
  const baseSeoTitle = localizedProduct.title;
  const seoH1 =
    locale === "es" && !baseSeoTitle.includes("para")
      ? `${baseSeoTitle} para Outdoor y Aventuras`
      : baseSeoTitle;

  const relatedProducts = getProducts()
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 3);
  const specs = product.features && product.features.length > 0
    ? product.features
    : benefits;

  return (
    <main className="bg-dark-base overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 pt-24 pb-16 md:py-20 max-w-full">
        <ProductDetailClient
          product={localizedProduct}
          seoH1={seoH1}
          productImages={productImages}
          productVariants={productVariants}
          ctaLabel={t("productPage.addToCart")}
          noImageLabel={t("common.noImage")}
          freeShippingLabel={t("productPage.freeShipping")}
        />
      </div>

      <ProductReviews productSlug={productSlug} reviews={REVIEWS_SEED} />
      {reviewsSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
        />
      )}

      <EditorialPostCards
        title={t("productPage.relatedStoriesTitle")}
        posts={relatedPosts}
      />

      {/* Story / uso del producto */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] items-center">
            {productImages.lifestyle.length > 0 && (
              <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src={productImages.lifestyle[0]}
                  alt={`${localizedProduct.title} lifestyle`}
                  fill
                  placeholder="blur"
                  blurDataURL={PRODUCT_BLUR_DATA_URL}
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-dark-base/20 via-dark-base/30 to-dark-base/60" />
              </div>
            )}
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">
                {t("productPage.storyTitle")}
              </h2>
              <p className="mt-5 text-base md:text-lg text-text-muted leading-relaxed">
                {useCase}
              </p>
              <p className="mt-4 text-base md:text-lg text-text-muted leading-relaxed">
                {whyBetter}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specs técnicas */}
      {specs.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">
                {t("productPage.specsTitle")}
              </h2>
              <ul className="mt-6 space-y-3 text-text-muted">
                {specs.map((spec) => (
                  <li key={spec} className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-gold" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {productImages.extras.length > 0 && (
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                {productImages.extras.map((img, index) => (
                  <div
                    key={img}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-dark-surface/40"
                  >
                    <Image
                      src={img}
                      alt={`${localizedProduct.title} detalle técnico ${index + 1}`}
                      width={1200}
                      height={900}
                      placeholder="blur"
                      blurDataURL={PRODUCT_BLUR_DATA_URL}
                      className="h-full w-full object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Cross-sell suave */}
      {relatedProducts.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">
              {t("productPage.crossSellTitle")}
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {relatedProducts.map((item) => (
                <ProductCardSimple
                  key={item.id}
                  product={item}
                  locale={locale}
                  labels={{
                    viewProduct: t("common.viewProduct"),
                    addToCart: t("common.addToCart"),
                    noImage: t("common.noImage"),
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
