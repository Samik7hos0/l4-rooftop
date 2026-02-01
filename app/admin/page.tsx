"use client";

import { useEffect, useState } from "react";

/* REQUIRED COMPONENTS */
import FadeIn from "./components/FadeIn";
import InsightStrip from "./components/InsightStrip";
import KpiStrip from "./components/KpiStrip";
import SlotHeatmap from "./components/SlotHeatmap";
import TodaySummary from "./components/TodaySummary";
import ReservationList from "./components/ReservationList";

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
  const [error, setError] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([]);

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
    const data: Reservation[] = await res.json();

    data.sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
    );

    setReservations(data);
  }

  useEffect(() => {
    if (authorized) loadReservations();
  }, [authorized]);

  /* LOGIN */
  if (!authorized) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="bg-white/[0.04] backdrop-blur-xl p-8 rounded-2xl w-[360px]">
          <h1 className="text-xl mb-6 text-center">Admin Access</h1>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-black border border-white/10 mb-4"
          />

          <button
            onClick={handleLogin}
            className="w-full py-2 rounded bg-white text-black font-medium"
          >
            Continue
          </button>

          {error && (
            <p className="text-red-400 mt-3 text-sm">{error}</p>
          )}
        </div>
      </main>
    );
  }

  /* TIMELINE */
  const today = new Date().toISOString().slice(0, 10);

  const todayReservations = reservations.filter(r => r.date === today);
  const pending = reservations.filter(r => r.status === "pending");
  const confirmed = reservations.filter(
    r => r.status === "confirmed" && r.date >= today
  );
  const past = reservations.filter(r => r.date < today);

  return (
    <main className="min-h-screen bg-black text-white px-16 py-20 space-y-24">
      <FadeIn>
        <header>
          <h1 className="text-[44px] font-semibold tracking-tight">
            L4 Admin
          </h1>
          <p className="text-white/50 mt-2">
            Reservations & daily performance
          </p>
        </header>
      </FadeIn>

      <FadeIn delay={0.05}>
        <InsightStrip
          todayReservations={todayReservations}
          pending={pending}
          confirmed={confirmed}
        />
      </FadeIn>

      <FadeIn delay={0.1}>
        <KpiStrip
          todayReservations={todayReservations}
          pending={pending}
          confirmed={confirmed}
        />
      </FadeIn>

      <FadeIn delay={0.15}>
        <SlotHeatmap reservations={todayReservations} />
      </FadeIn>

      <FadeIn delay={0.2}>
        <TodaySummary reservations={todayReservations} />
      </FadeIn>

      <FadeIn delay={0.25}>
        <ReservationList
          title="Today"
          reservations={todayReservations}
          actionable
          refresh={loadReservations}
        />
      </FadeIn>

      <FadeIn delay={0.3}>
        <ReservationList
          title="Pending Review"
          reservations={pending}
          actionable
          refresh={loadReservations}
        />
      </FadeIn>

      <FadeIn delay={0.35}>
        <ReservationList
          title="Upcoming"
          reservations={confirmed}
        />
      </FadeIn>

      <FadeIn delay={0.4}>
        <ReservationList
          title="Past"
          reservations={past}
        />
      </FadeIn>
    </main>
  );
}
