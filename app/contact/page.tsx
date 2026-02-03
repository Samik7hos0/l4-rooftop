"use client";

export default function ContactPage() {
  return (
    <main className="px-6 md:px-16 py-20 max-w-6xl mx-auto">
      {/* HEADER */}
      <header className="mb-16 max-w-2xl">
        <h1 className="motion text-3xl md:text-5xl font-semibold tracking-tight">
          Get in touch
        </h1>
        <p className="motion motion-1 mt-3 text-white/50 text-lg">
          We’re happy to help with reservations, events, and private dining.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-16">
        {/* INFO */}
        <div className="motion motion-2 space-y-8 text-white/80">
          <Info label="Address">
            Level Four Rooftop Restaurant<br />
            Dharmanagar, Tripura
          </Info>

          <Info label="Phone">+91 9XXXXXXXXX</Info>
          <Info label="Hours">12:00 PM – 11:00 PM</Info>

          <a
            href="https://maps.app.goo.gl/7aKrNH3rgTmbieEx8"
            target="_blank"
            className="inline-block underline underline-offset-4 hover:opacity-80 transition-premium"
          >
            View on Google Maps
          </a>
        </div>

        {/* FORM */}
        <form className="motion motion-3 card-premium p-6 md:p-8 space-y-5">
          <input placeholder="Your name" className="premium-input" required />
          <input placeholder="Email address" className="premium-input" required />
          <textarea
            rows={4}
            placeholder="Your message"
            className="premium-input resize-none"
            required
          />
          <button className="btn-primary w-full min-h-[48px] rounded-xl font-semibold">
            Send message
          </button>
        </form>
      </section>
    </main>
  );
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm uppercase text-white/40 mb-1">{label}</h3>
      <p>{children}</p>
    </div>
  );
}
