"use client";

import { useEffect, useState } from "react";

/* UI */
import FadeIn from "./components/FadeIn";
import InsightStrip from "./components/InsightStrip";
import KpiStrip from "./components/KpiStrip";
import SlotHeatmap from "./components/SlotHeatmap";
import TodaySummary from "./components/TodaySummary";
import ReservationList from "./components/ReservationList";
import GlobalSearch from "./components/GlobalSearch";
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

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed">("all");

  /* AUTH */
  function handleLogin() {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthorized(true);
    } else {
      alert("Wrong password");
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
          <h1 className="text-xl text-center mb-6">Admin Access</h1>
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

  /* FILTERING */
  const today = new Date().toISOString().slice(0, 10);

  const filtered = reservations.filter((r) => {
    const matchQuery =
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.phone.includes(query) ||
      r.date.includes(query);

    const matchFilter =
      filter === "all" ? true : r.status === filter;

    return matchQuery && matchFilter;
  });

  const todayList = filtered.filter((r) => r.date === today);
  const pending = filtered.filter((r) => r.status === "pending");
  const confirmed = filtered.filter(
    (r) => r.status === "confirmed" && r.date >= today
  );
  const past = filtered.filter((r) => r.date < today);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* TOP TOOLBAR */}
      <div className="sticky top-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
          <GlobalSearch value={query} onChange={setQuery} />
          <FilterBar value={filter} onChange={setFilter} />
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-6 md:px-16 py-16 space-y-24 max-w-7xl mx-auto">
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

        <InsightStrip
          todayReservations={todayList}
          pending={pending}
          confirmed={confirmed}
        />

        <KpiStrip
          todayReservations={todayList}
          pending={pending}
          confirmed={confirmed}
        />

        <SlotHeatmap reservations={todayList} />

        <TodaySummary reservations={todayList} />

        <ReservationList
          title="Today"
          reservations={todayList}
          actionable
          refresh={loadReservations}
        />

        <ReservationList
          title="Pending Review"
          reservations={pending}
          actionable
          refresh={loadReservations}
        />

        <ReservationList
          title="Upcoming"
          reservations={confirmed}
        />

        <ReservationList
          title="Past"
          reservations={past}
        />
      </div>
    </main>
  );
}
