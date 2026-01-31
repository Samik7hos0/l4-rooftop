import { Reservation } from "../page";

export default function TodaySummary({
  todayReservations,
}: {
  todayReservations: Reservation[];
}) {
  const peak =
    todayReservations.reduce(
      (max, r) => (r.guests > max.guests ? r : max),
      todayReservations[0]
    ) || null;

  return (
    <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h2 className="text-xl text-amber-400 mb-4">
        Today Summary
      </h2>

      {todayReservations.length === 0 ? (
        <p className="text-neutral-500">No reservations today.</p>
      ) : (
        <p className="text-sm">
          Peak booking at <strong>{peak.time}</strong> with{" "}
          <strong>{peak.guests}</strong> guests.
        </p>
      )}
    </section>
  );
}
