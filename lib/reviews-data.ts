export type ReviewSeed = {
  id: string;
  productSlug: string;
  rating: 1 | 2 | 3 | 4 | 5;
  author: string;
  title?: string;
  comment: string;
  date: string;
  verified: boolean;
};

export const REVIEWS_SEED: ReviewSeed[] = [
  {
    id: "review-gn-outdoor-shoes-002-01",
    productSlug: "gn-outdoor-shoes-002",
    rating: 5,
    author: "M. R.",
    title: "Comodidad real en caminatas largas",
    comment:
      "Las usé en trekking de 18 km y el soporte se mantuvo estable todo el día. Buen agarre y cero molestias.",
    date: "2024-02-18",
    verified: true,
  },
  {
    id: "review-gn-outdoor-shoes-002-02",
    productSlug: "gn-outdoor-shoes-002",
    rating: 4,
    author: "Anónimo",
    comment:
      "Se sienten firmes y livianas. En terreno mixto van muy bien, solo tardaron un poco en amoldarse.",
    date: "2024-03-04",
    verified: false,
  },
  {
    id: "review-gn-fishing-001-01",
    productSlug: "gn-fishing-001",
    rating: 5,
    author: "S. G.",
    title: "Ligera y sensible",
    comment:
      "Muy buena sensibilidad para pesca tranquila. Se arma rápido y es cómoda para transportar.",
    date: "2024-01-22",
    verified: true,
  },
  {
    id: "review-gn-fishing-001-02",
    productSlug: "gn-fishing-001",
    rating: 4,
    author: "N. P.",
    comment:
      "Buena relación precio-calidad. La usé en salidas cortas y respondió bien.",
    date: "2024-02-10",
    verified: false,
  },
  {
    id: "review-gn-ski-snow-002-01",
    productSlug: "gn-ski-snow-002",
    rating: 5,
    author: "L. B.",
    title: "Abrigo parejo",
    comment:
      "Abriga sin sentirse pesada. Buena para días fríos con viento.",
    date: "2024-02-28",
    verified: true,
  },
  {
    id: "review-gn-ski-snow-002-02",
    productSlug: "gn-ski-snow-002",
    rating: 4,
    author: "R. M.",
    comment:
      "Cómoda en movimiento y bien terminada. La capucha suma mucho.",
    date: "2024-03-15",
    verified: false,
  },
  {
    id: "review-gn-water-001-01",
    productSlug: "gn-water-001",
    rating: 5,
    author: "P. D.",
    title: "Visión amplia y cómoda",
    comment:
      "Se siente estable y no se empañó en uso normal. Muy buena visibilidad.",
    date: "2024-01-30",
    verified: true,
  },
  {
    id: "review-gn-water-001-02",
    productSlug: "gn-water-001",
    rating: 4,
    author: "Anónimo",
    comment:
      "Buena para uso recreativo. El ajuste es firme y no entra agua.",
    date: "2024-02-19",
    verified: false,
  },
  {
    id: "review-gn-cycling-011-01",
    productSlug: "gn-cycling-011",
    rating: 5,
    author: "C. V.",
    title: "Buen soporte en ruta",
    comment:
      "Se mantienen estables en salidas largas. Buen balance entre rigidez y comodidad.",
    date: "2024-03-08",
    verified: true,
  },
  {
    id: "review-gn-cycling-011-02",
    productSlug: "gn-cycling-011",
    rating: 4,
    author: "J. T.",
    comment:
      "Materiales sólidos y ajuste confiable. Buena opción para entrenos tranquilos.",
    date: "2024-03-27",
    verified: false,
  },
];

export function getReviewsByProductSlug(productSlug: string): ReviewSeed[] {
  return REVIEWS_SEED.filter((review) => review.productSlug === productSlug);
}

