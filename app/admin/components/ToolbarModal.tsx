"use client";

type Filter =
  | "all"
  | "pending"
  | "confirmed"
  | "today"
  | "tomorrow"
  | "week"
  | "past"
  | "large"
  | "special";

export default function ToolbarModal({
  open,
  onClose,
  query,
  setQuery,
  filter,
  setFilter,
}: {
  open: boolean;
  onClose: () => void;
  query: string;
  setQuery: (v: string) => void;
  filter: Filter;
  setFilter: (v: Filter) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="
          w-[92%]
          max-w-xl
          rounded-2xl
          bg-black/80
          backdrop-blur-2xl
          border
          border-white/10
          shadow-2xl
          p-6
          space-y-6
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/50">Quick Tools</p>

          <button
            onClick={onClose}
            className="text-xs text-white/40 hover:text-white transition"
          >
            Esc
          </button>
        </div>

        {/* SEARCH */}
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search reservations…"
          className="
            w-full
            px-4
            py-3
            rounded-xl
            bg-black
            border
            border-white/15
            text-sm
            text-white
            placeholder-white/30
            focus:outline-none
            focus:ring-1
            focus:ring-white/30
          "
        />

        {/* FILTER SECTIONS */}
        <div className="space-y-5 text-sm">
          {/* STATUS */}
          <FilterGroup title="Status">
            <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
              All
            </FilterChip>
            <FilterChip
              active={filter === "pending"}
              onClick={() => setFilter("pending")}
            >
              Pending
            </FilterChip>
            <FilterChip
              active={filter === "confirmed"}
              onClick={() => setFilter("confirmed")}
            >
              Confirmed
            </FilterChip>
          </FilterGroup>

          {/* TIME */}
          <FilterGroup title="Time">
            <FilterChip
              active={filter === "today"}
              onClick={() => setFilter("today")}
            >
              Today
            </FilterChip>
            <FilterChip
              active={filter === "tomorrow"}
              onClick={() => setFilter("tomorrow")}
            >
              Tomorrow
            </FilterChip>
            <FilterChip
              active={filter === "week"}
              onClick={() => setFilter("week")}
            >
              This Week
            </FilterChip>
            <FilterChip
              active={filter === "past"}
              onClick={() => setFilter("past")}
            >
              Past
            </FilterChip>
          </FilterGroup>

          {/* CONTEXT */}
          <FilterGroup title="Context">
            <FilterChip
              active={filter === "large"}
              onClick={() => setFilter("large")}
            >
              Large Party
            </FilterChip>
            <FilterChip
              active={filter === "special"}
              onClick={() => setFilter("special")}
            >
              Special Request
            </FilterChip>
          </FilterGroup>
        </div>
      </div>
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wide text-white/30">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3
        py-1.5
        rounded-lg
        text-sm
        transition
        ${
          active
            ? "bg-white text-black font-medium"
            : "bg-white/[0.06] text-white/70 hover:bg-white/[0.12]"
        }
      `}
    >
      {children}
    </button>
  );
}
