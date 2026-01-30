"use client";

import { useEffect, useState } from "react";

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

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [slots, setSlots] = useState<SlotAnalytics[]>([]);

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
      loadReservations();
      loadAnalytics();
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

  if (!authorized) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-zinc-900 p-8 rounded-xl w-full max-w-sm">
          <h1 className="text-xl mb-4 text-center text-[var(--primary)]">
            Admin Login
          </h1>

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 bg-black border border-zinc-700 rounded"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-[var(--primary)] text-black py-2 rounded"
          >
            Login
          </button>

          {error && (
            <p className="text-red-400 mt-4 text-center">{error}</p>
          )}
        </div>
      </main>
    );
  }

  const confirmed = reservations.filter((r) => r.status === "confirmed");
  const pending = reservations.filter((r) => r.status === "pending");

  return (
    <main className="min-h-screen p-8 bg-black text-white">
      <h1 className="text-3xl mb-8 text-[var(--primary)]">
        L4 Admin Dashboard
      </h1>

      {/* AUTO-CONFIRMED */}
      <section className="mb-10">
        <h2 className="text-xl text-green-400 mb-3">
          🟢 Auto-Confirmed Reservations
        </h2>

        {confirmed.length === 0 ? (
          <p className="text-zinc-400">None</p>
        ) : (
          confirmed.map((r) => (
            <div
              key={r._id}
              className="border border-green-600 bg-green-900/20 p-4 rounded mb-2"
            >
              {r.name} • {r.date} • {r.time} • {r.guests} guests
            </div>
          ))
        )}
      </section>

      {/* PENDING */}
      <section>
        <h2 className="text-xl text-yellow-400 mb-3">
          🟡 Pending Review
        </h2>

        {pending.map((r) => {
          const slot = getSlot(r.date, r.time);
          const canConfirm =
            slot && !slot.full && slot.remaining >= r.guests;

          return (
            <div
              key={r._id}
              className="border border-zinc-700 p-4 rounded mb-2 flex justify-between"
            >
              <span>
                {r.name} • {r.date} • {r.time} • {r.guests}
              </span>

              <div className="space-x-2">
                <button
                  disabled={!canConfirm}
                  onClick={() => confirmReservation(r)}
                  className={`px-3 py-1 rounded ${
                    canConfirm
                      ? "bg-green-600"
                      : "bg-zinc-700 cursor-not-allowed"
                  }`}
                >
                  Confirm
                </button>

                <button
                  onClick={() => deleteReservation(r._id)}
                  className="bg-red-600 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
