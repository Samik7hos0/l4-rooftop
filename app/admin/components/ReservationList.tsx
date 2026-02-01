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
      `Hello ${r.name}, your reservation at L4 Rooftop is confirmed.\n\n${r.date} • ${r.time}\nGuests: ${r.guests}${r.note ? `\nRequest: ${r.note}` : ""}`
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
      <h2 className="text-xs uppercase tracking-widest text-white/40">
        {title}
      </h2>

      {reservations.length === 0 && (
        <p className="text-white/30 text-sm">No records</p>
      )}

      <div className="divide-y divide-white/5">
        {reservations.map(r => (
          <div
            key={r._id}
            tabIndex={0}
            className="
              group flex justify-between items-center py-4
              hover:bg-white/[0.03]
              focus:bg-white/[0.05]
              transition
            "
          >
            <div>
              <p className="font-medium">{r.name}</p>
              <p className="text-sm text-white/40">
                {r.date} · {r.time} · {r.guests} guests
              </p>
              {r.note && (
                <p className="text-sm text-white/50 italic">
                  “{r.note}”
                </p>
              )}
            </div>

            {actionable && (
              <div className="
                flex gap-5 text-sm
                opacity-0
                group-hover:opacity-100
                group-focus-within:opacity-100
                transition
              ">
                <button
                  onClick={() => confirmReservation(r)}
                  className="text-green-400 hover:text-green-300"
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
