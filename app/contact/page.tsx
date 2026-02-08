"use client";

export default function ContactPage() {
  return (
    <main className="relative px-6 md:px-16 py-24 max-w-7xl mx-auto">
      {/* HEADER */}
      <header className="mb-20 max-w-3xl">
        <h1 className="motion text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
          Let’s talk
        </h1>
        <p className="motion motion-1 mt-5 text-white/60 text-lg md:text-xl">
          Reservations, private events, or just a question — we’ll get back to you shortly.
        </p>
      </header>

      {/* CONTENT */}
      <section className="grid lg:grid-cols-2 gap-20 items-start">
        {/* LEFT: INFO */}
        <div className="motion motion-2 space-y-12">
          <Info label="Visit us">
            Level Four Rooftop Restaurant
            <br />
            Dharmanagar, Tripura
          </Info>

          <Info label="Call">
            <a
              href="tel:+919XXXXXXXXX"
              className="hover:opacity-80 transition-premium"
            >
              +91 9XXXXXXXXX
            </a>
          </Info>

          <Info label="Hours">
            12:00 PM – 11:00 PM
          </Info>

          <a
            href="https://maps.app.goo.gl/7aKrNH3rgTmbieEx8"
            target="_blank"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-premium underline underline-offset-4"
          >
            Open in Google Maps →
          </a>
        </div>

        {/* RIGHT: FORM */}
        <div className="motion motion-3">
          <div className="card-premium p-6 md:p-10">
            <h2 className="text-xl font-semibold mb-6">
              Send us a message
            </h2>

            <form className="space-y-6">
              <Field label="Name">
                <input
                  type="text"
                  placeholder="Your full name"
                  className="premium-input"
                  required
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="premium-input"
                  required
                />
              </Field>

              <Field label="Message">
                <textarea
                  rows={4}
                  placeholder="Tell us how we can help"
                  className="premium-input resize-none"
                  required
                />
              </Field>

              <button
                type="submit"
                className="btn-primary w-full min-h-[52px] rounded-xl font-semibold text-base tracking-wide"
              >
                Send message
              </button>

              <p className="text-xs text-white/40 text-center">
                We usually reply within a few hours.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---------- COMPONENTS ---------- */

function Info({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-widest text-white/40 mb-2">
        {label}
      </h3>
      <p className="text-lg text-white/80 leading-relaxed">
        {children}
      </p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-white/50">{label}</span>
      {children}
    </label>
  );
}
