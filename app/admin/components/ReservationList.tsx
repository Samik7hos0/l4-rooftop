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
      <h2 className="text-sm uppercase tracking-wide text-white/40">
        {title}
      </h2>

      {/* Empty */}
      {reservations.length === 0 && (
        <p className="text-white/30">No records</p>
      )}

      {/* List */}
      <div className="space-y-2">
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
              transition-all
              duration-200
              hover:bg-white/[0.05]
              hover:border-white/10
              focus:bg-white/[0.06]
              focus:border-white/15
              focus:outline-none
              focus:ring-1
              focus:ring-white/20
            "
          >
            {/* Left accent (Apple style) */}
            <span
              className="
                absolute
                left-0
                top-2
                bottom-2
                w-[2px]
                bg-transparent
                group-hover:bg-white/20
                group-focus:bg-white/30
                rounded-full
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
                  items-center
                  opacity-0
                  translate-x-2
                  group-hover:opacity-100
                  group-hover:translate-x-0
                  group-focus-within:opacity-100
                  group-focus-within:translate-x-0
                  transition-all
                  duration-200
                "
              >
                <button
                  onClick={() => confirmReservation(r)}
                  className="
                    font-medium
                    text-white/60
                    hover:text-green-400
                    focus:text-green-400
                    transition
                  "
                >
                  Confirm
                </button>

                <button
                  onClick={() => deleteReservation(r._id)}
                  className="
                    text-white/40
                    hover:text-red-400
                    focus:text-red-400
                    transition
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
