"use client";

import { useEffect, useState } from "react";
import { Reservation } from "../page";

type Props = {
  reservations: Reservation[];
  onConfirm: (r: Reservation) => void;
  onDelete: (r: Reservation) => void;
};

export default function CommandPalette({
  reservations,
  onConfirm,
  onDelete,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  /* ⌘K / Ctrl+K */
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const actions = reservations
    .filter((r) =>
      `${r.name} ${r.date} ${r.time}`
        .toLowerCase()
        .includes(query.toLowerCase())
    )
    .slice(0, 8);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
      <div className="mx-auto mt-24 w-[92%] max-w-xl bg-[#111] border border-white/10 rounded-2xl shadow-xl">
        <input
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIndex(0);
          }}
          placeholder="Search reservations or actions…"
          className="w-full px-5 py-4 bg-transparent border-b border-white/10 outline-none text-white placeholder:text-white/40"
        />

        <div className="max-h-[360px] overflow-y-auto">
          {actions.map((r, i) => (
            <div
              key={r._id}
              onMouseEnter={() => setIndex(i)}
              className={`px-5 py-3 cursor-pointer flex justify-between items-center ${
                i === index ? "bg-white/5" : ""
              }`}
              onClick={() => {
                onConfirm(r);
                setOpen(false);
              }}
            >
              <div>
                <p className="text-sm">{r.name}</p>
                <p className="text-xs text-white/40">
                  {r.date} · {r.time} · {r.guests} guests
                </p>
              </div>

              <div className="text-xs text-white/40">
                ↵ Confirm
              </div>
            </div>
          ))}

          {actions.length === 0 && (
            <p className="px-5 py-6 text-sm text-white/40">
              No results
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
