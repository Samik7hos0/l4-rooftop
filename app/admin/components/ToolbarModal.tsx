"use client";

import { FilterType } from "../page";

type Props = {
  open: boolean;
  onClose: () => void;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
      <div className="w-full max-w-xl bg-black border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <p className="text-white/60 text-sm">Quick Tools</p>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white"
          >
            Esc
          </button>
        </div>

        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search reservations…"
          className="w-full p-3 mb-4 rounded bg-white/[0.04] border border-white/10"
        />

        <div className="flex gap-2">
          {(["all", "pending", "confirmed"] as FilterType[]).map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded text-sm ${
                  filter === f
                    ? "bg-white text-black"
                    : "bg-white/[0.06] text-white/70"
                }`}
              >
                {f}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
