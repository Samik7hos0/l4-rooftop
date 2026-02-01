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
    <section className="space-y-4">
      <h2 className="text-xs uppercase tracking-wide text-white/40">
        {title}
      </h2>

      {reservations.length === 0 && (
        <p className="text-white/30 text-sm">No records</p>
      )}

      <div className="divide-y divide-white/5">
        {reservations.map((r) => (
          <div
            key={r._id}
            tabIndex={0}
            className="
              flex flex-col md:flex-row
              md:items-center md:justify-between
              gap-3
              py-4
              outline-none
              transition
              hover:bg-white/[0.02]
              focus:bg-white/[0.04]
              focus:ring-1
              focus:ring-white/10
            "
          >
            <div className="space-y-1">
              <p className="text-sm font-medium">{r.name}</p>
              <p className="text-xs text-white/40">
                {r.date} · {r.time} · {r.guests} guests
              </p>
              {r.note && (
                <p className="text-xs text-white/50 italic">
                  “{r.note}”
                </p>
              )}
            </div>

            {actionable && (
              <div className="
                flex gap-6
                text-xs
                md:opacity-0
                md:group-hover:opacity-100
                md:group-focus-within:opacity-100
              ">
                <button
                  onClick={() => confirmReservation(r)}
                  className="text-white/80 hover:text-white"
                >
                  Confirm
                </button>

                <button
                  onClick={() => deleteReservation(r._id)}
                  className="text-white/40 hover:text-red-400"
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
