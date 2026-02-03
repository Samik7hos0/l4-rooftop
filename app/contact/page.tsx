"use client";

export default function ContactPage() {
  return (
    <main className="px-6 md:px-16 py-20 max-w-6xl mx-auto">
      <header className="mb-16 max-w-2xl">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
          Get in touch
        </h1>
        <p className="mt-3 text-white/50 text-lg">
          We’re happy to help with reservations, events, and private dining.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-16">
        {/* INFO */}
        <div className="space-y-8 text-white/80">
          <div>
            <h3 className="text-sm uppercase text-white/40 mb-1">
              Address
            </h3>
            <p>
              Level Four Rooftop Restaurant<br />
              Dharmanagar, Tripura
            </p>
          </div>

          <div>
            <h3 className="text-sm uppercase text-white/40 mb-1">
              Phone
            </h3>
            <p>+91 9XXXXXXXXX</p>
          </div>

          <div>
            <h3 className="text-sm uppercase text-white/40 mb-1">
              Hours
            </h3>
            <p>12:00 PM – 11:00 PM</p>
          </div>

          <a
            href="https://maps.app.goo.gl/7aKrNH3rgTmbieEx8"
            target="_blank"
            className="inline-block text-white underline underline-offset-4 hover:opacity-80"
          >
            View on Google Maps
          </a>
        </div>

        {/* FORM */}
        <form
          className="
            space-y-5
            bg-white/[0.03]
            border border-white/10
            rounded-2xl
            p-6 md:p-8
          "
        >
          <input
            type="text"
            placeholder="Your name"
            className="premium-input"
            required
          />
          <input
            type="email"
            placeholder="Email address"
            className="premium-input"
            required
          />
          <textarea
            placeholder="Your message"
            rows={4}
            className="premium-input resize-none"
            required
          />
          <button
            type="submit"
            className="
              w-full min-h-[48px]
              rounded-xl
              bg-white text-black
              font-semibold
              hover:opacity-90
              transition
            "
          >
            Send message
          </button>
        </form>
      </section>
    </main>
  );
}
