"use client";

import { motion } from "framer-motion";
import { GN_EASE_PREMIUM } from "@/lib/ui/gonatural-design";
import { GATEWAY_HERO_CONTENT_CLASS } from "@/lib/ui/gateway-hero";

const PANEL_EASE = GN_EASE_PREMIUM;

export type BrandHeroContentProps = {
  children: React.ReactNode;
  isActive: boolean;
  className?: string;
};

/**
 * HeroContent: flex column centrado con un solo gap (24px) entre todos los hijos.
 */
export default function BrandHeroContent({
  children,
  isActive,
  className = "",
}: BrandHeroContentProps) {
  return (
    <motion.div
      className={`relative z-20 w-full ${GATEWAY_HERO_CONTENT_CLASS} ${className}`.trim()}
      initial={false}
      animate={{ opacity: isActive ? 1 : 0.92 }}
      transition={{ duration: 0.6, ease: PANEL_EASE }}
    >
      {children}
    </motion.div>
  );
}
