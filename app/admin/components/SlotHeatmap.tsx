import { Reservation } from "../page";

export default function SlotHeatmap({
  todayReservations,
}: {
  todayReservations: Reservation[];
}) {
  const slots: Record<string, number> = {};

  todayReservations.forEach((r) => {
    slots[r.time] = (slots[r.time] || 0) + r.guests;
  });

  const data = Object.entries(slots).sort((a, b) => b[1] - a[1]);

  return (
    <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h2 className="text-xl text-amber-400 mb-4">
        Slot Occupancy Today
      </h2>

      {data.length === 0 ? (
        <p className="text-neutral-500">No bookings today.</p>
      ) : (
        <div className="space-y-3">
          {data.map(([time, guests]) => (
            <div key={time}>
              <div className="flex justify-between text-sm mb-1">
                <span>{time}</span>
                <span>{guests} guests</span>
              </div>
              <div className="h-2 bg-neutral-800 rounded">
                <div
                  className="h-2 bg-amber-500 rounded"
                  style={{ width: `${Math.min(guests * 10, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
