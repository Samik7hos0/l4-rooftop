"use client";

import { Reservation } from "../page";

export default function TodaySummary({
  reservations,
}: {
  reservations: Reservation[];
}) {
  const totalGuests = reservations.reduce(
    (sum, r) => sum + r.guests,
    0
  );

  return (
    <section className="space-y-2">
      <p className="text-sm uppercase text-white/40">
        Today Summary
      </p>
      <p className="text-white/80">
        {reservations.length} bookings · {totalGuests} guests
      </p>
    </section>
  );
}
