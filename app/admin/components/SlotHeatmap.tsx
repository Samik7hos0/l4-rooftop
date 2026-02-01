"use client";

import { Reservation } from "../page";

export default function SlotHeatmap({
  reservations,
}: {
  reservations: Reservation[];
}) {
  const slots: Record<string, number> = {};

  reservations.forEach((r) => {
    slots[r.time] = (slots[r.time] || 0) + r.guests;
  });

  return (
    <section className="space-y-3">
      <p className="text-sm text-white/40 uppercase">
        Slot Pressure
      </p>

      <div className="flex gap-2">
        {Object.entries(slots).map(([time, guests]) => (
          <div
            key={time}
            className="px-4 py-2 rounded-full text-xs bg-white/[0.06]"
          >
            {time} · {guests}
          </div>
        ))}
      </div>
    </section>
  );
}
