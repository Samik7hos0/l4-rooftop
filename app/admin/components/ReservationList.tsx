"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Reservation } from "../page";

type Props = {
  title: string;
  reservations: Reservation[];
  actionable?: boolean;
  refresh?: () => void;
  onModalChange?: (open: boolean) => void;
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
  onModalChange,
}: Props) {
  const [preview, setPreview] = useState<Reservation | null>(null);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  /* ===== BULK STATE ===== */
  const [selected, setSelected] = useState<Set<string>>(new Set());

  /* ================= MOUNT ================= */
  useEffect(() => {
    setMounted(true);
  }, []);

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

  /* ================= SELECTION ================= */

  const ids = reservations.map((r) => r._id);
  const allSelected = ids.length > 0 && selected.size === ids.length;

  function toggleOne(id: string) {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(ids));
  }

  /* ================= CONFIRM ================= */

  async function sendConfirmation(r: Reservation) {
    if (r.notified || sending) return;

    setSending(true);

    try {
      const res = await fetch("/api/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: r._id,
          status: "confirmed",
          notified: true,
        }),
      });

      if (!res.ok) throw new Error();

      window.open(
        `https://wa.me/91${r.phone}?text=${encodeURIComponent(
          buildMessage(r)
        )}`,
        "_blank",
        "noopener,noreferrer"
      );

      refresh?.();

      setToast("WhatsApp confirmation sent");
      setTimeout(() => setToast(null), 2200);

      setPreview(null);
    } catch {
      alert("Failed to send WhatsApp confirmation.");
    } finally {
      setSending(false);
    }
  }

  async function bulkConfirm() {
    const list = reservations.filter(
      (r) => selected.has(r._id) && !r.notified
    );

    for (const r of list) {
      await sendConfirmation(r);
      await new Promise((r) => setTimeout(r, 300));
    }

    setSelected(new Set());
  }

  async function bulkDelete() {
    if (!confirm(`Delete ${selected.size} reservations?`)) return;

    for (const id of selected) {
      await fetch("/api/reservations", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    }

    setSelected(new Set());
    refresh?.();
  }

  /* ================= MODAL STATE ================= */

  useEffect(() => {
    onModalChange?.(!!preview);
  }, [preview, onModalChange]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !sending) setPreview(null);
    }

    if (preview) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview, sending]);

  /* ================= UI ================= */

  return (
    <section className="space-y-4 relative">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm uppercase tracking-wide text-white/40">
          {title}
        </h2>

        {actionable && reservations.length > 0 && (
          <button
            onClick={toggleAll}
            className="text-xs text-white/50 hover:text-white transition"
          >
            {allSelected ? "Clear selection" : "Select all"}
          </button>
        )}
      </div>

      {reservations.length === 0 && (
        <p className="text-white/30">No records</p>
      )}

      {/* LIST */}
      <div className="space-y-2">
        {reservations.map((r) => {
          const checked = selected.has(r._id);

          return (
            <div
              key={r._id}
              className={`
                flex items-center gap-4
                px-4 py-4 rounded-xl
                border border-white/5
                bg-white/[0.02]
                transition
                ${
                  r.status === "pending"
                    ? "animate-pulse-soft border-amber-400/30"
                    : "hover:bg-white/[0.05]"
                }
              `}
            >
              {/* CHECKBOX */}
              {actionable && (
                <button
                  onClick={() => toggleOne(r._id)}
                  className={`
                    w-5 h-5 rounded-md border
                    flex items-center justify-center
                    transition
                    ${
                      checked
                        ? "bg-white border-white"
                        : "border-white/30 hover:border-white/60"
                    }
                  `}
                >
                  {checked && (
                    <span className="text-black text-xs leading-none">✓</span>
                  )}
                </button>
              )}

              {/* INFO */}
              <div className="flex-1 space-y-1">
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
                    disabled={r.notified}
                    onClick={() => setPreview(r)}
                    className={`text-[13px] ${
                      r.notified
                        ? "text-green-400"
                        : "text-white/70 hover:text-green-400"
                    }`}
                  >
                    {r.notified ? "Sent" : "Confirm"}
                  </button>

                  <button
                    onClick={() => bulkDelete()}
                    className="text-[13px] text-white/50 hover:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ================= BULK BAR (PORTAL) ================= */}

      {mounted &&
        selected.size > 0 &&
        createPortal(
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9000] pointer-events-none">
            <div
              className="
                pointer-events-auto
                flex items-center gap-6
                px-6 py-3 rounded-full
                bg-black/65 backdrop-blur-xl
                border border-white/10
                shadow-xl
              "
            >
              <span className="text-sm text-white/80">
                {selected.size} selected
              </span>

              <button
                onClick={bulkConfirm}
                className="text-sm text-green-400 hover:underline"
              >
                Confirm all
              </button>

              <button
                onClick={bulkDelete}
                className="text-sm text-red-400 hover:underline"
              >
                Delete
              </button>

              <button
                onClick={() => setSelected(new Set())}
                className="text-sm text-white/50 hover:text-white"
              >
                Clear
              </button>
            </div>
          </div>,
          document.body
        )}

      {/* ================= MODAL (PORTAL) ================= */}

      {mounted &&
  preview &&
  createPortal(
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-auto"
        onClick={() => !sending && setPreview(null)}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none">
        <div
          className="
            w-full max-w-md
            rounded-3xl
            bg-neutral-900/90
            backdrop-blur-xl
            border border-white/10
            p-6 space-y-6
            pointer-events-auto
            motion motion-1
          "
        >
          {/* HEADER */}
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">
              Confirm WhatsApp Message
            </h3>
            <p className="text-xs text-white/50">
              This will mark the reservation as confirmed
            </p>
          </div>

          {/* SUMMARY STRIP */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-white/40 text-xs">Guest</p>
              <p className="text-white font-medium">
                {preview.name}
              </p>
            </div>
            <div>
              <p className="text-white/40 text-xs">Guests</p>
              <p className="text-white font-medium">
                {preview.guests}
              </p>
            </div>
            <div>
              <p className="text-white/40 text-xs">Date</p>
              <p className="text-white font-medium">
                {preview.date}
              </p>
            </div>
            <div>
              <p className="text-white/40 text-xs">Time</p>
              <p className="text-white font-medium">
                {preview.time}
              </p>
            </div>
          </div>

          {/* MESSAGE PREVIEW */}
          <div className="space-y-2">
            <p className="text-xs text-white/50">
              WhatsApp message preview
            </p>
            <div
              className="
                rounded-2xl
                bg-neutral-950
                border border-neutral-800
                p-4
                text-xs
                text-white/80
                whitespace-pre-wrap
              "
            >
              {buildMessage(preview)}
            </div>
          </div>

          {/* NOTE */}
          <p className="text-[11px] text-white/40">
            This action cannot be undone.
          </p>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setPreview(null)}
              disabled={sending}
              className="
                flex-1 py-2.5 rounded-xl
                bg-white/10 text-white/70
                hover:bg-white/20 transition
                disabled:opacity-40
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => sendConfirmation(preview)}
              disabled={sending}
              className="
                flex-1 py-2.5 rounded-xl
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
    </div>,
    document.body
  )}


      {/* ================= TOAST ================= */}

      {toast &&
        mounted &&
        createPortal(
          <div className="fixed bottom-6 right-6 z-[10000] px-5 py-3 rounded-xl bg-white text-black text-sm shadow-xl">
            {toast}
          </div>,
          document.body
        )}
    </section>
  );
}
