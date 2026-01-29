export const metadata = {
  title: "Reservation Received",
};

interface SearchParams {
  name?: string;
  date?: string;
  time?: string;
  guests?: string;
}

export default async function ReservationSuccessPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // ✅ REQUIRED IN NEXT.JS 15
  const params = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg w-full bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-semibold text-[var(--primary)] mb-4">
          🎉 Reservation Received
        </h1>

        <p className="text-zinc-300 mb-6">
          Thank you{" "}
          <strong>{params.name ?? "Guest"}</strong>!
        </p>

        <div className="bg-black/40 rounded-xl p-4 text-left text-sm text-zinc-300 space-y-2 mb-6">
          <p>
            <strong>Date:</strong> {params.date ?? "—"}
          </p>
          <p>
            <strong>Time:</strong> {params.time ?? "—"}
          </p>
          <p>
            <strong>Guests:</strong> {params.guests ?? "—"}
          </p>
        </div>

        <p className="text-zinc-400 text-sm mb-8">
          📲 Our team will review your request and send confirmation via
          WhatsApp shortly.
        </p>

        <a
          href="/"
          className="inline-block bg-[var(--primary)] text-black px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Back to Home
        </a>
      </div>
    </main>
  );
}
