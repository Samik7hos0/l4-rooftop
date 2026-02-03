"use client";

import { useState } from "react";
import { Reservation } from "../page";

type Props = {
  title: string;
  reservations: Reservation[];
  actionable?: boolean;
  refresh?: () => void;
};

const FALLBACK_TEMPLATE = `Hello {{name}}, your reservation at L4 Rooftop is confirmed.

📅 {{date}}
⏰ {{time}}
👥 Guests: {{guests}}

{{note}}`;

export default function ReservationList({
  title,
  reservations,
  actionable,
  refresh,
}: Props) {
  const [preview, setPreview] = useState<Reservation | null>(null);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  /* ================= TEMPLATE ================= */

  function buildMessage(r: Reservation) {
    const template =
      localStorage.getItem("wa_template") || FALLBACK_TEMPLATE;

    return template
      .replace("{{name}}", r.name)
      .replace("{{date}}", r.date)
      .replace("{{time}}", r.time)
      .replace("{{guests}}", String(r.guests))
      .replace("{{note}}", r.note || "");
  }

  /* ================= CONFIRM FLOW ================= */

  async function sendConfirmation(r: Reservation) {
    if (r.notified) return;

    setSending(true);

    const res = await fetch("/api/reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: r._id,
        status: "confirmed",
        notified: true,
      }),
    });

    if (res.ok) {
      const message = buildMessage(r);

      window.open(
        `https://wa.me/91${r.phone}?text=${encodeURIComponent(message)}`,
        "_blank"
      );

      refresh?.();

      setToast("WhatsApp confirmation sent");
      setTimeout(() => setToast(null), 2400);
    }

    setSending(false);
    setPreview(null);
  }

  async function deleteReservation(id: string) {
    if (!window.confirm("Delete this reservation?")) return;

    const res = await fetch("/api/reservations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) refresh?.();
  }

  /* ================= UI ================= */

  return (
    <section className="space-y-4 relative">
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
            className={`
              group flex justify-between items-center
              px-4 py-4 rounded-xl
              border border-white/5
              bg-white/[0.02]
              transition
              ${
                r.status === "pending"
                  ? "animate-pulse-soft border-amber-400/30"
                  : "hover:bg-red/[0.05]"
              }
            `}
          >
            {/* INFO */}
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

            {/* ACTIONS */}
            {actionable && (
              <div className="flex gap-3 shrink-0">
                <button
                  type="button"
                  disabled={r.notified}
                  onClick={() => setPreview(r)}
                  className={`
                    min-h-[40px] px-4 rounded-lg text-[13px] font-medium
                    transition
                    ${
                      r.notified
                        ? "text-green-400 cursor-default"
                        : "text-white/70 hover:text-green-400"
                    }
                  `}
                >
                  {r.notified ? "Sent" : "Confirm"}
                </button>

                <button
                  type="button"
                  onClick={() => deleteReservation(r._id)}
                  className="
                    min-h-[40px] px-4 rounded-lg text-[13px]
                    text-white/50 hover:text-red-400 transition
                  "
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ================= PREVIEW MODAL ================= */}

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => !sending && setPreview(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              w-[92%] max-w-md
              rounded-2xl
              bg-neutral-900
              border border-neutral-800
              p-6 space-y-4
            "
          >
            <h3 className="text-lg font-semibold">
              Send WhatsApp Confirmation
            </h3>

            <div className="text-sm space-y-1 text-white/80">
              <p><strong>Name:</strong> {preview.name}</p>
              <p><strong>Date:</strong> {preview.date}</p>
              <p><strong>Time:</strong> {preview.time}</p>
              <p><strong>Guests:</strong> {preview.guests}</p>
              {preview.note && (
                <p><strong>Note:</strong> {preview.note}</p>
              )}
            </div>

            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white/70 whitespace-pre-wrap">
              {buildMessage(preview)}
            </div>

            <p className="text-xs text-white/50">
              This message will be sent once and cannot be undone.
            </p>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setPreview(null)}
                disabled={sending}
                className="
                  flex-1 py-2 rounded-lg
                  bg-white/10 text-white/70
                  hover:bg-white/20 transition
                "
              >
                Cancel
              </button>

              <button
                onClick={() => sendConfirmation(preview)}
                disabled={sending}
                className="
                  flex-1 py-2 rounded-lg
                  bg-green-500 text-black font-semibold
                  hover:opacity-90 transition
                  disabled:opacity-50
                "
              >
                {sending ? "Sending…" : "Send WhatsApp"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TOAST ================= */}

      {toast && (
        <div
          className="
            fixed bottom-6 right-6 z-50
            px-5 py-3 rounded-xl
            bg-white text-black
            text-sm font-medium
            shadow-xl
            animate-fade-in
          "
        >
          {toast}
        </div>
      )}
    </section>
  );
}
