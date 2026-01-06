export const metadata = {
  title: "Table Reservation",
  description:
    "Reserve a table at L4 Rooftop Restaurant. Live availability, controlled seating and WhatsApp confirmation.",
};

import ReservationForm from "@/components/ReservationForm";

export default function ReservationPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-4xl text-center mb-4 text-[var(--primary)]">
        Reserve Your Table
      </h1>

      <p className="text-center text-zinc-400 mb-12">
        Book your rooftop experience with real-time availability.
      </p>

      <ReservationForm />
    </main>
  );
}
