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

/**
 * 🔑 SINGLE SOURCE OF TRUTH
 * This MUST match ToolbarModal
 */
export type Filter =
  | "all"
  | "pending"
  | "confirmed"
  | "today"
  | "tomorrow"
  | "week"
  | "past"
  | "large"
  | "special";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [toolbarOpen, setToolbarOpen] = useState(false);

  /* ================= AUTH ================= */

  function handleLogin() {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthorized(true);
    } else {
      alert("Wrong password");
    }
  }

  /* ================= LOAD ================= */

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

  /* ================= ⌘K ================= */

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setToolbarOpen(true);
      }
      if (e.key === "Escape") {
        setToolbarOpen(false);
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* ================= LOGIN ================= */

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

  /* ================= FILTERING ================= */

  const today = new Date().toISOString().slice(0, 10);

  const filtered = reservations.filter((r) => {
    const q = query.toLowerCase();

    const matchQuery =
      r.name.toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      r.date.includes(q);

    let matchFilter = true;

    switch (filter) {
      case "pending":
        matchFilter = r.status === "pending";
        break;
      case "confirmed":
        matchFilter = r.status === "confirmed";
        break;
      case "today":
        matchFilter = r.date === today;
        break;
      case "past":
        matchFilter = r.date < today;
        break;
      case "week":
        matchFilter = r.date >= today;
        break;
      case "large":
        matchFilter = r.guests >= 6;
        break;
      case "special":
        matchFilter = Boolean(r.note);
        break;
      default:
        matchFilter = true;
    }

    return matchQuery && matchFilter;
  });

  const todayList = filtered.filter((r) => r.date === today);
  const pending = filtered.filter((r) => r.status === "pending");
  const confirmed = filtered.filter(
    (r) => r.status === "confirmed" && r.date >= today
  );
  const past = filtered.filter((r) => r.date < today);

  /* ================= UI ================= */

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Floating Toolbar Trigger */}
      <ToolbarButton onOpen={() => setToolbarOpen(true)} />

      {/* Toolbar Modal */}
      <ToolbarModal
        open={toolbarOpen}
        onClose={() => setToolbarOpen(false)}
        query={query}
        setQuery={setQuery}
        filter={filter}
        setFilter={setFilter}
      />

      {/* CONTENT */}
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
