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
  // gn-cycling-training-001 — media semilla ~4.9 (9×5 + 1×4)
  {
    id: "review-gn-cycling-training-001-01",
    productSlug: "gn-cycling-training-001",
    rating: 5,
    author: "M. A.",
    title: "Estable en intervalos",
    comment:
      "Muy sólido cuando subo la cadencia. La sensación de pedaleo es homogénea y el ruido es contenido.",
    date: "2024-11-02",
    verified: true,
  },
  {
    id: "review-gn-cycling-training-001-02",
    productSlug: "gn-cycling-training-001",
    rating: 5,
    author: "L. F.",
    comment:
      "Llevo semanas con sesiones estructuradas; los datos de potencia me sirven para seguir el plan sin salir.",
    date: "2024-11-18",
    verified: true,
  },
  {
    id: "review-gn-cycling-training-001-03",
    productSlug: "gn-cycling-training-001",
    rating: 5,
    author: "R. C.",
    title: "Buena inversión para invierno",
    comment:
      "Montaje claro y base estable. En sprints noto que la bici no baila.",
    date: "2024-12-05",
    verified: false,
  },
  {
    id: "review-gn-cycling-training-001-04",
    productSlug: "gn-cycling-training-001",
    rating: 5,
    author: "P. S.",
    comment:
      "Uso en piso y no molesta a los vecinos. La asa ayuda mucho a guardarlo.",
    date: "2024-12-14",
    verified: true,
  },
  {
    id: "review-gn-cycling-training-001-05",
    productSlug: "gn-cycling-training-001",
    rating: 4,
    author: "Anónimo",
    comment:
      "Muy buen feeling general; solo tuve que ajustar detalles del cassette al montar la bici de carretera.",
    date: "2025-01-08",
    verified: false,
  },
  {
    id: "review-gn-cycling-training-001-06",
    productSlug: "gn-cycling-training-001",
    rating: 5,
    author: "D. V.",
    title: "Conecta sin drama",
    comment:
      "En casa lo enlacé con mi app habitual en pocos minutos. Entrenos largos sin vibraciones raras.",
    date: "2025-01-22",
    verified: true,
  },
  {
    id: "review-gn-cycling-training-001-07",
    productSlug: "gn-cycling-training-001",
    rating: 5,
    author: "E. N.",
    comment:
      "Para MTB el agarre es firme. Recomendable si buscas calidad de pedaleo y no solo un rodillo barato.",
    date: "2025-02-03",
    verified: false,
  },
  {
    id: "review-gn-cycling-training-001-08",
    productSlug: "gn-cycling-training-001",
    rating: 5,
    author: "I. K.",
    comment:
      "Llevo años en rodillo; este se nota más silencioso y estable que mi equipo anterior.",
    date: "2025-02-19",
    verified: true,
  },
  {
    id: "review-gn-cycling-training-001-09",
    productSlug: "gn-cycling-training-001",
    rating: 5,
    author: "H. M.",
    title: "Potencia coherente",
    comment:
      "Los bloques de umbral me salen más parejos porque la lectura responde bien al cambio de ritmo.",
    date: "2025-03-01",
    verified: true,
  },
  {
    id: "review-gn-cycling-training-001-10",
    productSlug: "gn-cycling-training-001",
    rating: 5,
    author: "G. T.",
    comment:
      "Embalaje serio y acabado cuidado. Para entrenar en salón cumple sin parecer un juguete.",
    date: "2025-03-12",
    verified: false,
  },
];

export function getReviewsByProductSlug(productSlug: string): ReviewSeed[] {
  return REVIEWS_SEED.filter((review) => review.productSlug === productSlug);
}

