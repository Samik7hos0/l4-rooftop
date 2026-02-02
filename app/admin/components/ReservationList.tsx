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
    if (r.notified) {
      alert("Customer already notified.");
      return;
    }

    const ok = window.confirm(
      "Send WhatsApp confirmation to the customer?"
    );
    if (!ok) return;

    await fetch("/api/reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: r._id, notified: true }),
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
    const ok = window.confirm("Delete this reservation?");
    if (!ok) return;

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
            tabIndex={actionable ? 0 : -1}
            className="
              group
              relative
              flex
              justify-between
              items-center
              px-4
              py-4
              rounded-xl
              border
              border-white/5
              bg-white/[0.01]
              transition
              duration-150
              ease-out
              hover:bg-white/[0.04]
              hover:border-white/10
              focus:outline-none
              focus:ring-1
              focus:ring-white/20
            "
          >
            {/* Left accent */}
            <span
              className="
                absolute
                left-0
                top-2
                bottom-2
                w-[2px]
                rounded-full
                bg-transparent
                group-hover:bg-white/20
                transition
              "
            />

            {/* Info */}
            <div className="space-y-1">
              <p className="text-[15px] font-medium text-white">
                {r.name}
              </p>
              <p className="text-[13px] text-white/50">
                {r.date} · {r.time} · {r.guests} guests
              </p>
              {r.note && (
                <p className="text-[13px] text-white/60 italic">
                  “{r.note}”
                </p>
              )}
            </div>

            {/* Actions */}
            {actionable && (
              <div
                className="
                  flex
                  gap-5
                  text-[13px]
                  opacity-100
                  md:opacity-0
                  md:translate-x-2
                  md:group-hover:opacity-100
                  md:group-hover:translate-x-0
                  transition-all
                  duration-150
                "
              >
                <button
                  onClick={() => confirmReservation(r)}
                  className="text-white/70 hover:text-green-400"
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
