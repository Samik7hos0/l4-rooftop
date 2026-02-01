"use client";

export default function MobileCommandButton({
  onOpen,
}: {
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-5 right-5 md:hidden z-40 w-14 h-14 rounded-full bg-white text-black text-xl font-semibold shadow-xl"
      aria-label="Quick actions"
    >
      ⌘
    </button>
  );
}
