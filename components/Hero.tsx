import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-[85vh] flex items-center justify-center text-center px-6 relative">
      <div className="max-w-4xl">
        <p className="uppercase tracking-widest text-sm text-zinc-400 mb-4">
          Rooftop Dining • Dharmanagar
        </p>

        <h1 className="text-5xl md:text-6xl font-bold text-[var(--primary)] mb-6 leading-tight">
          Level Four <br /> Rooftop Restaurant
        </h1>

        <p className="text-zinc-300 text-lg mb-10">
          A premium rooftop experience with curated cuisine, city lights,
          and unforgettable evenings under the open sky.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/reservation"
            className="bg-[var(--primary)] text-black px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-premium"
          >
            Reserve a Table
          </Link>

          <Link
            href="/menu"
            className="border border-zinc-600 px-8 py-4 rounded-lg hover:bg-zinc-800 transition-premium"
          >
            Explore Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
