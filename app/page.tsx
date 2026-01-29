import Hero from "@/components/Hero";
import StructuredData from "@/components/StructuredData";
import GoogleReviews from "@/components/GoogleReviews";

export default function Home() {
  return (
    <>
      {/* SEO Structured Data */}
      <StructuredData />

      <main>
        {/* HERO SECTION */}
        <Hero />

        {/* TRUST SIGNALS */}
        <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8">
          {[
            {
              title: "🌆 Rooftop Ambience",
              desc: "Open-sky seating with city views and a premium evening vibe.",
            },
            {
              title: "🪑 Limited Seating",
              desc: "Controlled capacity for comfort, privacy, and exclusivity.",
            },
            {
              title: "📍 Prime Location",
              desc: "Located at Power House Quarter Complex, Dharmanagar.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-xl"
            >
              <h3 className="text-xl mb-2 text-[var(--primary)]">
                {item.title}
              </h3>
              <p className="text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* WHY L4 */}
        <section className="bg-zinc-900/40 py-20">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-4xl mb-6 text-[var(--primary)]">
              Why Choose L4?
            </h2>

            <p className="text-zinc-300 mb-12">
              Designed for dates, celebrations, and relaxed evenings —
              L4 blends taste, ambience, and service into one elevated experience.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                "Curated multi-cuisine menu",
                "Rooftop dining under the open sky",
                "Professional table management",
              ].map((text) => (
                <div
                  key={text}
                  className="border border-zinc-800 p-6 rounded-xl"
                >
                  <p className="text-zinc-300">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GOOGLE REVIEWS SECTION */}
        <GoogleReviews />
      </main>
    </>
  );
}
