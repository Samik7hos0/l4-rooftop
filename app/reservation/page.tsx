import ReservationForm from "@/components/ReservationForm";

export const metadata = {
  title: "Reserve a Table | L4 Rooftop Restaurant",
  description:
    "Book your table at L4 – Level Four Rooftop Restaurant, Dharmanagar. Premium rooftop dining experience.",
};

export default function ReservationPage() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.15),transparent_60%)]" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-semibold text-[var(--primary)] mb-4">
              Reserve Your Table
            </h1>
            <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base">
              Book your rooftop dining experience with real-time availability
              and instant confirmation for select slots.
            </p>
          </div>

          {/* Form Card */}
          <ReservationForm />
        </div>
      </div>
    </main>
  );
}
