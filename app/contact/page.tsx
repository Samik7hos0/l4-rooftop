export const metadata = {
  title: "Contact & Location",
  description:
    "Find L4 Rooftop Restaurant in Dharmanagar. View location, timings and contact details.",
};

export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl mb-6 text-[var(--primary)]">
        Contact & Location
      </h1>

      <p className="mb-2">
        📍 Power House Quarter Complex, Dharmanagar, Tripura 799250
      </p>
      <p className="mb-2">🕕 Open: 5:30 PM – 11:30 PM</p>
      <p className="mb-6">📞 +91 XXXXX XXXXX</p>

      <a
        href="https://maps.google.com"
        target="_blank"
        className="underline"
      >
        View on Google Maps
      </a>
    </main>
  );
}
