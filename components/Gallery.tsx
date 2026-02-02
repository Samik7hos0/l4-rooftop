"use client";

import { useState } from "react";
import Image from "next/image";

const AMBIENCE = [
  "/gallery/ambience/a1.jpg",
  "/gallery/ambience/a2.jpg",
  "/gallery/ambience/a3.jpg",
];

const FOOD = [
  "/gallery/food/f1.jpg",
  "/gallery/food/f2.jpg",
  "/gallery/food/f3.jpg",
];

export default function Gallery() {
  const [tab, setTab] = useState<"ambience" | "food">("ambience");

  const images = tab === "ambience" ? AMBIENCE : FOOD;

  return (
    <section className="max-w-7xl mx-auto px-[var(--space-page-x)] py-12 sm:py-16 lg:py-20">
      <header className="text-center mb-10 lg:mb-12">
        <h1 className="text-3xl sm:text-4xl font-semibold text-[var(--primary)] tracking-tight">
          Gallery
        </h1>
        <p className="mt-2 text-neutral-500 text-sm sm:text-base">
          A glimpse of our rooftop ambience and signature dishes
        </p>
      </header>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-12">
        {(["ambience", "food"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={`min-h-[44px] px-6 py-2.5 rounded-full border transition-premium focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
              tab === t
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-transparent"
                : "border-neutral-600 text-neutral-400 hover:border-neutral-500 hover:text-neutral-300"
            }`}
          >
            {t === "ambience" ? "Ambience" : "Food"}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((src, i) => (
          <div
            key={i}
            className="relative group overflow-hidden rounded-xl border border-zinc-800"
          >
            <Image
              src={src}
              alt="Gallery image"
              width={500}
              height={500}
              className="object-cover w-full h-full group-hover:scale-105 transition-premium duration-500"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-premium duration-300" />
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <a
          href="/reservation"
          className="inline-flex items-center justify-center min-h-[48px] px-8 py-4 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold hover:opacity-90 transition-premium focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          Reserve a Table
        </a>
      </div>
    </section>
  );
}
