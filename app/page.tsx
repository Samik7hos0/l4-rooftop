import Hero from "@/components/Hero";
import StructuredData from "@/components/StructuredData";

export default function Home() {
  return (
    <>
      <StructuredData />

      <main>
        <Hero />

        <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8">
          {[
            {
              title: "🌆 Rooftop Ambience",
              desc: "Open-sky seating with city views and evening lights.",
            },
            {
              title: "🪑 Limited Seating",
              desc: "Controlled capacity for comfort & exclusivity.",
            },
            {
              title: "📍 Prime Location",
              desc: "Power House Quarter Complex, Dharmanagar.",
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
      </main>
    </>
  );
}
