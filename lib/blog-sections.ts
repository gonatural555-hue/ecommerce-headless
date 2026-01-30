export type BlogSubtopic = {
  label: string;
  slug: string;
};

export type BlogSection = {
  title: string;
  slug: string;
  image: string;
  seoTitle: string;
  description: string;
  manifesto: string[];
  subtopics: BlogSubtopic[];
  postSlugs?: string[];
  relatedProductIds: string[];
};

export const blogSections: BlogSection[] = [
  {
    title: "Salir sin complicarse",
    slug: "outdoor-facil",
    image: "/assets/images/blog/banner01.webp",
    seoTitle:
      "Outdoor fácil: trekking, camping, pesca y snorkel para todos",
    description:
      "Ideas y experiencias outdoor simples: trekking fácil, camping de fin de semana, pesca recreativa y snorkel para todos los niveles.",
    manifesto: [
      "Salir a la naturaleza no debería sentirse como una prueba.",
      "No todo el mundo busca exigirse ni superarse cada vez que sale.",
      "",
      "A veces alcanza con caminar un rato, armar una carpa simple o tirar una línea al agua.",
      "No hace falta experiencia, ni equipo caro, ni saberlo todo.",
      "",
      "Esta sección es para eso:",
      "para salidas tranquilas, planes simples y actividades que se adaptan a la vida real.",
      "",
      "Porque estar afuera también puede ser fácil.",
    ],
    subtopics: [
      { label: "Trekking fácil", slug: "trekking-facil" },
      { label: "Camping de fin de semana", slug: "camping-fin-de-semana" },
      { label: "Pesca recreativa", slug: "pesca-recreativa" },
      { label: "Snorkel y diving en familia", slug: "snorkel-diving-familia" },
      { label: "Actividades tranquilas", slug: "actividades-tranquilas" },
    ],
    postSlugs: [
      "salir-sin-complicarse",
      "trekking-facil-espana",
      "trekking-facil-francia",
      "trekking-facil-italia",
      "camping-fin-de-semana-basico",
      "camping-fin-de-semana-relax",
      "no-mires-para-arriba",
      "apps-camping-fin-de-semana",
      "pesca-recreativa-apps-equipo",
      "snorkel-diving-familia-europa",
      "snorkel-familia-equipo-errores"
    ],
    relatedProductIds: [],
  },
  {
    title: "Un poco más allá",
    slug: "outdoor-intermedio",
    image: "/assets/images/blog/banner02.webp",
    seoTitle: 
      "Actividades outdoor intermedias: ski, snowboard, trekking y camping",
    description:
      "Actividades outdoor para quienes quieren ir un poco más allá: ski en centros, trekking largo, camping y deportes intermedios.",
    manifesto: [
      "Cuando ya saliste varias veces, empiezan a cambiar las preguntas.",
      "Cuántos días. Qué clima. Qué llevar.",
      "",
      "Acá no hablamos de extremos, sino de planificación.",
      "De actividades que requieren un poco más de tiempo, energía y atención.",
      "",
      "Ski, trekking largo, camping de varios días.",
      "Nada imposible, pero tampoco improvisado.",
      "",
      "Esta sección es para quienes quieren avanzar un paso más, sin ir al límite.",
    ],
    subtopics: [
      { label: "Ski y snowboard en centros", slug: "ski-snowboard-centros" },
      { label: "Trekking de varios días", slug: "trekking-varios-dias" },
      { label: "Camping prolongado", slug: "camping-prolongado" },
      { label: "Ciclismo y bikepacking", slug: "ciclismo-bikepacking" },
      { label: "Actividades intermedias", slug: "actividades-intermedias" },
    ],
    relatedProductIds: [],
  },
  {
    title: "Ir en serio",
    slug: "outdoor-extremo",
    image: "/assets/images/blog/banner03.webp",
    seoTitle:
      "Deportes outdoor extremos: fuera de pista, escalada y buceo avanzado",
    description:
      "Contenidos sobre actividades outdoor extremas: fuera de pista, escalada, buceo avanzado y expediciones, con enfoque realista y responsable.",
    manifesto: [
      "Hay actividades donde el error pesa.",
      "Donde la experiencia importa y el respeto por el entorno es clave.",
      "",
      "Fuera de pista, escalada, buceo avanzado.",
      "No son juegos, ni deberían presentarse como tales.",
      "",
      "Esta sección no glorifica el riesgo.",
      "Habla de preparación, decisiones y límites.",
      "",
      "Porque ir en serio también es saber cuándo no ir.",
    ],
    subtopics: [
      { label: "Fuera de pista", slug: "fuera-de-pista" },
      { label: "Escalada y climbing", slug: "escalada-climbing" },
      { label: "Buceo avanzado", slug: "buceo-avanzado" },
      { label: "Expediciones", slug: "expediciones" },
      { label: "Actividades extremas", slug: "actividades-extremas" },
    ],
    relatedProductIds: [],
  },
  {
    title: "Equipo & decisiones",
    slug: "equipo-outdoor",
    image: "/assets/images/blog/banner04.webp",
    seoTitle: "Equipamiento outdoor: comparativas reales y decisiones de compra",
    description:
      "Comparativas honestas de equipamiento outdoor, precio vs calidad, gafas deportivas y decisiones de compra reales.",
    manifesto: [
      "El equipo no te hace mejor, pero puede hacerte pasarla peor.",
      "Y muchas veces, lo más caro no es lo más adecuado.",
      "",
      "Acá hablamos de materiales, precios y decisiones reales.",
      "Sin fanatismos por marcas ni discursos vacíos.",
      "",
      "Comparar, entender y elegir mejor.",
      "Nada más, nada menos.",
    ],
    subtopics: [
      { label: "Gafas deportivas", slug: "gafas-deportivas" },
      { label: "Gafas ski & snow", slug: "gafas-ski-snow" },
      { label: "Precio vs calidad", slug: "precio-vs-calidad" },
      { label: "Qué mirar antes de comprar", slug: "que-mirar-antes-de-comprar" },
    ],
    relatedProductIds: [],
  },
];

