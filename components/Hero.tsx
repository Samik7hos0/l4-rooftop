import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="min-h-[85vh] flex items-center justify-center text-center px-[var(--space-page-x)] py-16 sm:py-20"
      aria-label="Hero"
    >
      <div className="max-w-4xl mx-auto">
        <p className="uppercase tracking-[0.2em] text-xs sm:text-sm text-neutral-500 mb-4 sm:mb-5">
          Rooftop Dining · Dharmanagar
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-[var(--primary)] mb-5 sm:mb-6 leading-[1.1] tracking-tight">
          Level Four <br className="sm:hidden" />
          <span className="sm:inline"> </span>
          Rooftop Restaurant
        </h1>

        <p className="text-neutral-400 text-base sm:text-lg max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed">
          A premium rooftop experience with curated cuisine, city lights,
          and unforgettable evenings under the open sky.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Link
            href="/reservation"
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center bg-[var(--primary)] text-[var(--primary-foreground)] px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-semibold hover:opacity-90 transition-premium focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Reserve a Table
          </Link>
          <Link
            href="/menu"
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center border border-neutral-600 px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg hover:bg-neutral-800/80 transition-premium focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Explore Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
