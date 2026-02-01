"use client";

import { Reservation } from "../page";

export default function ReservationList({
  title,
  reservations,
  actionable,
  refresh,
}: {
  title: string;
  reservations: Reservation[];
  actionable?: boolean;
  refresh?: () => void;
}) {
  /* ✅ renamed to avoid conflict */
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
    /* ✅ explicitly browser confirm */
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
            className="group py-5 flex justify-between items-center transition-all"
          >
            <div>
              <p className="text-[15px] font-medium">{r.name}</p>
              <p className="text-[13px] text-white/40">
                {r.date} · {r.time} · {r.guests} guests
              </p>
              {r.note && (
                <p className="text-[13px] text-white/50 mt-1 italic">
                  “{r.note}”
                </p>
              )}
            </div>

            {actionable && (
              <div className="flex gap-6 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => confirmReservation(r)}
                  className="text-[13px] text-white/80 hover:text-white"
                >
                  Confirm & Message
                </button>

                <button
                  onClick={() => deleteReservation(r._id)}
                  className="text-[13px] text-white/30 hover:text-red-400"
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
