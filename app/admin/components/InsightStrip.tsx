"use client";

import { Reservation } from "../page";

export default function InsightStrip({
  todayReservations,
  pending,
  confirmed,
}: {
  todayReservations: Reservation[];
  pending: Reservation[];
  confirmed: Reservation[];
}) {
  return (
    <section className="flex gap-12 text-white/80 text-sm">
      <div>
        <p className="text-white/40">Today Bookings</p>
        <p className="text-2xl font-medium">
          {todayReservations.length}
        </p>
      </div>

      <div>
        <p className="text-white/40">Pending</p>
        <p className="text-2xl font-medium">{pending.length}</p>
      </div>

      <div>
        <p className="text-white/40">Confirmed</p>
        <p className="text-2xl font-medium">
          {confirmed.length}
        </p>
      </div>
    </section>
  );
}
