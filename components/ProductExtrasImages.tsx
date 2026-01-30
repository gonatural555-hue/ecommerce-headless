"use client";

import { useState } from "react";

type Props = {
  images: string[];
  title: string;
};

export default function ProductExtrasImages({ images, title }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  if (images.length === 0) return null;

  return (
    <section className="mt-16">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left mb-4"
      >
        <h2 className="text-2xl font-bold text-gray-900">Technical Details</h2>
        <svg
          className={`w-6 h-6 text-gray-600 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((img, index) => (
            <div
              key={img}
              className="bg-gray-100 rounded-lg overflow-hidden"
            >
              <img
                src={img}
                alt={`${title} - Detalle técnico ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

