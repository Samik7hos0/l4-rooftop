"use client";

import { useEffect, useState } from "react";
import { Reservation } from "../page";

type Props = {
  reservations: Reservation[];
  refresh: () => void;
};

export default function CommandPalette({ reservations, refresh }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  /* Keyboard shortcut */
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!open) return null;

  const actions = [
    ...reservations.map((r) => ({
      label: `Confirm · ${r.name} · ${r.time}`,
      action: async () => {
        await fetch("/api/reservations", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: r._id }),
        });
        refresh();
        setOpen(false);
      },
    })),
  ].filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-black border border-white/10 shadow-xl">
        <input
          autoFocus
          placeholder="Search actions…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          className="w-full bg-transparent px-5 py-4 outline-none border-b border-white/10 text-sm"
        />

        <div className="max-h-[360px] overflow-y-auto">
          {actions.length === 0 && (
            <p className="px-5 py-4 text-white/40 text-sm">
              No actions found
            </p>
          )}

          {actions.map((a, i) => (
            <button
              key={i}
              onClick={a.action}
              onMouseEnter={() => setActive(i)}
              className={`w-full text-left px-5 py-3 text-sm transition ${
                i === active
                  ? "bg-white/[0.06]"
                  : "hover:bg-white/[0.04]"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
