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
  /* ---------- CONFIRM ---------- */
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

  /* ---------- DELETE ---------- */
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
    <section className="space-y-4">
      {/* Section title */}
      <h2 className="text-xs uppercase tracking-wide text-white/40">
        {title}
      </h2>

      {/* Empty state */}
      {reservations.length === 0 && (
        <p className="text-white/30 text-sm">No records</p>
      )}

      {/* List */}
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
            className={`
              group
              flex flex-col md:flex-row
              md:items-center md:justify-between
              gap-3
              py-4 px-2
              rounded-lg
              outline-none
              transition

              hover:bg-emerald-500/[0.04]
              focus:bg-emerald-500/[0.06]
              focus:ring-1
              focus:ring-emerald-500/20
            `}
          >
            {/* LEFT */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">
                {r.name}
              </p>

              <p className="text-xs text-white/40">
                {r.date} · {r.time} · {r.guests} guests
              </p>

              {r.note && (
                <p className="text-xs text-white/50 italic">
                  “{r.note}”
                </p>
              )}
            </div>

            {/* ACTIONS */}
            {actionable && (
              <div
                className={`
                  flex gap-6 text-xs

                  /* Mobile: always visible */
                  opacity-100

                  /* Desktop: hover / focus only */
                  md:opacity-0
                  md:group-hover:opacity-100
                  md:group-focus-within:opacity-100

                  transition-opacity
                `}
              >
                <button
                  onClick={() => confirmReservation(r)}
                  className="
                    font-medium
                    text-emerald-400
                    hover:text-emerald-300
                  "
                >
                  Confirm
                </button>

                <button
                  onClick={() => deleteReservation(r._id)}
                  className="
                    text-red-400/70
                    hover:text-red-400
                  "
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
