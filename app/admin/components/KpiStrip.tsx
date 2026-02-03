"use client";

import { useEffect, useState } from "react";
import { Reservation } from "../page";

/* ================= HOOK ================= */

function useCountUp(value: number, duration = 600) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOut
      setDisplay(Math.round(start + (value - start) * eased));

      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [value, duration]);

  return display;
}

/* ================= COMPONENT ================= */

export default function KpiStrip({
  todayReservations,
  pending,
  confirmed,
}: {
  todayReservations: Reservation[];
  pending: Reservation[];
  confirmed: Reservation[];
}) {
  const bookingsToday = todayReservations.length;
  const guestsToday = todayReservations.reduce(
    (sum, r) => sum + r.guests,
    0
  );

  const cBookings = useCountUp(bookingsToday);
  const cGuests = useCountUp(guestsToday);
  const cPending = useCountUp(pending.length);
  const cConfirmed = useCountUp(confirmed.length);

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
      <Kpi label="Today Bookings" value={cBookings} />
      <Kpi label="Today Guests" value={cGuests} />
      <Kpi label="Pending" value={cPending} highlight />
      <Kpi label="Confirmed" value={cConfirmed} />
    </section>
  );
}

/* ================= SUB ================= */

function Kpi({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`
        rounded-2xl p-6
        bg-white/[0.035]
        border border-white/10
        transition
        ${highlight ? "ring-1 ring-amber-400/40" : ""}
      `}
    >
      <p className="text-sm text-white/50">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">
        {value}
      </p>
    </div>
  );
}
