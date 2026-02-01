"use client";

export default function GlobalSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search reservations, guests, dates…"
      className="
        w-full
        rounded-full
        bg-white/[0.06]
        border border-white/[0.08]
        px-5 py-3
        text-sm
        text-white
        placeholder-white/40
        focus:outline-none
        focus:ring-2
        focus:ring-white/20
      "
    />
  );
}
