"use client";

import { useEffect, useState } from "react";
import { Reservation } from "../page";

type Props = {
  reservations: Reservation[];
  onConfirm: (r: Reservation) => void;
  onDelete: (r: Reservation) => void;
  onNavigate: (section: "today" | "pending" | "upcoming" | "past") => void;
};

export default function GlobalSearch({
  reservations,
  onConfirm,
  onDelete,
  onNavigate,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  /* ⌘K / Ctrl+K */
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!open) return null;

  const filtered = reservations.filter((r) =>
    `${r.name} ${r.phone} ${r.date} ${r.time}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="mx-auto mt-20 w-[92%] max-w-xl bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or run a command…"
            className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40 text-sm"
          />

          <button
            onClick={() => setOpen(false)}
            className="ml-4 text-white/40 hover:text-white text-lg"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[420px] overflow-y-auto px-2 py-3 space-y-4">
          {/* NAVIGATION */}
          <Section title="Navigation">
            <Action label="Go to Today" onClick={() => onNavigate("today")} />
            <Action label="Go to Pending" onClick={() => onNavigate("pending")} />
            <Action label="Go to Upcoming" onClick={() => onNavigate("upcoming")} />
            <Action label="Go to Past" onClick={() => onNavigate("past")} />
          </Section>

          {/* RESERVATIONS */}
          <Section title="Reservations">
            {filtered.slice(0, 6).map((r) => (
              <Action
                key={r._id}
                label={`${r.name} · ${r.date} · ${r.time}`}
                sub={`${r.guests} guests · ${r.status}`}
                onConfirm={() => onConfirm(r)}
                onDelete={() => onDelete(r)}
              />
            ))}

            {filtered.length === 0 && (
              <p className="px-3 py-2 text-sm text-white/40">
                No matching reservations
              </p>
            )}
          </Section>

          {/* QUICK */}
          <Section title="Quick Actions">
            <Action label="Refresh data" onClick={() => location.reload()} />
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="px-3 mb-2 text-xs uppercase tracking-wide text-white/30">
        {title}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Action({
  label,
  sub,
  onClick,
  onConfirm,
  onDelete,
}: {
  label: string;
  sub?: string;
  onClick?: () => void;
  onConfirm?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group px-3 py-2 rounded-lg hover:bg-white/[0.06] transition cursor-pointer"
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-white">{label}</p>
          {sub && <p className="text-xs text-white/40">{sub}</p>}
        </div>

        {(onConfirm || onDelete) && (
          <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition text-xs">
            {onConfirm && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirm();
                }}
                className="text-emerald-400 hover:text-emerald-300"
              >
                Confirm
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-red-400/70 hover:text-red-400"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
