import ReservationForm from "@/components/ReservationForm";

export default function ReservationPage() {
  return (
    <main className="container py-24 max-w-3xl">
      <h1 className="text-4xl font-semibold mb-6">
        Reserve a Table
      </h1>
      <p className="text-zinc-600 mb-12">
        Book your rooftop dining experience with real-time availability.
      </p>

      <ReservationForm />
    </main>
  );
}
