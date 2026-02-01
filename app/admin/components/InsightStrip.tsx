import { Reservation } from "../page";

export default function InsightStrip({
  today,
  pending,
  confirmed,
}: {
  today: Reservation[];
  pending: Reservation[];
  confirmed: Reservation[];
}) {
  const guestsToday = today.reduce((s, r) => s + r.guests, 0);

  return (
    <div className="flex flex-wrap gap-10 text-white/90">
      <Metric label="Today Bookings" value={today.length} />
      <Metric label="Today Guests" value={guestsToday} />
      <Metric label="Pending" value={pending.length} />
      <Metric label="Confirmed" value={confirmed.length} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-sm text-white/50">{label}</p>
      <p className="text-3xl font-semibold">{value}</p>
    </div>
  );
}
