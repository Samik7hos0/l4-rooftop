"use client";

import Image from "next/image";

const images = [
  "/gallery/1.jpg",
  "/gallery/2.jpg",
  "/gallery/3.jpg",
  "/gallery/4.jpg",
  "/gallery/5.jpg",
  "/gallery/6.jpg",
];

export default function GalleryPage() {
  return (
    <main className="px-6 md:px-16 py-20 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-14 max-w-2xl">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
          Moments at Level Four
        </h1>
        <p className="mt-3 text-white/50 text-lg">
          Rooftop evenings, crafted plates, and the city after sunset.
        </p>
      </header>

      {/* Gallery Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((src, i) => (
          <div
            key={i}
            className="
              group relative overflow-hidden rounded-2xl
              bg-white/5
              transition
              hover:shadow-2xl
            "
          >
            <Image
              src={src}
              alt="L4 Rooftop Gallery"
              width={800}
              height={600}
              className="
                w-full h-full object-cover
                transition duration-500
                group-hover:scale-[1.04]
              "
              priority={i < 3}
            />
          </div>
        ))}
      </section>
    </main>
  );
}
