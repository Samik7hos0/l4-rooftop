"use client";

import { useEffect, useState } from "react";

/* REQUIRED COMPONENTS */
import FadeIn from "./components/FadeIn";
import InsightStrip from "./components/InsightStrip";
import KpiStrip from "./components/KpiStrip";
import SlotHeatmap from "./components/SlotHeatmap";
import TodaySummary from "./components/TodaySummary";
import ReservationList from "./components/ReservationList";
import WeeklyAnalytics from "./components/WeeklyAnalytics";
import FilterBar from "./components/FilterBar";

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

type Filter =
  | "today"
  | "pending"
  | "large"
  | "special";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);

  /* AUTH */
  function handleLogin() {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthorized(true);
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
      <main className="min-h-screen flex items-center justify-center bg-black text-white px-6">
        <div className="w-full max-w-sm bg-white/[0.04] backdrop-blur-xl p-8 rounded-2xl">
          <h1 className="text-xl text-center mb-6">
            Admin Access
          </h1>
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
        </div>
      </main>
    );
  }

  /* FILTER LOGIC */
  const today = new Date().toISOString().slice(0, 10);

  function applyFilters(list: Reservation[]) {
    return list.filter((r) => {
      if (filters.includes("today") && r.date !== today) return false;
      if (filters.includes("pending") && r.status !== "pending") return false;
      if (filters.includes("large") && r.guests < 6) return false;
      if (filters.includes("special") && !r.note) return false;
      return true;
    });
  }

  const todayList = applyFilters(
    reservations.filter((r) => r.date === today)
  );

  const pending = applyFilters(
    reservations.filter((r) => r.status === "pending")
  );

  const upcoming = applyFilters(
    reservations.filter(
      (r) => r.status === "confirmed" && r.date > today
    )
  );

  const past = applyFilters(
    reservations.filter((r) => r.date < today)
  );

  function toggleFilter(f: Filter) {
    setFilters((prev) =>
      prev.includes(f)
        ? prev.filter((x) => x !== f)
        : [...prev, f]
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-16 py-14 space-y-24">
      <FadeIn>
        <header>
          <h1 className="text-3xl md:text-[44px] font-semibold tracking-tight">
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
          confirmed={upcoming}
        />
      </FadeIn>

      <FadeIn delay={0.1}>
        <KpiStrip
          todayReservations={todayList}
          pending={pending}
          confirmed={upcoming}
        />
      </FadeIn>

      <FadeIn delay={0.12}>
        <WeeklyAnalytics reservations={reservations} />
      </FadeIn>

      <FadeIn delay={0.14}>
        <FilterBar active={filters} toggle={toggleFilter} />
      </FadeIn>

      <FadeIn delay={0.18}>
        <SlotHeatmap reservations={todayList} />
      </FadeIn>

      <FadeIn delay={0.22}>
        <TodaySummary reservations={todayList} />
      </FadeIn>

      <FadeIn delay={0.26}>
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

      <FadeIn delay={0.34}>
        <ReservationList
          title="Upcoming"
          reservations={upcoming}
        />
      </FadeIn>

      <FadeIn delay={0.38}>
        <ReservationList
          title="Past"
          reservations={past}
        />
      </FadeIn>
    </main>
  );
}
