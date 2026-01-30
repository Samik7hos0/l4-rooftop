"use client";

export default function GoogleReviews() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-10 text-center">
        <h2 className="text-3xl font-semibold text-[var(--primary)] mb-4">
          ⭐ Trusted by Our Guests
        </h2>

        <p className="text-zinc-300 mb-6">
          Rated <strong>{rating}★</strong> on Google by{" "}
          <strong>{count}+ guests</strong>
        </p>

        {/* Stars */}
        <div className="flex justify-center gap-1 mb-8 text-yellow-400 text-2xl">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>
              {i < roundedRating ? "★" : "☆"}
            </span>
          ))}
        </div>

        {/* Featured Reviews */}
        <div className="grid md:grid-cols-3 gap-6 text-left mb-10">
          {[
            {
              name: "Amit Sarkar",
              text: "Amazing rooftop ambience and delicious food. Perfect place for evenings.",
            },
            {
              name: "Riya Das",
              text: "Loved the vibe and service. One of the best rooftop restaurants here.",
            },
            {
              name: "Rahul Maity",
              text: "Great view, great food, great experience. Highly recommended!",
            },
          ].map((review) => (
            <div
              key={review.name}
              className="bg-black/40 border border-zinc-800 rounded-xl p-5"
            >
              <p className="text-sm text-zinc-300 mb-3">
                “{review.text}”
              </p>
              <p className="text-xs text-zinc-400">
                — {review.name}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href={reviewURL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[var(--primary)] text-black px-7 py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Rate Us on Google 🌟
        </a>
      </div>
    </section>
  );
}
