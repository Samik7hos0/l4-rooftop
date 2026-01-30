import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 min-h-[80vh] grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-sm tracking-widest text-zinc-500 mb-4">
            ROOFTOP DINING • DHARMANAGAR
          </p>

          <h1 className="text-4xl md:text-6xl font-semibold leading-tight mb-6">
            Level Four <br /> Rooftop Restaurant
          </h1>

          <p className="text-zinc-600 max-w-md mb-10">
            A premium rooftop experience with curated cuisine, city lights,
            and unforgettable evenings under the open sky.
          </p>

          <div className="flex gap-4">
            <Link href="/reservation" className="btn-primary">
              Reserve a Table
            </Link>
            <Link href="/menu" className="btn-outline">
              Explore Menu
            </Link>
          </div>
        </div>

        {/* Visual placeholder */}
        <div className="aspect-[4/5] rounded-3xl bg-zinc-200 flex items-center justify-center text-zinc-500">
          Ambience / Food Image
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-3 gap-12 text-center">
        <Feature
          title="Rooftop Ambience"
          desc="Open-sky seating with city views and refined evening vibes."
        />
        <Feature
          title="Limited Seating"
          desc="Curated capacity for comfort, privacy, and exclusivity."
        />
        <Feature
          title="Prime Location"
          desc="Power House Quarter Complex, Dharmanagar."
        />
      </section>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <p className="text-zinc-600 text-sm">{desc}</p>
    </div>
  );
}
