"use client";

export default function MapSection() {
  return (
    <section className="py-20 px-6 bg-neutral-900">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Find Us on Google Maps
          </h2>

          <p className="text-neutral-400 mb-6">
            Level Four Rooftop Restaurant, Dharmanagar
          </p>

          <a
            href="https://maps.app.goo.gl/5KvFyZHomBySzyPW8"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-amber-500 px-6 py-3 text-sm text-neutral-900 hover:bg-amber-400 transition-premium"
          >
            Get Directions
          </a>
        </div>

        <iframe
          className="w-full h-[300px] rounded-lg border border-neutral-800"
          loading="lazy"
          src="https://www.google.com/maps?q=Level%20Four%20Rooftop%20Restaurant&output=embed"
        />
      </div>
    </section>
  );
}
