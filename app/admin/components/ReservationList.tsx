"use client";

import { Reservation } from "../page";

type Props = {
  title: string;
  reservations: Reservation[];
  actionable?: boolean;
  refresh?: () => void;
};

export default function ReservationList({
  title,
  reservations,
  actionable,
  refresh,
}: Props) {
  async function confirmReservation(r: Reservation) {
    await fetch("/api/reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: r._id }),
    });

    const msg = encodeURIComponent(
      `Hello ${r.name}, your reservation at L4 Rooftop is confirmed.\n\n${r.date} • ${r.time}\nGuests: ${r.guests}${
        r.note ? `\nRequest: ${r.note}` : ""
      }`
    );

    window.open(`https://wa.me/91${r.phone}?text=${msg}`, "_blank");
    refresh?.();
  }

  async function deleteReservation(id: string) {
    if (!window.confirm("Delete reservation?")) return;

    await fetch("/api/reservations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    refresh?.();
  }

  return (
    <section className="space-y-6">
      <h2 className="text-sm uppercase tracking-wide text-white/40">
        {title}
      </h2>

      {reservations.length === 0 && (
        <p className="text-white/30">No records</p>
      )}

      <div className="divide-y divide-white/5">
        {reservations.map((r) => (
          <div
            key={r._id}
            tabIndex={0}
            onKeyDown={(e) => {
              if (!actionable) return;
              if (e.key === "Enter") confirmReservation(r);
              if (e.key === "Delete" || e.key === "Backspace")
                deleteReservation(r._id);
            }}
            className="
              group py-5 flex justify-between items-center
              transition outline-none
              hover:bg-white/[0.02]
              focus:bg-white/[0.04]
              focus:ring-1 focus:ring-white/10
            "
          >
            <div className="space-y-1">
              <p className="text-[15px] font-medium">{r.name}</p>
              <p className="text-[13px] text-white/40">
                {r.date} · {r.time} · {r.guests} guests
              </p>
              {r.note && (
                <p className="text-[13px] text-white/50 italic">
                  “{r.note}”
                </p>
              )}
            </div>

            {actionable && (
              <div className="flex gap-6 text-[13px] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition">
                <button
                  onClick={() => confirmReservation(r)}
                  className="text-white/80 hover:text-white"
                >
                  Confirm
                </button>
                <button
                  onClick={() => deleteReservation(r._id)}
                  className="text-white/30 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
