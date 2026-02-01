"use client";

export default function CommandHint() {
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
        bg-white/[0.08] backdrop-blur-xl
        border border-white/10
        rounded-full px-4 py-2
        text-sm text-white/70
        hover:bg-white/[0.14]
        transition
      "
    >
      ⌘K
    </button>
  );
}
