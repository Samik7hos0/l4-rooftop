"use client";

import { useEffect, useState } from "react";
import KpiStrip from "./components/KpiStrip";
import SlotHeatmap from "./components/SlotHeatmap";
import TodaySummary from "./components/TodaySummary";
import ReservationList from "./components/ReservationList";

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
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const today = new Date().toISOString().slice(0, 10);

  /* AUTH */
  function handleLogin() {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthorized(true);
      setError("");
    } else {
      setError("Wrong password");
    }
  }

  /* LOAD */
  async function loadReservations() {
    const res = await fetch("/api/reservations");
    const data = await res.json();
    data.sort(
      (a: Reservation, b: Reservation) =>
        +new Date(b.createdAt) - +new Date(a.createdAt)
    );
    setReservations(data);
  }

  useEffect(() => {
    if (authorized) loadReservations();
  }, [authorized]);

  /* LOGIN UI */
  if (!authorized) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl w-full max-w-sm">
          <h1 className="text-xl mb-4 text-center">Admin Login</h1>
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-3 rounded bg-black border border-neutral-700"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-amber-500 text-black py-2 rounded font-semibold"
          >
            Login
          </button>
          {error && <p className="text-red-400 mt-3 text-center">{error}</p>}
        </div>
      </main>
    );
  }

  /* DATA */
  const todayReservations = reservations.filter((r) => r.date === today);
  const pending = reservations.filter((r) => r.status === "pending");
  const confirmed = reservations.filter((r) => r.status === "confirmed");

  return (
    <main className="min-h-screen bg-black text-white p-10 space-y-14">
      <h1 className="text-4xl font-semibold text-amber-400">
        L4 Admin Dashboard
      </h1>

      <KpiStrip
        todayReservations={todayReservations}
        pending={pending}
        confirmed={confirmed}
      />

      <SlotHeatmap todayReservations={todayReservations} />

      <TodaySummary todayReservations={todayReservations} />

      <ReservationList
  title="Pending Manual Review"
  color="text-yellow-400"
  reservations={pending}
  onRefresh={loadReservations}
/>

<ReservationList
  title="Confirmed Reservations"
  color="text-green-400"
  reservations={confirmed}
/>

    </main>
  );
}
