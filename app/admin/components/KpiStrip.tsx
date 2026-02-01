import { Reservation } from "../page";

export default function KpiStrip({
  todayReservations,
  pending,
  confirmed,
}: {
  todayReservations: Reservation[];
  pending: Reservation[];
  confirmed: Reservation[];
}) {
  const cards = [
    { label: "Today", value: todayReservations.length },
    { label: "Pending", value: pending.length },
    { label: "Confirmed", value: confirmed.length },
  ];

  return (
    <section className="grid md:grid-cols-3 gap-6">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-zinc-900/70 backdrop-blur border border-zinc-800 rounded-2xl p-6"
        >
          <p className="text-sm text-zinc-400">{c.label}</p>
          <p className="text-3xl font-semibold mt-2">{c.value}</p>
        </div>
      ))}
    </section>
  );
}
