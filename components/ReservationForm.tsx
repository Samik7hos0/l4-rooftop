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
const CLOSING_TIME = 23; // 11 PM
const SLOT_INTERVAL = 30;

function generateTimeSlots() {
  const slots: string[] = [];

  for (let hour = OPENING_TIME; hour < CLOSING_TIME; hour++) {
    for (let min = 0; min < 60; min += SLOT_INTERVAL) {
      if (hour === 22 && min > 30) continue; // last slot 10:30 PM
      slots.push(
        `${hour.toString().padStart(2, "0")}:${min
          .toString()
          .padStart(2, "0")}`
      );
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

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
      setError(data.error || "Reservation failed");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-3xl mx-auto">
      <div className="relative rounded-3xl bg-zinc-900/80 backdrop-blur border border-zinc-800 shadow-2xl">
        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 md:p-10"
        >
          <h2 className="text-2xl md:text-3xl text-center text-[var(--primary)] mb-2">
            Reserve a Table
          </h2>
          <p className="text-center text-zinc-400 mb-8 text-sm">
            An elevated rooftop dining experience awaits 🌆
          </p>

          {/* Name & Phone */}
          <div className="grid gap-5 md:grid-cols-2 mb-5">
            <input
              required
              placeholder="Your Name"
              className="premium-input"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              required
              placeholder="Phone Number"
              className="premium-input"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          </div>

          {/* Date */}
          <div className="mb-5">
            <label className="premium-label">Select Date</label>
            <input
              required
              type="date"
              className="premium-input"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />
          </div>

          {/* Time */}
          <div className="mb-5">
            <label className="premium-label">Select Time</label>
            <select
              required
              className="premium-input"
              value={form.time}
              onChange={(e) =>
                setForm({ ...form, time: e.target.value })
              }
            >
              <option value="">Choose a slot</option>
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Guests */}
          <div className="mb-8">
            <label className="premium-label">Number of Guests</label>
            <input
              type="number"
              min={1}
              max={20}
              className="premium-input"
              value={form.guests}
              onChange={(e) =>
                setForm({
                  ...form,
                  guests: Number(e.target.value),
                })
              }
            />
          </div>

          {/* CTA */}
          <button
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--primary)] to-yellow-400 text-black font-semibold text-lg hover:opacity-90 transition-premium"
          >
            {loading ? "Booking..." : "Confirm Reservation"}
          </button>

          {error && (
            <p className="text-red-400 text-center mt-5">
              {error}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
