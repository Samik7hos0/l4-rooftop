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
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-4xl text-center mb-6 text-[var(--primary)]">
        Gallery
      </h1>

      <p className="text-center text-zinc-400 mb-10">
        A glimpse of our rooftop ambience and signature dishes
      </p>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-12">
        {["ambience", "food"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`px-6 py-2 rounded-full border transition-premium ${
              tab === t
                ? "bg-[var(--primary)] text-black border-transparent"
                : "border-zinc-600 text-zinc-300 hover:border-zinc-500"
            }`}
          >
            {t === "ambience" ? "🌆 Ambience" : "🍽️ Food"}
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
          className="inline-block bg-[var(--primary)] text-black px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-premium"
        >
          Reserve a Table
        </a>
      </div>
    </section>
  );
}
