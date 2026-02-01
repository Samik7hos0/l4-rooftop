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
import MobileCommandButton from "./components/MobileCommandButton";

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
  const [paletteOpen, setPaletteOpen] = useState(false);

  function handleLogin() {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthorized(true);
    }
  }

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

  if (!authorized) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="bg-white/[0.04] p-8 rounded-2xl w-[360px]">
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 bg-black border border-white/10 rounded"
          />
          <button
            onClick={handleLogin}
            className="w-full py-2 bg-white text-black rounded font-medium"
          >
            Continue
          </button>
        </div>
      </main>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const todayList = reservations.filter((r) => r.date === today);
  const pending = reservations.filter((r) => r.status === "pending");
  const confirmed = reservations.filter(
    (r) => r.status === "confirmed" && r.date >= today
  );
  const past = reservations.filter((r) => r.date < today);

  return (
    <>
      <main className="min-h-screen bg-black text-white px-6 md:px-16 py-16 space-y-24">
        <FadeIn>
          <header>
            <h1 className="text-3xl md:text-[44px] font-semibold">
              L4 Admin
            </h1>
            <p className="text-white/50 mt-2">
              Reservations & daily performance
            </p>
          </header>
        </FadeIn>

        <FadeIn delay={0.05}>
          <InsightStrip
            todayReservations={todayList}
            pending={pending}
            confirmed={confirmed}
          />
        </FadeIn>

        <FadeIn delay={0.1}>
          <KpiStrip
            todayReservations={todayList}
            pending={pending}
            confirmed={confirmed}
          />
        </FadeIn>

        <FadeIn delay={0.15}>
          <SlotHeatmap reservations={todayList} />
        </FadeIn>

        <FadeIn delay={0.2}>
          <TodaySummary reservations={todayList} />
        </FadeIn>

        <FadeIn delay={0.25}>
          <ReservationList
            title="Today"
            reservations={todayList}
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

      <CommandPalette
        reservations={pending}
        refresh={loadReservations}
      />

      <MobileCommandButton
        onOpen={() => setPaletteOpen(true)}
      />
    </>
  );
}
