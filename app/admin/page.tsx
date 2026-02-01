"use client";

import { useEffect, useRef, useState } from "react";

/* REQUIRED COMPONENTS */
import WeeklyAnalytics from "./components/WeeklyAnalytics";
import FadeIn from "./components/FadeIn";
import InsightStrip from "./components/InsightStrip";
import KpiStrip from "./components/KpiStrip";
import SlotHeatmap from "./components/SlotHeatmap";
import TodaySummary from "./components/TodaySummary";
import ReservationList from "./components/ReservationList";
import GlobalSearch from "./components/GlobalSearch";
import SearchHint from "./components/SearchHint";

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

  /* SECTION REFS */
  const todayRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef<HTMLDivElement>(null);
  const upcomingRef = useRef<HTMLDivElement>(null);
  const pastRef = useRef<HTMLDivElement>(null);

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

  const todayReservations = reservations.filter(r => r.date === today);
  const pending = reservations.filter(r => r.status === "pending");
  const upcoming = reservations.filter(
    r => r.status === "confirmed" && r.date > today
  );
  const past = reservations.filter(r => r.date < today);

  function scrollToSection(section: "today" | "pending" | "upcoming" | "past") {
    const map = {
      today: todayRef,
      pending: pendingRef,
      upcoming: upcomingRef,
      past: pastRef,
    };
    map[section].current?.scrollIntoView({ behavior: "smooth" });
  }

  async function confirmReservation(r: Reservation) {
    await fetch("/api/reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: r._id }),
    });
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
      <main className="min-h-screen bg-black text-white px-6 md:px-16 py-14 space-y-24">
        <FadeIn>
          <h1 className="text-4xl font-semibold">L4 Admin</h1>
        </FadeIn>

        <FadeIn>
          <InsightStrip
            todayReservations={todayReservations}
            pending={pending}
            confirmed={upcoming}
          />
        </FadeIn>

        <FadeIn>
          <KpiStrip
            todayReservations={todayReservations}
            pending={pending}
            confirmed={upcoming}
          /><FadeIn delay={0.12}>
  <WeeklyAnalytics reservations={reservations} />
</FadeIn>

        </FadeIn>

        <FadeIn>
          <SlotHeatmap reservations={todayReservations} />
        </FadeIn>

        <FadeIn>
          <TodaySummary reservations={todayReservations} />
        </FadeIn>

        <div ref={todayRef}>
          <ReservationList
            title="Today"
            reservations={todayReservations}
            actionable
            refresh={loadReservations}
          />
        </div>

        <div ref={pendingRef}>
          <ReservationList
            title="Pending Review"
            reservations={pending}
            actionable
            refresh={loadReservations}
          />
        </div>

        <div ref={upcomingRef}>
          <ReservationList
            title="Upcoming"
            reservations={upcoming}
          />
        </div>

        <div ref={pastRef}>
          <ReservationList
            title="Past"
            reservations={past}
          />
        </div>
      </main>

      {/* COMMAND SYSTEM */}
      <GlobalSearch
        reservations={reservations}
        onConfirm={confirmReservation}
        onDelete={deleteReservation}
        onNavigate={scrollToSection}
      />
      <SearchHint />
    </>
  );
}
