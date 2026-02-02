"use client";

import { useEffect, useState } from "react";

/* UI */
import FadeIn from "./components/FadeIn";
import InsightStrip from "./components/InsightStrip";
import KpiStrip from "./components/KpiStrip";
import SlotHeatmap from "./components/SlotHeatmap";
import TodaySummary from "./components/TodaySummary";
import WeeklyAnalytics from "./components/WeeklyAnalytics";
import ReservationList from "./components/ReservationList";
import ToolbarButton from "./components/ToolbarButton";
import ToolbarModal from "./components/ToolbarModal";

/* ================= TYPES ================= */

/** ✅ FIX #1 — add notified */
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
  notified?: boolean; // 🔥 REQUIRED
};

/** ✅ FIX #2 — export FilterType */
export type FilterType =
  | "all"
  | "today"
  | "pending"
  | "confirmed"
  | "large"
  | "special"
  | "past";

/* ================= PAGE ================= */

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [toolbarOpen, setToolbarOpen] = useState(false);

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

  /* ⌘K / CTRL+K */
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setToolbarOpen(true);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* LOGIN */
  if (!authorized) {
    return (
      <main
        className="min-h-screen flex items-center justify-center bg-black text-white px-4"
        role="main"
      >
        <div className="w-full max-w-sm bg-white/[0.04] backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-white/5">
          <h1 className="text-xl font-semibold mb-6 text-center tracking-tight">
            Admin Access
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-4"
          >
            <label htmlFor="admin-password" className="sr-only">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full min-h-[48px] px-4 rounded-xl bg-black border border-white/10 text-white placeholder:text-white/40 transition-premium focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/20"
              autoComplete="current-password"
              autoFocus
            />
            <button
              type="submit"
              className="w-full min-h-[48px] rounded-xl bg-white text-black font-semibold hover:opacity-90 transition-premium focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Continue
            </button>
          </form>
        </div>
      </main>
    );
  }

  /* FILTERING */
  const today = new Date().toISOString().slice(0, 10);

  const filtered = reservations.filter((r) => {
    const q = query.toLowerCase();

    const matchQuery =
      r.name.toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      r.date.includes(q);

    const matchFilter =
      filter === "all"
        ? true
        : filter === "today"
        ? r.date === today
        : filter === "past"
        ? r.date < today
        : filter === "large"
        ? r.guests >= 6
        : filter === "special"
        ? Boolean(r.note)
        : r.status === filter;

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
      <ToolbarButton onOpen={() => setToolbarOpen(true)} />

      <ToolbarModal
        open={toolbarOpen}
        onClose={() => setToolbarOpen(false)}
        query={query}
        setQuery={setQuery}
        filter={filter}
        setFilter={setFilter}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-16 py-16 space-y-24">
        <FadeIn>
          <header>
            <h1 className="text-3xl md:text-[44px] font-semibold tracking-tight">
              L4 Admin
            </h1>
            <p className="text-white/50 mt-2">
              Reservations & analytics overview
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

        <div className="grid md:grid-cols-2 gap-16">
          <div className="space-y-12">
            <SlotHeatmap reservations={todayList} />
            <TodaySummary reservations={todayList} />
          </div>
          <WeeklyAnalytics reservations={reservations} />
        </div>

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

        <ReservationList title="Upcoming" reservations={confirmed} />
        <ReservationList title="Past" reservations={past} />
      </div>
    </main>
  );
}
