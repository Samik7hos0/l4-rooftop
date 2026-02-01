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

  return (
    <div className="bg-zinc-900/70 backdrop-blur border border-zinc-800 rounded-2xl p-8">
      <h3 className="text-lg mb-6">Slot Load</h3>

      <div className="space-y-3">
        {Object.entries(slots).map(([time, guests]) => (
          <div key={time}>
            <div className="flex justify-between text-sm text-zinc-400 mb-1">
              <span>{time}</span>
              <span>{guests} guests</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/80"
                style={{ width: `${Math.min(100, guests * 5)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
