"use client";

import { useEffect, useState } from "react";

export default function FloatingActions() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!whatsapp) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp */}
      <a
        href={`https://wa.me/${whatsapp}?text=Hi%20L4%20Rooftop,%20I%20have%20a%20query`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500 shadow-lg hover:scale-105 transition"
        aria-label="Chat on WhatsApp"
      >
        <span className="text-black font-bold">WA</span>
      </a>

      {/* Call (mobile only) */}
      {isMobile && (
        <a
          href={`tel:+${whatsapp}`}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-500 shadow-lg hover:scale-105 transition"
          aria-label="Call restaurant"
        >
          <span className="text-black font-bold">CALL</span>
        </a>
      )}
    </div>
  );
}
