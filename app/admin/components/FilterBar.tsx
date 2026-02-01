"use client";

type Filter =
  | "today"
  | "pending"
  | "large"
  | "special";

export default function FilterBar({
  active,
  toggle,
}: {
  active: Filter[];
  toggle: (f: Filter) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <FilterButton
        label="Today"
        active={active.includes("today")}
        onClick={() => toggle("today")}
      />
      <FilterButton
        label="Pending"
        active={active.includes("pending")}
        onClick={() => toggle("pending")}
      />
      <FilterButton
        label="Large Party"
        active={active.includes("large")}
        onClick={() => toggle("large")}
      />
      <FilterButton
        label="Special Request"
        active={active.includes("special")}
        onClick={() => toggle("special")}
      />
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-full text-sm transition
        ${
          active
            ? "bg-white text-black"
            : "bg-white/[0.06] text-white/70 hover:text-white"
        }
      `}
    >
      {label}
    </button>
  );
}
