"use client";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/917005227802?text=Hi%20I%20want%20to%20reserve%20a%20table%20at%20L4%20Rooftop"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[9999] flex items-center justify-center w-14 h-14 min-w-[56px] min-h-[56px] rounded-full bg-green-500 text-white font-bold shadow-lg hover:bg-green-400 transition-premium focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      aria-label="Chat on WhatsApp"
    >
      WA
    </a>
  );
}
