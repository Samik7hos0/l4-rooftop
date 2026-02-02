"use client";

import { FilterType } from "../page";

type Props = {
  open: boolean;
  onClose: () => void;
  query: string;
  setQuery: (v: string) => void;
  filter: FilterType;
  setFilter: (v: FilterType) => void;
};

export default function ToolbarModal({
  open,
  onClose,
  query,
  setQuery,
  filter,
  setFilter,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-[92%] max-w-lg
          rounded-2xl
          bg-black/90
          border border-white/10
          shadow-2xl
          p-6 space-y-5
          scale-in
        "
      >
        <div className="flex items-center justify-between">
          <p className="text-white/70 text-sm">Quick Tools</p>
          <button
            onClick={onClose}
            className="hidden md:block text-white/40 hover:text-white transition-premium"
          >
            Esc
          </button>
        </div>

        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search reservations…"
          className="
            w-full px-4 py-3 rounded-lg
            bg-black border border-white/15
            text-white placeholder-white/40
            focus:outline-none focus:ring-1 focus:ring-white/30
          "
        />

        <div className="flex flex-wrap gap-2">
          {[
            "all",
            "today",
            "pending",
            "confirmed",
            "large",
            "special",
            "past",
          ].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as FilterType)}
              className={`
                px-3 py-1.5 rounded-md text-sm transition-premium
                ${
                  filter === f
                    ? "bg-white text-black"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }
              `}
            >
              {f}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="md:hidden w-full py-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20"
        >
          Close
        </button>
      </div>
    </div>
  );
}
