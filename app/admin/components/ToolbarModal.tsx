"use client";

import GlobalSearch from "./GlobalSearch";
import FilterBar from "./FilterBar";

type Props = {
  open: boolean;
  onClose: () => void;
  query: string;
  setQuery: (v: string) => void;
  filter: string;
  setFilter: (v: string) => void;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <div
        className="
          relative
          w-[92%]
          max-w-xl
          rounded-2xl
          bg-black
          border
          border-white/10
          shadow-2xl
          p-6
        "
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-white/50">
            Quick actions
          </p>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white"
          >
            Esc
          </button>
        </div>

        <GlobalSearch value={query} onChange={setQuery} />
        <FilterBar value={filter} onChange={setFilter} />
      </div>
    </div>
  );
}
