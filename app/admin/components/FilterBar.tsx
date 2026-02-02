"use client";

const filters = [
  "all",
  "today",
  "pending",
  "confirmed",
  "upcoming",
  "past",
  "large-party",
  "special-request",
  "peak-hour",
];

export default function FilterBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`
            px-3 py-1.5 rounded-full text-xs capitalize
            transition-premium
            ${
              value === f
                ? "bg-white text-black"
                : "bg-white/[0.05] text-white/70 hover:bg-white/[0.12]"
            }
          `}
        >
          {f.replace("-", " ")}
        </button>
      ))}
    </div>
  );
}
