"use client";

import { useEffect, useState } from "react";

/* ================= TYPES ================= */

type Reservation = {
  _id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  note?: string;
  status: "confirmed" | "pending";
};

type SlotAnalytics = {
  date: string;
  time: string;
  booked: number;
  remaining: number;
  full: boolean;
};

/* ================= COMPONENT ================= */

export default function AdminPage() {
  /* AUTH */
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");

  /* DATA */
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [slots, setSlots] = useState<SlotAnalytics[]>([]);

  /* ================= AUTH ================= */

  function handleLogin() {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthorized(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  }

  /* ================= LOAD DATA ================= */

  async function loadData() {
    const [r, a] = await Promise.all([
      fetch("/api/reservations"),
      fetch("/api/analytics"),
    ]);

    setReservations(await r.json());
    setSlots(await a.json());
  }

  useEffect(() => {
    if (authorized) loadData();
  }, [authorized]);

  /* ================= ACTIONS ================= */

  async function confirmReservation(id: string) {
    await fetch("/api/reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadData();
  }

  function openWhatsApp(r: Reservation) {
    const text = encodeURIComponent(
      `Hello ${r.name}, 👋\n\nYour reservation at *L4 Rooftop* has been confirmed.\n\n📅 Date: ${r.date}\n⏰ Time: ${r.time}\n👥 Guests: ${r.guests}\n\nWe look forward to welcoming you ✨`
    );

    window.open(`https://wa.me/91${r.phone}?text=${text}`, "_blank");
  }

  async function deleteReservation(id: string) {
    if (!confirm("Delete this reservation?")) return;

    await fetch("/api/reservations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadData();
  }

  /* ================= LOGIN ================= */

  if (!authorized) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-neutral-900 p-8 rounded-2xl w-full max-w-sm border border-neutral-800">
          <h1 className="text-2xl text-center mb-6 text-amber-400">
            Admin Login
          </h1>

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-black border border-neutral-700"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-amber-500 text-black py-3 rounded font-semibold hover:bg-amber-400"
          >
            Enter Dashboard
          </button>

          {error && (
            <p className="text-red-400 text-center mt-4">{error}</p>
          )}
        </div>
      </main>
    );
  }

  /* ================= DERIVED ================= */

  const confirmed = reservations.filter((r) => r.status === "confirmed");
  const pending = reservations.filter((r) => r.status === "pending");

  /* ================= DASHBOARD ================= */

  return (
    <main className="min-h-screen p-8 bg-black text-white space-y-16">
      <header>
        <h1 className="text-4xl font-semibold text-amber-400">
          L4 Rooftop · Admin
        </h1>
        <p className="text-neutral-400 mt-2">
          Reservations & Slot Control
        </p>
      </header>

      {/* KPI */}
      <section className="grid md:grid-cols-4 gap-6">
        <Kpi title="Total Reservations" value={reservations.length} />
        <Kpi title="Confirmed" value={confirmed.length} green />
        <Kpi title="Pending Review" value={pending.length} yellow />
        <Kpi title="Full Slots" value={slots.filter(s => s.full).length} />
      </section>

      {/* SLOT ANALYTICS */}
      <section>
        <h2 className="text-2xl mb-6 text-amber-400">
          Slot Capacity Overview
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {slots.map((s, i) => (
            <div
              key={i}
              className={`p-5 rounded-xl border ${
                s.full
                  ? "border-red-600 bg-red-900/20"
                  : "border-green-600 bg-green-900/20"
              }`}
            >
              <p className="font-medium">
                {s.date} · {s.time}
              </p>
              <p className="text-sm mt-2">
                Booked: {s.booked} | Remaining: {s.remaining}
              </p>
              <p className="mt-2 font-semibold">
                {s.full ? "FULL" : "AVAILABLE"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* AUTO CONFIRMED */}
      <section>
        <h2 className="text-2xl mb-6 text-green-400">
          Auto-Confirmed Reservations
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {confirmed.map((r) => (
            <ReservationCard key={r._id} r={r} />
          ))}
        </div>
      </section>

      {/* MANUAL REVIEW */}
      <section>
        <h2 className="text-2xl mb-6 text-yellow-400">
          Pending Manual Review
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {pending.map((r) => (
            <div
              key={r._id}
              className="border border-neutral-700 rounded-xl p-5 bg-neutral-900"
            >
              <ReservationCard r={r} />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    confirmReservation(r._id);
                    openWhatsApp(r);
                  }}
                  className="flex-1 bg-green-600 py-2 rounded hover:bg-green-700"
                >
                  Confirm & WhatsApp
                </button>

                <button
                  onClick={() => deleteReservation(r._id)}
                  className="bg-red-600 px-4 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

/* ================= COMPONENTS ================= */

function ReservationCard({ r }: { r: Reservation }) {
  return (
    <div className="space-y-1 text-sm">
      <p className="font-medium text-lg">{r.name}</p>
      <p className="text-neutral-400">
        {r.date} · {r.time}
      </p>
      <p>Guests: {r.guests}</p>
      {r.note && (
        <p className="text-neutral-400 italic">
          “{r.note}”
        </p>
      )}
    </div>
  );
}

function Kpi({
  title,
  value,
  green,
  yellow,
}: {
  title: string;
  value: number;
  green?: boolean;
  yellow?: boolean;
}) {
  return (
    <div
      className={`p-6 rounded-xl border ${
        green
          ? "border-green-600 bg-green-900/20"
          : yellow
          ? "border-yellow-600 bg-yellow-900/20"
          : "border-neutral-700 bg-neutral-900"
      }`}
    >
      <p className="text-sm text-neutral-400">{title}</p>
      <p className="text-3xl font-semibold mt-2">{value}</p>
    </div>
  );
}
