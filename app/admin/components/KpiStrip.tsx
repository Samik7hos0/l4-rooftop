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
  const totalGuests = todayReservations.reduce(
    (s, r) => s + r.guests,
    0
  );

  return (
    <div className="grid md:grid-cols-4 gap-6">
      <Kpi title="Today Bookings" value={todayReservations.length} />
      <Kpi title="Today Guests" value={totalGuests} />
      <Kpi title="Pending" value={pending.length} />
      <Kpi title="Confirmed" value={confirmed.length} />
    </div>
  );
}

function Kpi({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <p className="text-sm text-neutral-400">{title}</p>
      <p className="text-3xl font-semibold mt-2">{value}</p>
    </div>
  );
}
