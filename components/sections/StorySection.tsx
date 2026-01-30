"use client";

import { useEffect, useRef, useState } from "react";

type StorySectionProps = {
  title: string;
  lines: string[];
};

export default function StorySection({ title, lines }: StorySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-dark-base py-24 md:py-32">
      <div
        ref={sectionRef}
        className={`max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 story-fade ${
          isVisible ? "story-visible" : ""
        }`}
      >
        <div className="grid gap-12 md:gap-16 md:grid-cols-[3fr_2fr] items-center">
          <div className="relative overflow-hidden rounded-2xl min-h-[320px] md:min-h-[520px]">
            <img
              src="/assets/images/hero/storysection.webp"
              alt="Exploration in nature"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-dark-base/30 via-dark-base/40 to-dark-base/70" />
          </div>
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary">
              {title}
            </h2>
            <p className="mt-6 text-lg text-text-muted leading-relaxed">
              {lines.map((line, index) => (
                <span key={line}>
                  {line}
                  {index < lines.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

