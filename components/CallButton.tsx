"use client";

export default function CallButton() {
  return (
    <a
      href="tel:+917005227802"
      className="fixed bottom-6 right-24 z-[9999] flex items-center justify-center w-14 h-14 min-w-[56px] min-h-[56px] rounded-full bg-blue-500 text-white font-bold shadow-lg hover:bg-blue-400 transition-premium focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black lg:hidden"
      aria-label="Call restaurant"
    >
      📞
    </a>
  );
}
