"use client";

export default function GoogleReviews() {
  return (
    <section className="py-20 px-6 bg-neutral-950 text-center">
      <h2 className="text-2xl font-semibold mb-4">
        ⭐ Rated Highly on Google
      </h2>

      <p className="text-neutral-400 mb-6">
        Loved by guests for ambience, service, and rooftop experience.
      </p>

      <a
        href="https://maps.app.goo.gl/5KvFyZHomBySzyPW8"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-md border border-neutral-700 px-6 py-3 text-sm hover:bg-neutral-900 transition-premium"
      >
        View & Write Reviews on Google
      </a>
    </section>
  );
}
