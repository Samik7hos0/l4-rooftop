"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ================= TYPES ================= */

type ReservationData = {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  note?: string;
};

/* ================= PAGE ================= */

export default function ReservationSuccessPage() {
  const [reservation, setReservation] = useState<ReservationData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("reservation");
    if (stored) {
      try {
        setReservation(JSON.parse(stored));
      } catch {
        setReservation(null);
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6 py-20">
      <section
        className="
          w-full max-w-lg
          bg-neutral-900/80
          border border-neutral-800
          rounded-3xl
          p-8 sm:p-10
          space-y-8
          text-center
          transition-premium
          animate-fade-in
        "
      >
        {/* SUCCESS ICON */}
        <div className="flex justify-center">
          <div
            className="
              w-14 h-14
              rounded-full
              bg-white/10
              flex items-center justify-center
              text-white text-xl
              transition-premium
              hover:scale-105
            "
          >
            ✓
          </div>
        </div>

        {/* HEADER */}
        <header className="space-y-2 transition-premium animate-slide-up">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Reservation Received
          </h1>
          <p className="text-sm text-neutral-400">
            Thank you for choosing{" "}
            <span className="text-white font-medium">
              L4 Rooftop Restaurant
            </span>
          </p>
        </header>

        {/* DETAILS */}
        {reservation ? (
          <div
            className="
              bg-neutral-950
              border border-neutral-800
              rounded-2xl
              p-6
              text-left
              space-y-4
              transition-premium
              animate-slide-up
            "
          >
            <Detail label="Guest Name" value={reservation.name} />
            <Detail label="Date" value={reservation.date} />
            <Detail label="Time" value={reservation.time} />
            <Detail label="Guests" value={`${reservation.guests}`} />

            {reservation.note && (
              <Detail
                label="Special Request"
                value={reservation.note}
              />
            )}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">
            Reservation details are unavailable.
          </p>
        )}

        {/* WHAT HAPPENS NEXT */}
        <div className="space-y-3 text-sm text-neutral-400 transition-premium animate-slide-up">
          <p>Our team will review your booking shortly.</p>
          <p>
            You’ll receive a confirmation on{" "}
            <span className="text-white font-medium">WhatsApp</span> once approved.
          </p>
        </div>

        {/* TRUST & POLICY */}
        <div
          className="
            border-t border-neutral-800
            pt-6
            text-left
            space-y-4
            transition-premium
            animate-slide-up
          "
        >
          <h2 className="text-sm font-medium text-white">
            Good to know
          </h2>

          <ul className="space-y-3 text-sm text-neutral-400">
            <li>
              • Please arrive within{" "}
              <span className="text-white">15 minutes</span> of your reserved time.
            </li>
            <li>• Tables are held for a limited time during peak hours.</li>
            <li>• If you need to modify or cancel, contact us on WhatsApp.</li>
            <li>• Special requests are accommodated based on availability.</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="pt-2 transition-premium animate-slide-up">
          <Link
            href="/"
            className="
              inline-flex
              items-center
              justify-center
              min-h-[48px]
              px-8
              rounded-xl
              bg-white/10
              text-white
              font-semibold
              hover:bg-white/20
              hover:scale-[0.98]
              transition-premium
              focus-visible:ring-2
              focus-visible:ring-white/30
              focus-visible:ring-offset-2
              focus-visible:ring-offset-black
            "
          >
            Back to Home
          </Link>
        </div>

        {/* FOOTNOTE */}
        <p className="text-xs text-neutral-500 pt-2 transition-premium animate-fade-in">
          Questions? Our team is happy to help anytime.
        </p>
      </section>
    </main>
  );
}

/* ================= SUB COMPONENT ================= */

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-neutral-500">{label}</span>
      <span className="text-white font-medium text-right">{value}</span>
    </div>
  );
}
