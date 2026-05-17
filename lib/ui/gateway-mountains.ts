import { GN_EASE_PREMIUM } from "@/lib/ui/gonatural-design";

/** Gateway Go Natural — montañas editoriales (solo estos 5 assets). */
export const GN_GATEWAY_MOUNTAINS = [
  {
    id: "left-1",
    src: "/assets/brand/mountains/left-1.png",
    side: "left" as const,
    top: "18%",
    width: "clamp(100px, 18vw, 220px)",
    staggerIndex: 0,
  },
  {
    id: "left-2",
    src: "/assets/brand/mountains/left-2.png",
    side: "left" as const,
    top: "48%",
    width: "clamp(130px, 22vw, 300px)",
    staggerIndex: 1,
  },
  {
    id: "left-3",
    src: "/assets/brand/mountains/left-3.png",
    side: "left" as const,
    top: "72%",
    width: "clamp(150px, 26vw, 340px)",
    staggerIndex: 2,
  },
  {
    id: "right-1",
    src: "/assets/brand/mountains/right-1.png",
    side: "right" as const,
    top: "32%",
    width: "clamp(120px, 20vw, 260px)",
    staggerIndex: 3,
  },
  {
    id: "right-2",
    src: "/assets/brand/mountains/right-2.png",
    side: "right" as const,
    top: "62%",
    width: "clamp(100px, 16vw, 200px)",
    staggerIndex: 4,
  },
] as const;

export const GN_GATEWAY_MOUNTAIN_EASE = GN_EASE_PREMIUM;
export const GN_GATEWAY_MOUNTAIN_ENTER_S = 1.05;
export const GN_GATEWAY_MOUNTAIN_EXIT_S = 0.45;
export const GN_GATEWAY_MOUNTAIN_STAGGER_S = 0.1;
export const GN_GATEWAY_MOUNTAIN_MOBILE_OPACITY = 0.16;
export const GN_GATEWAY_PARALLAX_MAX_PX = 14;
