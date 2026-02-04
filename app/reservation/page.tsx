"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, startOfDay } from "date-fns";
import Dropdown from "@/components/Dropdown";
import "react-day-picker/dist/style.css";

/* ================= CONFIG ================= */

const HOURS = ["12","1","2","3","4","5","6","7","8","9","10"];
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);

const GUESTS = Array.from({ length: 10 }, (_, i) => i + 1);

/* ================= PAGE ================= */

export default function ReservationPage() {
  const today = startOfDay(new Date());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [date, setDate] = useState<Date | undefined>();
  const [hour, setHour] = useState<string | null>(null);
  const [minute, setMinute] = useState<string | null>(null);
  const [guests, setGuests] = useState<number | null>(1);
  const [customGuests, setCustomGuests] = useState(11);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!date || !hour || !minute || !guests)
      return setError("Please complete all required fields.");

    const payload = {
      name: String(new FormData(e.currentTarget).get("name")).trim(),
      phone: String(new FormData(e.currentTarget).get("phone")).trim(),
      date: format(date, "yyyy-MM-dd"),
      time: `${hour}:${minute} PM`,
      guests: guests === -1 ? customGuests : guests,
      note: String(new FormData(e.currentTarget).get("note") || "").trim(),
    };

    try {
      setLoading(true);
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      sessionStorage.setItem("reservation", JSON.stringify(payload));
      window.location.href = "/reservation-success";
    } catch {
      setError("Unable to place reservation. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const input =
    "w-full min-h-[44px] rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-premium";

  return (
    <main className="min-h-screen bg-black flex justify-center px-6 py-16">
      <form
        onSubmit={handleSubmit}
        className="motion card-premium w-full max-w-xl rounded-3xl p-8 space-y-6"
      >
        {/* HEADER */}
        <header className="text-center space-y-1">
          <h1 className="motion text-3xl font-semibold tracking-tight">
            Reserve a Table
          </h1>
          <p className="motion motion-1 text-sm text-neutral-400">
            Open 12:00 PM – 10:00 PM
          </p>
        </header>

        {error && (
          <p className="text-sm text-red-400 text-center bg-red-500/10 rounded-lg py-2">
            {error}
          </p>
        )}

        {/* NAME */}
        <Field label="Full Name">
          <input name="name" required placeholder="Your name" className={input} />
        </Field>

        {/* PHONE */}
        <Field label="Phone Number">
          <input name="phone" required placeholder="10-digit mobile number" className={input} />
        </Field>

        {/* DATE */}
        <Field label="Date">
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3">
            <DayPicker
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={{ before: today }}
              fromMonth={today}
            />
          </div>
        </Field>

        {/* TIME (PM ONLY) */}
        <Field label="Time (PM only)">
          <div className="grid grid-cols-2 gap-3">
            <Dropdown
              value={hour}
              onChange={setHour}
              placeholder="Hour"
              options={HOURS.map(h => ({ label: h, value: h }))}
            />
            <Dropdown
              value={minute}
              onChange={setMinute}
              placeholder="Minute"
              options={MINUTES.map(m => ({ label: m, value: m }))}
            />
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            All reservations are PM only
          </p>
        </Field>

        {/* GUESTS */}
        <Field label="Guests">
          <Dropdown
            value={guests}
            onChange={setGuests}
            placeholder="Select guests"
            options={[
              ...GUESTS.map(n => ({
                label: `${n} ${n === 1 ? "Guest" : "Guests"}`,
                value: n,
              })),
              { label: "10+ Guests", value: -1 },
            ]}
          />

          {guests === -1 && (
            <input
              type="number"
              min={11}
              value={customGuests}
              onChange={(e) => setCustomGuests(Number(e.target.value))}
              className={`${input} mt-3`}
              placeholder="Enter guest count"
            />
          )}
        </Field>

        {/* NOTE */}
        <Field label="Special Request (optional)">
          <textarea
            name="note"
            rows={3}
            placeholder="Birthday, window seat, allergies…"
            className={`${input} resize-none`}
          />
        </Field>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full min-h-[48px] rounded-xl bg-white text-black font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Booking…" : "Confirm Reservation"}
        </button>

        <p className="text-xs text-neutral-500 text-center">
          You’ll receive confirmation before arrival.
        </p>
      </form>
    </main>
  );
}

/* ================= FIELD ================= */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-neutral-400">{label}</label>
      {children}
    </div>
  );
}
