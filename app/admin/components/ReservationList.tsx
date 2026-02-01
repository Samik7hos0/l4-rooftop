"use client";

import { Reservation } from "../page";

export default function ReservationList({
  title,
  reservations,
  refresh,
  actionable,
}: {
  title: string;
  reservations: Reservation[];
  refresh?: () => void;
  actionable?: boolean;
}) {
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
    if (!window.confirm("Delete this reservation?")) return;

    await fetch("/api/reservations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    refresh?.();
  }

  return (
    <section className="space-y-6">
      <h2 className="text-xl text-white/70">{title}</h2>

      {reservations.length === 0 && (
        <p className="text-white/40">No records</p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {reservations.map((r) => (
          <div
            key={r._id}
            className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 space-y-4"
          >
            <div>
              <p className="text-lg font-medium">{r.name}</p>
              <p className="text-white/50 text-sm">
                {r.date} • {r.time} • {r.guests} guests
              </p>
            </div>

            {r.note && (
              <div className="text-sm text-white/70 italic">
                “{r.note}”
              </div>
            )}

            {actionable && (
              <div className="flex items-center gap-6 text-sm pt-2">
                <button
                  onClick={() => confirmReservation(r)}
                  className="text-white/80 hover:text-white"
                >
                  Confirm & Message
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
