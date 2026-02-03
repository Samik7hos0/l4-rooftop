"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-black text-white">
      {/* ================= HERO ================= */}
      <section className="min-h-[100vh] flex items-center justify-center px-6">
  <div className="max-w-4xl text-center space-y-8">
    
    <p className="text-sm tracking-widest text-white/50 uppercase motion-fade-up">
      Rooftop Dining • Nightlife • Experiences
    </p>

    <h1 className="text-4xl md:text-6xl font-semibold tracking-tight motion-fade-up motion-delay-1">
      L4 Rooftop
      <br />
      <span className="text-white/60">
        Where evenings feel elevated
      </span>
    </h1>

    <p className="max-w-2xl mx-auto text-lg text-white/70 motion-fade-up motion-delay-2">
      A premium rooftop destination blending cuisine, skyline views,
      curated music, and an atmosphere designed for unforgettable
      nights.
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 motion-fade-up motion-delay-3">
      <Link
        href="/reservation"
        className="px-8 py-3 rounded-full font-medium transition-premium cta-primary"
      >
        Reserve a Table
      </Link>

      <Link
        href="/menu"
        className="px-8 py-3 rounded-full border border-white/20 text-white transition-premium cta-secondary"
      >
        View Menu
      </Link>
    </div>

  </div>
</section>


      {/* ================= EXPERIENCE ================= */}
      <section className="py-28 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Crafted for nights that matter
            </h2>

            <p className="text-white/65 text-lg">
              L4 Rooftop is more than a restaurant. It’s a space designed
              for connection — from intimate dinners to lively group
              celebrations.
            </p>

            <ul className="space-y-3 text-white/65">
              <li>• Curated rooftop ambience</li>
              <li>• Signature cocktails & global cuisine</li>
              <li>• Live DJ & themed nights</li>
              <li>• Skyline views after sunset</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white/[0.035] border border-white/10 p-10 space-y-6">
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wide">
                Timings
              </p>
              <p className="text-lg">5:30 PM – 12:30 AM</p>
            </div>

            <div>
              <p className="text-xs text-white/50 uppercase tracking-wide">
                Best For
              </p>
              <p className="text-lg">
                Dates • Groups • Birthdays • Corporate evenings
              </p>
            </div>

            <div>
              <p className="text-xs text-white/50 uppercase tracking-wide">
                Location
              </p>
              <p className="text-lg">
                Rooftop Level, L4 Building
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY L4 ================= */}
      <section className="py-28 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Why guests choose L4
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Every detail is intentional — from lighting to music to
              service.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Atmosphere",
                desc: "Minimal, modern, and warm — designed for comfort and style.",
              },
              {
                title: "Hospitality",
                desc: "Thoughtful service that respects your time and privacy.",
              },
              {
                title: "Consistency",
                desc: "Reliable quality across food, drinks, and experiences.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-white/[0.035] border border-white/10 p-8 space-y-3"
              >
                <h3 className="text-xl font-medium">{item.title}</h3>
                <p className="text-white/65">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Ready for your next evening out?
          </h2>

          <p className="text-white/65 text-lg">
            Tables fill quickly on peak nights. Reserve in advance to
            ensure the perfect experience.
          </p>

          <Link
            href="/reservation"
            className="
              inline-flex items-center justify-center
              px-10 py-4 rounded-full
              bg-white/10 text-white font-medium
              border border-white/15
              hover:bg-white/15
              transition-premium
            "
          >
            Book Your Table
          </Link>
        </div>
      </section>
    </main>
  );
}
