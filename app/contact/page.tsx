export const metadata = {
  title: "Contact & Location",
  description:
    "Find L4 Rooftop Restaurant in Dharmanagar. View location, timings and contact details.",
};

import ContactForm from "@/components/ContactForm";
import MapEmbed from "@/components/MapEmbed";

export default function ContactPage() {
  return (
    <main
      className="min-h-screen max-w-4xl mx-auto px-[var(--space-page-x)] py-12 sm:py-16 lg:py-20"
      role="main"
    >
      <header className="mb-10 lg:mb-12">
        <h1 className="text-3xl sm:text-4xl font-semibold text-[var(--primary)] tracking-tight">
          Contact & Location
        </h1>
        <p className="mt-2 text-neutral-500 text-sm sm:text-base">
          Get in touch or find us on the map
        </p>
      </header>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        <section aria-labelledby="contact-details-heading">
          <h2 id="contact-details-heading" className="sr-only">
            Contact details
          </h2>
          <div className="space-y-4 text-neutral-400">
            <p>
              <span className="text-neutral-500">Address</span>
              <br />
              Power House Quarter Complex, Dharmanagar, Tripura 799250
            </p>
            <p>
              <span className="text-neutral-500">Hours</span>
              <br />
              5:30 PM – 11:30 PM
            </p>
            <p>
              <span className="text-neutral-500">Phone</span>
              <br />
              <a
                href="tel:+917005227802"
                className="text-[var(--primary)] hover:underline transition-premium focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded"
              >
                +91 70052 27802
              </a>
            </p>
          </div>

          <div className="mt-10">
            <h3 className="text-sm font-medium text-neutral-400 mb-4">
              Send a message
            </h3>
            <ContactForm />
          </div>
        </section>

        <section aria-labelledby="map-heading" className="min-h-[280px]">
          <h2 id="map-heading" className="sr-only">
            Map
          </h2>
          <MapEmbed />
        </section>
      </div>
    </main>
  );
}
