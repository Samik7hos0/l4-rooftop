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
  confirmed: boolean;
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
  /* 🔐 AUTH */
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");

  /* 📊 DATA */
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [slots, setSlots] = useState<SlotAnalytics[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= AUTH ================= */

  function handleLogin() {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthorized(true);
      setError("");
    } else {
      setError("Wrong password");
    }
  }

  /* ================= LOADERS ================= */

  async function loadReservations() {
    const res = await fetch("/api/reservations");
    setReservations(await res.json());
  }

  async function loadAnalytics() {
    const res = await fetch("/api/analytics");
    setSlots(await res.json());
  }

  useEffect(() => {
    if (authorized) {
      setLoading(true);
      Promise.all([loadReservations(), loadAnalytics()]).finally(() =>
        setLoading(false)
      );
    }
  }, [authorized]);

  /* ================= HELPERS ================= */

  function getSlot(date: string, time: string) {
    return slots.find((s) => s.date === date && s.time === time);
  }

  /* ================= ACTIONS ================= */

  async function confirmReservation(r: Reservation) {
    await fetch("/api/reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: r._id }),
    });

    sendWhatsAppConfirmation(r);
    loadReservations();
    loadAnalytics();
  }

  async function deleteReservation(id: string) {
    if (!confirm("Delete this reservation?")) return;

    await fetch("/api/reservations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadReservations();
    loadAnalytics();
  }

  /* ================= WHATSAPP ================= */

  function sendWhatsAppConfirmation(r: Reservation) {
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

    const message = `
Hello ${r.name},

✅ Your table at *L4 – Level Four Rooftop Restaurant* is confirmed.

📅 ${r.date}
⏰ ${r.time}
👥 Guests: ${r.guests}

📍 Dharmanagar, Tripura

We look forward to serving you 🌆🍽️
`;

    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  /* ================= LOGIN ================= */

  if (!authorized) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black">
        <div className="bg-zinc-900/80 backdrop-blur p-8 rounded-2xl w-full max-w-sm shadow-2xl">
          <h1 className="text-2xl text-center mb-6 text-[var(--primary)]">
            Admin Access
          </h1>

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-black border border-zinc-700"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-[var(--primary)] text-black py-3 rounded font-semibold hover:opacity-90"
          >
            Login
          </button>

          {error && (
            <p className="text-red-400 text-center mt-4">{error}</p>
          )}
        </div>
      </main>
    );
  }

  /* ================= DASHBOARD ================= */

  const totalSlots = slots.length;
  const fullSlots = slots.filter((s) => s.full).length;
  const availableSlots = totalSlots - fullSlots;

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      <h1 className="text-4xl font-semibold mb-10 text-[var(--primary)]">
        L4 Admin Dashboard
      </h1>

      {/* ================= KPI CARDS ================= */}
      <section className="grid md:grid-cols-3 gap-6 mb-12">
        <KpiCard title="Total Slots" value={totalSlots} />
        <KpiCard title="Available Slots" value={availableSlots} green />
        <KpiCard title="Full Slots" value={fullSlots} red />
      </section>

      {/* ================= SLOT ANALYTICS ================= */}
      <section className="mb-14">
        <h2 className="text-2xl mb-6 text-[var(--primary)]">
          Slot Availability
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((s, i) => (
            <div
              key={i}
              className={`p-5 rounded-xl border shadow ${
                s.full
                  ? "border-red-600 bg-red-900/20"
                  : "border-green-600 bg-green-900/20"
              }`}
            >
              <p className="text-lg font-medium">
                {s.date} • {s.time}
              </p>
              <p className="mt-2">👥 Booked: {s.booked}</p>
              <p>🪑 Remaining: {s.remaining}</p>
              <p className="mt-2 font-semibold">
                {s.full ? "🔴 FULL" : "🟢 AVAILABLE"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= RESERVATIONS ================= */}
      <section>
        <h2 className="text-2xl mb-6 text-[var(--primary)]">
          Reservations
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border border-zinc-700 rounded-xl overflow-hidden">
            <thead className="bg-zinc-900">
              <tr>
                {["Name", "Date", "Time", "Guests", "Status", "Actions"].map(
                  (h) => (
                    <th key={h} className="p-4 border">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {reservations.map((r) => {
                const slot = getSlot(r.date, r.time);
                const canConfirm =
                  slot && !slot.full && slot.remaining >= r.guests;

                return (
                  <tr key={r._id} className="text-center">
                    <td className="p-3 border">{r.name}</td>
                    <td className="p-3 border">{r.date}</td>
                    <td className="p-3 border">{r.time}</td>
                    <td className="p-3 border">{r.guests}</td>
                    <td className="p-3 border">
                      {r.confirmed ? "✅ Confirmed" : "⏳ Pending"}
                    </td>
                    <td className="p-3 border space-x-2">
                      {!r.confirmed && (
                        <button
                          disabled={!canConfirm}
                          onClick={() => confirmReservation(r)}
                          className={`px-3 py-1 rounded text-sm ${
                            canConfirm
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-zinc-700 cursor-not-allowed opacity-50"
                          }`}
                        >
                          Confirm
                        </button>
                      )}

                      <button
                        onClick={() => deleteReservation(r._id)}
                        className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

/* ================= UI COMPONENT ================= */

function KpiCard({
  title,
  value,
  green,
  red,
}: {
  title: string;
  value: number;
  green?: boolean;
  red?: boolean;
}) {
  return (
    <div
      className={`p-6 rounded-xl shadow border ${
        green
          ? "border-green-600 bg-green-900/20"
          : red
          ? "border-red-600 bg-red-900/20"
          : "border-zinc-700 bg-zinc-900/40"
      }`}
    >
      <p className="text-sm uppercase tracking-wide text-zinc-400">
        {title}
      </p>
      <p className="text-3xl font-semibold mt-2">{value}</p>
    </div>
  );
}
