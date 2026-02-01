"use client";

const filters = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
] as const;

export default function FilterBar({
  value,
  onChange,
}: {
  value: "all" | "pending" | "confirmed";
  onChange: (v: any) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => onChange(f.id)}
          className={`
            px-4 py-1.5 rounded-full text-sm whitespace-nowrap
            transition
            ${
              value === f.id
                ? "bg-white text-black"
                : "bg-white/[0.05] text-white/70 hover:bg-white/[0.1]"
            }
          `}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
