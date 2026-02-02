"use client";

import { motion } from "framer-motion";
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

    if (!window.confirm("Send WhatsApp confirmation to customer?")) return;

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
          <motion.div
            key={r._id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
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
              transition
            "
          >
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

            {actionable && (
              <div className="flex gap-5 text-[13px] opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => confirmReservation(r)}
                  className="font-medium text-white/60 hover:text-green-400"
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
          </motion.div>
        ))}
      </div>
    </section>
  );
}
