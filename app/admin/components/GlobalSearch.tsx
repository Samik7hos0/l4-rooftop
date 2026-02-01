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
      autoFocus
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search guests, phone, date…"
      className="
        w-full
        bg-white/[0.05]
        border border-white/[0.08]
        rounded-xl
        px-4 py-3
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
