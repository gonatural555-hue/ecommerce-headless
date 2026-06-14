"use client";

import BentoHeroSection from "@/components/home/BentoHeroSection";
import type { HomeHeroCarouselProps } from "@/components/home/HomeHeroCarousel";

export default function BlogHero(props: HomeHeroCarouselProps) {
  return <BentoHeroSection {...props} flushAfterEditorialHero />;
}
