"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ReservationData = {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  note?: string;
};

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
    <main className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-6 text-center">
        <h1 className="text-2xl font-semibold">
          🎉 Reservation Received
        </h1>

        <p className="text-neutral-400 text-sm">
          Thank you for choosing <span className="font-medium text-white">L4 Rooftop</span>.
        </p>

        {/* DETAILS */}
        {reservation ? (
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-left space-y-2 text-sm">
            <p>
              <span className="text-neutral-400">Guest Name:</span>{" "}
              <span className="font-medium">{reservation.name}</span>
            </p>

            <p>
              <span className="text-neutral-400">Date:</span>{" "}
              <span className="font-medium">{reservation.date}</span>
            </p>

            <p>
              <span className="text-neutral-400">Time:</span>{" "}
              <span className="font-medium">{reservation.time}</span>
            </p>

            <p>
              <span className="text-neutral-400">Guests:</span>{" "}
              <span className="font-medium">{reservation.guests}</span>
            </p>

            {reservation.note && (
              <p>
                <span className="text-neutral-400">Special Request:</span>{" "}
                <span className="font-medium">{reservation.note}</span>
              </p>
            )}
          </div>
        ) : (
          <p className="text-zinc-500 text-sm">
            Reservation details unavailable.
          </p>
        )}

        <p className="text-neutral-400 text-sm">
          Our team will review your booking and send a confirmation via WhatsApp shortly.
        </p>

        <Link
          href="/"
          className="inline-block bg-amber-500 text-neutral-900 px-6 py-3 rounded-md font-semibold hover:bg-amber-400 transition"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
