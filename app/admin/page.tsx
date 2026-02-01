"use client";

import { useEffect, useState } from "react";

/* REQUIRED COMPONENTS */
import FadeIn from "./components/FadeIn";
import InsightStrip from "./components/InsightStrip";
import KpiStrip from "./components/KpiStrip";
import SlotHeatmap from "./components/SlotHeatmap";
import TodaySummary from "./components/TodaySummary";
import ReservationList from "./components/ReservationList";
import CommandPalette from "./components/CommandPalette";
import CommandHint from "./components/CommandHint";

/* TYPES */
export type Reservation = {
  _id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  note?: string;
  status: "pending" | "confirmed";
  createdAt: string;
};

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([]);

  function handleLogin() {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthorized(true);
    }
  }

  async function loadReservations() {
    const res = await fetch("/api/reservations");
    const data: Reservation[] = await res.json();
    setReservations(
      data.sort(
        (a, b) =>
          +new Date(b.createdAt) - +new Date(a.createdAt)
      )
    );
  }

  useEffect(() => {
    if (authorized) loadReservations();
  }, [authorized]);

  if (!authorized) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="bg-white/[0.04] p-8 rounded-2xl w-[360px]">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 bg-black border border-white/10 rounded"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-white text-black py-2 rounded"
          >
            Continue
          </button>
        </div>
      </main>
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  const todayReservations = reservations.filter(
    (r) => r.date === today
  );
  const pending = reservations.filter(
    (r) => r.status === "pending"
  );
  const confirmed = reservations.filter(
    (r) => r.status === "confirmed"
  );

  async function confirmReservation(r: Reservation) {
    await fetch("/api/reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: r._id }),
    });

    window.open(
      `https://wa.me/91${r.phone}?text=${encodeURIComponent(
        `Hello ${r.name}, your reservation is confirmed.`
      )}`,
      "_blank"
    );

    loadReservations();
  }

  async function deleteReservation(r: Reservation) {
    await fetch("/api/reservations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: r._id }),
    });
    loadReservations();
  }

  return (
    <>
      <main className="min-h-screen bg-black text-white px-6 md:px-16 py-16 space-y-24">
        <FadeIn>
          <h1 className="text-4xl font-semibold">L4 Admin</h1>
        </FadeIn>

        <FadeIn>
          <InsightStrip
            todayReservations={todayReservations}
            pending={pending}
            confirmed={confirmed}
          />
        </FadeIn>

        <FadeIn>
          <KpiStrip
            todayReservations={todayReservations}
            pending={pending}
            confirmed={confirmed}
          />
        </FadeIn>

        <FadeIn>
          <SlotHeatmap reservations={todayReservations} />
        </FadeIn>

        <FadeIn>
          <TodaySummary reservations={todayReservations} />
        </FadeIn>

        <FadeIn>
          <ReservationList
            title="Pending"
            reservations={pending}
            actionable
            refresh={loadReservations}
          />
        </FadeIn>
      </main>

      {/* Command System */}
      <CommandPalette
        reservations={reservations}
        onConfirm={confirmReservation}
        onDelete={deleteReservation}
      />
      <CommandHint />
    </>
  );
}
