import type { ReviewSeed } from "@/lib/reviews-data";

type ProductReviewsProps = {
  productSlug: string;
  reviews: ReviewSeed[];
};

function getAverageRating(reviews: ReviewSeed[]) {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((acc, review) => acc + review.rating, 0);
  return total / reviews.length;
}

function renderStars(rating: number) {
  const rounded = Math.round(rating);
  return Array.from({ length: 5 }).map((_, index) => {
    const isFilled = index < rounded;
    return (
      <svg
        key={`star-${index}`}
        viewBox="0 0 20 20"
        className={`h-4 w-4 ${isFilled ? "text-accent-gold" : "text-white/20"}`}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.157c.969 0 1.371 1.24.588 1.81l-3.363 2.444a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.538 1.118l-3.364-2.444a1 1 0 00-1.175 0l-3.364 2.444c-.783.57-1.838-.197-1.538-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.03 9.382c-.783-.57-.38-1.81.588-1.81h4.157a1 1 0 00.95-.69l1.286-3.955z" />
      </svg>
    );
  });
}

export default function ProductReviews({
  productSlug,
  reviews,
}: ProductReviewsProps) {
  const productReviews = reviews.filter(
    (review) => review.productSlug === productSlug
  );
  const average = getAverageRating(productReviews);
  const averageLabel = average.toFixed(1);

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">
          Customer reviews
        </h2>

        {productReviews.length === 0 ? (
          <p className="mt-3 text-sm text-text-muted">
            This product does not have published reviews yet
          </p>
        ) : (
          <>
            <div className="mt-3 flex items-center gap-3 text-sm text-text-muted">
              <div className="flex items-center gap-1">
                {renderStars(average)}
              </div>
              <span className="text-text-primary">{averageLabel}</span>
              <span aria-hidden="true">•</span>
              <span>{productReviews.length} reviews</span>
            </div>

            <div className="mt-8 space-y-4">
              {productReviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-2xl border border-white/10 bg-dark-surface/30 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-xs text-text-muted">{review.date}</span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-text-primary">
                    {review.author}
                  </p>
                  {review.title && (
                    <p className="mt-1 text-sm text-text-primary">
                      {review.title}
                    </p>
                  )}
                  <p className="mt-3 text-sm text-text-muted leading-relaxed">
                    {review.comment}
                  </p>
                  {review.verified && (
                    <span className="mt-4 inline-flex rounded-full border border-white/10 px-3 py-1 text-xs text-text-muted">
                      Verified purchase
                    </span>
                  )}
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

