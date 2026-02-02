"use client";

export default function CallButton() {
  return (
    <a
      href="tel:+917005227802"
      className="
        fixed bottom-6 right-24
        z-[9999]
        flex items-center justify-center
        w-14 h-14
        rounded-full
        bg-blue-500
        text-white font-bold
        shadow-2xl
        hover:bg-blue-400
        transition-premium

        lg:hidden
      "
      aria-label="Call Restaurant"
    >
      📞
    </a>
  );
}
