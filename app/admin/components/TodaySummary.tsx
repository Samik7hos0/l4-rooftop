import { Reservation } from "../page";

export default function TodaySummary({
  reservations,
}: {
  reservations: Reservation[];
}) {
  if (reservations.length === 0) return null;

  const peak = reservations.reduce((a, b) =>
    a.guests > b.guests ? a : b
  );

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6">
      <p className="text-white/60 text-sm">Today’s Highlight</p>
      <p className="text-lg mt-1">
        Peak booking: {peak.time} ({peak.guests} guests)
      </p>
    </div>
  );
}
