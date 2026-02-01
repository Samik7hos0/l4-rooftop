"use client";

export default function ToolbarButton({
  onOpen,
}: {
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-6 right-6 z-40 rounded-full bg-white/10 backdrop-blur border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
    >
      ⌘K
    </button>
  );
}
