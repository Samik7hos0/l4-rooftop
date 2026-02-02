"use client";

type Props = {
  onOpen: () => void;
};

export default function ToolbarButton({ onOpen }: Props) {
  return (
    <button
      onClick={onOpen}
      aria-label="Open quick tools"
      className="
        fixed
        bottom-6
        right-6
        z-50
        flex
        items-center
        justify-center
        h-12
        w-12
        rounded-full
        bg-white/10
        backdrop-blur-xl
        border
        border-white/15
        text-white
        shadow-lg
        hover:bg-white/20
        transition-premium
        active:scale-95
      "
    >
      ⌘K
    </button>
  );
}
