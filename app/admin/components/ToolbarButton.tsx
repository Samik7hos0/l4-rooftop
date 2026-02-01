"use client";

type Props = {
  onOpen: () => void;
};

export default function ToolbarButton({ onOpen }: Props) {
  return (
    <button
      onClick={onOpen}
      aria-label="Open command toolbar"
      className="
        fixed
        bottom-6
        right-6
        z-50
        rounded-full
        bg-white/10
        backdrop-blur-xl
        border
        border-white/15
        px-4
        py-3
        text-sm
        text-white/90
        shadow-lg
        hover:bg-white/20
        transition
      "
    >
      ⌘K
    </button>
  );
}
