export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <section className="max-w-3xl text-center space-y-6">
        <p className="text-sm tracking-widest text-neutral-400 uppercase">
          Rooftop Dining · Dharmanagar
        </p>

        <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
          Level Four <br />
          Rooftop Restaurant
        </h1>

        <p className="text-neutral-400 max-w-xl mx-auto">
          A modern rooftop experience with carefully crafted cuisine, warm
          ambience, and city lights that elevate every evening.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <a
            href="/reservation"
            className="rounded-md bg-amber-500 px-6 py-3 text-sm font-medium text-neutral-900 hover:bg-amber-400 transition-premium"
          >
            Reserve a Table
          </a>

          <a
            href="/menu"
            className="rounded-md border border-neutral-700 px-6 py-3 text-sm font-medium hover:bg-neutral-900 transition-premium"
          >
            Explore Menu
          </a>
        </div>
      </section>
    </main>
  );
}
