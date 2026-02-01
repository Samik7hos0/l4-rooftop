"use client";

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
  const todayGuests = todayReservations.reduce(
    (sum, r) => sum + r.guests,
    0
  );

  return (
    <section className="flex gap-20">
      <div>
        <p className="text-white/40 text-sm">Today Guests</p>
        <p className="text-[28px] font-semibold">{todayGuests}</p>
      </div>

      <div>
        <p className="text-white/40 text-sm">Pending</p>
        <p className="text-[28px] font-semibold">
          {pending.length}
        </p>
      </div>

      <div>
        <p className="text-white/40 text-sm">Confirmed</p>
        <p className="text-[28px] font-semibold">
          {confirmed.length}
        </p>
      </div>
    </section>
  );
}
