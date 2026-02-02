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
    if (
      r.notified ||
      !window.confirm(
        `Send WhatsApp confirmation to ${r.name}?\n\nThis will send a message.`
      )
    )
      return;

    await fetch("/api/reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: r._id,
        status: "confirmed",
        notified: true,
      }),
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
      <h2 className="text-sm uppercase tracking-wide text-white/40">
        {title}
      </h2>

      {reservations.length === 0 && (
        <p className="text-white/30">No records</p>
      )}

      <div className="space-y-2">
        {reservations.map((r) => (
          <div
            key={r._id}
            className="
              group flex justify-between items-center
              px-4 py-4 rounded-xl
              border border-white/5
              bg-white/[0.01]
              transition-premium
              hover:bg-white/[0.05]
              hover:border-white/10
            "
          >
            <div className="space-y-1">
              <p className="text-[15px] font-medium">{r.name}</p>
              <p className="text-[13px] text-white/50">
                {r.date} · {r.time} · {r.guests} guests
              </p>
              {r.note && (
                <p className="text-[13px] text-white/60 italic">
                  “{r.note}”
                </p>
              )}
            </div>

            {actionable && (
              <div className="flex gap-5 text-[13px]">
                <button
                  onClick={() => confirmReservation(r)}
                  className="
                    text-white/60 font-medium
                    hover:text-green-400 transition-premium
                  "
                >
                  Confirm
                </button>

                <button
                  onClick={() => deleteReservation(r._id)}
                  className="
                    text-white/40
                    hover:text-red-400 transition-premium
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
