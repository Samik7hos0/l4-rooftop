"use client";

import { useEffect, useState } from "react";
import InsightStrip from "./components/InsightStrip";
import ReservationList from "./components/ReservationList";
import TodaySummary from "./components/TodaySummary";

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
  const [error, setError] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const today = new Date().toISOString().slice(0, 10);

  function login() {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthorized(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  }

  async function load() {
    const res = await fetch("/api/reservations");
    const data = await res.json();
    data.sort(
      (a: Reservation, b: Reservation) =>
        +new Date(b.createdAt) - +new Date(a.createdAt)
    );
    setReservations(data);
  }

  useEffect(() => {
    if (authorized) load();
  }, [authorized]);

  if (!authorized) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] p-8 rounded-2xl w-full max-w-sm">
          <h1 className="text-lg mb-4 text-white/80">Admin Access</h1>
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-black/40 border border-white/[0.08] rounded px-4 py-3 mb-3 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={login}
            className="w-full py-3 rounded-lg bg-white/90 text-black font-medium hover:bg-white"
          >
            Continue
          </button>
          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        </div>
      </main>
    );
  }

  const todayReservations = reservations.filter((r) => r.date === today);
  const pending = reservations.filter((r) => r.status === "pending");
  const confirmed = reservations.filter((r) => r.status === "confirmed");

  return (
    <main className="px-12 py-14 space-y-16 max-w-7xl mx-auto">
      <header>
        <h1 className="text-4xl font-medium">L4 Admin</h1>
        <p className="text-white/50 mt-1">
          Reservations & daily performance
        </p>
      </header>

      <InsightStrip
        today={todayReservations}
        pending={pending}
        confirmed={confirmed}
      />

      <TodaySummary reservations={todayReservations} />

      <ReservationList
        title="Pending Review"
        reservations={pending}
        refresh={load}
        actionable
      />

      <ReservationList
        title="Confirmed"
        reservations={confirmed}
      />
    </main>
  );
}
