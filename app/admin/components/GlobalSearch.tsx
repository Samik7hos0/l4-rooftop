"use client";

import { useEffect, useState } from "react";
import { Reservation } from "../page";

type Props = {
  reservations: Reservation[];
  onConfirm: (r: Reservation) => void;
  onDelete: (r: Reservation) => void;
};

export default function GlobalSearch({
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

  const results = reservations
    .filter((r) =>
      `${r.name} ${r.phone} ${r.date} ${r.time}`
        .toLowerCase()
        .includes(query.toLowerCase())
    )
    .slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md">
      <div className="mx-auto mt-24 w-[92%] max-w-xl bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <input
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIndex(0);
          }}
          placeholder="Search reservations, guests, dates…"
          className="w-full px-5 py-4 bg-transparent outline-none text-white placeholder:text-white/40 border-b border-white/10"
        />

        <div className="max-h-[380px] overflow-y-auto">
          {results.map((r, i) => (
            <div
              key={r._id}
              onMouseEnter={() => setIndex(i)}
              onClick={() => {
                onConfirm(r);
                setOpen(false);
              }}
              className={`
                px-5 py-3 flex justify-between items-center cursor-pointer
                ${i === index ? "bg-white/5" : ""}
              `}
            >
              <div>
                <p className="text-sm text-white">{r.name}</p>
                <p className="text-xs text-white/40">
                  {r.date} · {r.time} · {r.guests} guests · {r.status}
                </p>
              </div>

              <div className="flex gap-4 text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onConfirm(r);
                    setOpen(false);
                  }}
                  className="text-emerald-400 hover:text-emerald-300"
                >
                  Confirm
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(r);
                    setOpen(false);
                  }}
                  className="text-red-400/70 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {results.length === 0 && (
            <p className="px-5 py-6 text-sm text-white/40">
              No results found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
