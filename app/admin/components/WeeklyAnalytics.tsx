"use client";

import { useState, useMemo } from "react";
import { Reservation } from "../page";

function getWeekRange(offset = 0) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() + 1 + offset * 7); // Monday
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export default function WeeklyAnalytics({
  reservations,
}: {
  reservations: Reservation[];
}) {
  const [weekOffset, setWeekOffset] = useState(0);

  const { start, end } = getWeekRange(weekOffset);

  const weekData = useMemo(() => {
    return reservations.filter((r) => {
      const d = new Date(r.date);
      return d >= start && d <= end;
    });
  }, [reservations, start, end]);

  const totalReservations = weekData.length;
  const totalGuests = weekData.reduce((s, r) => s + r.guests, 0);
  const avgGuests =
    totalReservations === 0
      ? 0
      : (totalGuests / totalReservations).toFixed(1);

  const peakDayMap: Record<string, number> = {};
  const peakTimeMap: Record<string, number> = {};

  weekData.forEach((r) => {
    peakDayMap[r.date] = (peakDayMap[r.date] || 0) + r.guests;
    peakTimeMap[r.time] = (peakTimeMap[r.time] || 0) + r.guests;
  });

  const peakDay =
    Object.entries(peakDayMap).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "—";

  const peakTime =
    Object.entries(peakTimeMap).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "—";

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm uppercase tracking-wide text-white/40">
          Weekly Overview
        </h2>

        <div className="flex gap-2 text-sm">
          <button
            onClick={() => setWeekOffset(-1)}
            className={`px-3 py-1 rounded ${
              weekOffset === -1
                ? "bg-white text-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            Last Week
          </button>

          <button
            onClick={() => setWeekOffset(0)}
            className={`px-3 py-1 rounded ${
              weekOffset === 0
                ? "bg-white text-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            This Week
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-12">
        <Metric label="Reservations" value={totalReservations} />
        <Metric label="Guests" value={totalGuests} />
        <Metric label="Avg Guests" value={avgGuests} />
        <Metric label="Peak Day" value={peakDay} />
        <Metric label="Peak Time" value={peakTime} />
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <p className="text-[13px] text-white/40">{label}</p>
      <p className="text-[28px] font-semibold tracking-tight mt-1">
        {value}
      </p>
    </div>
  );
}
