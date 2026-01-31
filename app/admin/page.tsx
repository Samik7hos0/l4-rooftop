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
  specialRequest?: string;
  status: "confirmed" | "pending";
};

/* ================= COMPONENT ================= */

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([]);

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

  useEffect(() => {
    if (authorized) loadReservations();
  }, [authorized]);

  async function confirmReservation(r: Reservation) {
    await fetch("/api/reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: r._id }),
    });

    const msg = encodeURIComponent(
      `Hello ${r.name}, your reservation at L4 Rooftop is confirmed.\n\n📅 Date: ${r.date}\n⏰ Time: ${r.time}\n👥 Guests: ${r.guests}`
    );

    window.open(`https://wa.me/91${r.phone}?text=${msg}`, "_blank");
    loadReservations();
  }

  async function deleteReservation(id: string) {
    if (!confirm("Delete this reservation?")) return;

    await fetch("/api/reservations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadReservations();
  }

  if (!authorized) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl w-full max-w-sm">
          <h1 className="text-xl mb-4 text-center">Admin Login</h1>

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-3 rounded bg-black border border-neutral-700"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-amber-500 text-black py-2 rounded font-semibold"
          >
            Login
          </button>

          {error && <p className="text-red-400 mt-3 text-center">{error}</p>}
        </div>
      </main>
    );
  }

  const pending = reservations.filter((r) => r.status === "pending");

  return (
    <main className="p-10 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-semibold text-amber-400 mb-8">
        Pending Manual Review
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {pending.map((r) => {
          const request = r.note || r.specialRequest;

          return (
            <div
              key={r._id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4"
            >
              <div>
                <p className="text-lg font-semibold">{r.name}</p>
                <p className="text-sm text-neutral-400">
                  {r.date} • {r.time}
                </p>
                <p className="text-sm">Guests: {r.guests}</p>
              </div>

              {/* ✅ SPECIAL REQUEST — FINALLY */}
              {request && (
                <div className="bg-black/40 border border-neutral-700 rounded-lg p-3 text-sm">
                  <p className="text-neutral-400 mb-1">Special Request</p>
                  <p className="italic">{request}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => confirmReservation(r)}
                  className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded font-medium"
                >
                  Confirm & WhatsApp
                </button>

                <button
                  onClick={() => deleteReservation(r._id)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
