"use client";

import Image from "next/image";
import type { MotionValue } from "framer-motion";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const easePremium = [0.22, 1, 0.36, 1] as const;

type Side = "left" | "right";

type MountainConfig = {
  src: string;
  /** Vertical anchor (% of tall decorative column). */
  topPct: number;
  wClass: string;
  /** Max extra translateY (px) at ~900px scroll. */
  parallax: number;
  delay: number;
};

const LEFT_MOUNTAINS: readonly MountainConfig[] = [
  {
    src: "/assets/brand/mountains/left-1.png",
    topPct: 5,
    wClass: "w-[min(24vw,11.5rem)] lg:w-[min(22vw,13rem)]",
    parallax: 18,
    delay: 0.06,
  },
  {
    src: "/assets/brand/mountains/left-2.png",
    topPct: 30,
    wClass: "w-[min(20vw,9.5rem)] lg:w-[min(19vw,11rem)]",
    parallax: 28,
    delay: 0.22,
  },
  {
    src: "/assets/brand/mountains/left-3.png",
    topPct: 56,
    wClass: "w-[min(17vw,8rem)] lg:w-[min(16vw,9.25rem)]",
    parallax: 14,
    delay: 0.38,
  },
];

const RIGHT_MOUNTAINS: readonly MountainConfig[] = [
  {
    src: "/assets/brand/mountains/right-1.png",
    topPct: 8,
    wClass: "w-[min(23vw,11rem)] lg:w-[min(21vw,12.5rem)]",
    parallax: 22,
    delay: 0.12,
  },
  {
    src: "/assets/brand/mountains/right-2.png",
    topPct: 34,
    wClass: "w-[min(19vw,9rem)] lg:w-[min(18vw,10.5rem)]",
    parallax: 32,
    delay: 0.28,
  },
  {
    src: "/assets/brand/mountains/right-3.png",
    topPct: 58,
    wClass: "w-[min(16vw,7.75rem)] lg:w-[min(15vw,8.75rem)]",
    parallax: 16,
    delay: 0.44,
  },
];

function MountainFigure({
  scrollY,
  config,
  side,
  reduceMotion,
}: {
  scrollY: MotionValue<number>;
  config: MountainConfig;
  side: Side;
  reduceMotion: boolean;
}) {
  const fromX = side === "left" ? -80 : 80;
  const translateY = useTransform(scrollY, [0, 900], [0, reduceMotion ? 0 : config.parallax]);

  const positionClass =
    side === "left"
      ? "left-0 items-start pl-0 md:-translate-x-[4%] lg:-translate-x-[2%]"
      : "right-0 items-end pr-0 md:translate-x-[4%] lg:translate-x-[2%]";

  return (
    <motion.div
      className={`pointer-events-none absolute flex ${positionClass}`}
      style={{
        top: `${config.topPct}%`,
        y: translateY,
      }}
      initial={reduceMotion ? false : { opacity: 0, x: fromX }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: config.delay,
        duration: 0.85,
        ease: easePremium,
      }}
    >
      <div
        className={`relative ${config.wClass} opacity-[0.72] md:opacity-[0.78] lg:opacity-[0.92]`}
      >
        <Image
          src={config.src}
          alt=""
          width={360}
          height={420}
          sizes="(min-width: 1024px) 22vw, (min-width: 768px) 24vw, 0px"
          className="h-auto w-full object-contain object-bottom drop-shadow-[0_12px_28px_rgba(17,23,19,0.08)]"
          draggable={false}
          priority={false}
          aria-hidden
        />
      </div>
    </motion.div>
  );
}

/**
 * Decorative mountain silhouettes for the home page only.
 * Add PNGs under `/public/assets/brand/mountains/` (transparent).
 */
export default function MountainSideDecorations() {
  const reduceMotion = useReducedMotion() ?? false;
  const { scrollY } = useScroll();

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 hidden select-none overflow-x-clip md:block"
      aria-hidden
    >
      <div className="relative h-full min-h-[160vh] w-full">
        {LEFT_MOUNTAINS.map((config) => (
          <MountainFigure
            key={config.src}
            scrollY={scrollY}
            config={config}
            side="left"
            reduceMotion={reduceMotion}
          />
        ))}
        {RIGHT_MOUNTAINS.map((config) => (
          <MountainFigure
            key={config.src}
            scrollY={scrollY}
            config={config}
            side="right"
            reduceMotion={reduceMotion}
          />
        ))}
      </div>
    </div>
  );
}
