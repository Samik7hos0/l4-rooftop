"use client";

export default function SearchHint() {
  return (
    <button
      onClick={() =>
        window.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "k",
            metaKey: true,
          })
        )
      }
      className="
        fixed bottom-6 right-6 z-40
        flex items-center gap-2
        px-4 py-2 rounded-full
        bg-white/[0.08] backdrop-blur-xl
        border border-white/10
        text-sm text-white/70
        hover:bg-white/[0.14]
        transition
      "
    >
      <span>Search</span>
      <span className="text-xs opacity-60">⌘K</span>
    </button>
  );
}
