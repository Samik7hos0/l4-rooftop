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
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [slots, setSlots] = useState<SlotAnalytics[]>([]);
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthorized(true);
      setError("");
    } else {
      setError("Wrong password");
    }
  }

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

  function getSlot(date: string, time: string) {
    return slots.find((s) => s.date === date && s.time === time);
  }

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

  function sendWhatsAppConfirmation(r: Reservation) {
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

    const message = `
Hello ${r.name},

✅ Your table at *L4 – Level Four Rooftop Restaurant* is confirmed.

📅 ${r.date}
⏰ ${r.time}
👥 Guests: ${r.guests}

We look forward to serving you 🌆🍽️
`.trim();

    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  if (!authorized) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-sm">
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
            className="w-full bg-[var(--primary)] text-black py-3 rounded font-semibold"
          >
            Login
          </button>
          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        </div>
      </main>
    );
  }

  const confirmed = reservations.filter((r) => r.status === "confirmed");
  const pending = reservations.filter((r) => r.status === "pending");

  return (
    <main className="min-h-screen p-8 bg-black text-white">
      <h1 className="text-4xl mb-10 text-[var(--primary)]">
        L4 Admin Dashboard
      </h1>

      {/* 🟢 AUTO-CONFIRMED */}
      <section className="mb-14">
        <h2 className="text-2xl mb-4 text-green-400">
          🟢 Auto-Confirmed Reservations
        </h2>

        {confirmed.length === 0 ? (
          <p className="text-zinc-400">No auto-confirmed reservations.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {confirmed.map((r) => (
              <div
                key={r._id}
                className="border border-green-600 bg-green-900/20 p-5 rounded-xl"
              >
                <p className="font-medium">{r.name}</p>
                <p className="text-sm text-zinc-300">
                  {r.date} • {r.time} • {r.guests} guests
                </p>

                <button
                  onClick={() => deleteReservation(r._id)}
                  className="mt-3 text-sm text-red-400 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🟡 PENDING */}
      <section>
        <h2 className="text-2xl mb-4 text-yellow-400">
          🟡 Pending Review
        </h2>

        {pending.length === 0 ? (
          <p className="text-zinc-400">No pending reservations.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-zinc-700 rounded-xl">
              <thead className="bg-zinc-900">
                <tr>
                  {["Name", "Date", "Time", "Guests", "Actions"].map((h) => (
                    <th key={h} className="p-4 border">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pending.map((r) => {
                  const slot = getSlot(r.date, r.time);
                  const canConfirm =
                    slot && !slot.full && slot.remaining >= r.guests;

                  return (
                    <tr key={r._id} className="text-center">
                      <td className="p-3 border">{r.name}</td>
                      <td className="p-3 border">{r.date}</td>
                      <td className="p-3 border">{r.time}</td>
                      <td className="p-3 border">{r.guests}</td>
                      <td className="p-3 border space-x-2">
                        <button
                          disabled={!canConfirm}
                          onClick={() => confirmReservation(r)}
                          className={`px-3 py-1 rounded text-sm ${
                            canConfirm
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-zinc-700 opacity-50 cursor-not-allowed"
                          }`}
                        >
                          Confirm
                        </button>
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
        )}
      </section>
    </main>
  );
}
