"use client";

import { useState } from "react";

type FormState = {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
};

const OPENING_TIME = 17; // 5 PM
const CLOSING_TIME = 23; // 11 PM (restaurant closed after this)
const SLOT_INTERVAL = 30; // minutes

function generateTimeSlots() {
  const slots: string[] = [];

  for (let hour = OPENING_TIME; hour < CLOSING_TIME; hour++) {
    for (let min = 0; min < 60; min += SLOT_INTERVAL) {
      // Prevent slots at or after 11:00 PM
      if (hour === CLOSING_TIME - 1 && min > 30) continue;

      const h = hour.toString().padStart(2, "0");
      const m = min.toString().padStart(2, "0");
      slots.push(`${h}:${m}`);
    }
  }

  return slots;
}

const TIME_SLOTS = generateTimeSlots();

export default function ReservationForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: 2,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const params = new URLSearchParams({
          name: form.name,
          date: form.date,
          time: form.time,
          guests: String(form.guests),
        });

        window.location.href = `/reservation-success?${params.toString()}`;
        return;
      }

      const data = await res.json();
      setError(data.error || "Reservation failed.");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-900/80 backdrop-blur p-8 rounded-2xl max-w-md mx-auto shadow-2xl"
    >
      <h2 className="text-2xl text-center mb-6 text-[var(--primary)]">
        Reserve a Table
      </h2>

      <input
        required
        placeholder="Your Name"
        className="input"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        required
        placeholder="Phone Number"
        className="input"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <input
        required
        type="date"
        className="input"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />

      {/* ⏰ TIME SLOT SELECTOR */}
      <select
        required
        className="input"
        value={form.time}
        onChange={(e) => setForm({ ...form, time: e.target.value })}
      >
        <option value="">Select Time</option>
        {TIME_SLOTS.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <input
        required
        type="number"
        min={1}
        max={20}
        className="input"
        value={form.guests}
        onChange={(e) =>
          setForm({ ...form, guests: Number(e.target.value) })
        }
      />

      <button
        disabled={loading}
        className="w-full mt-4 bg-[var(--primary)] text-black py-3 rounded font-semibold hover:opacity-90"
      >
        {loading ? "Submitting..." : "Confirm Reservation"}
      </button>

      {error && (
        <p className="text-red-400 text-center mt-4">{error}</p>
      )}
    </form>
  );
}
