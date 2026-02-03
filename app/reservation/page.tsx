"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, startOfDay } from "date-fns";
import "react-day-picker/dist/style.css";

/* ================= CONFIG ================= */

const HOURS = ["12","1","2","3","4","5","6","7","8","9","10","11"];
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i + 1).padStart(2, "0"));
const DEFAULT_GUESTS = [1,2,3,4,5,6,7,8,9,10];

/* ================= PAGE ================= */

export default function ReservationPage() {
  const today = startOfDay(new Date());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [date, setDate] = useState<Date | undefined>();
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [period, setPeriod] = useState<"AM" | "PM">("PM");

  const [guests, setGuests] = useState<number | "more">(1);
  const [customGuests, setCustomGuests] = useState<number>(11);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!date) return setError("Please select a date.");
    if (!hour || !minute) return setError("Please select a valid time.");

    const guestCount = guests === "more" ? customGuests : guests;

    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: (formData.get("name") as string)?.trim(),
      phone: (formData.get("phone") as string)?.trim(),
      date: format(date, "yyyy-MM-dd"),
      time: `${hour}:${minute} ${period}`,
      guests: guestCount,
      note: (formData.get("note") as string)?.trim() || "",
    };

    try {
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
    "w-full min-h-[44px] rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20";

  return (
    <main className="min-h-screen bg-black flex justify-center px-6 py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-neutral-900/80 border border-neutral-800 rounded-3xl p-8 space-y-6"
      >
        {/* HEADER */}
        <header className="text-center space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            Reserve a Table
          </h1>
          <p className="text-sm text-neutral-400">
            Open 12:00 PM – 11:00 PM
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

        {/* TIME */}
        <Field label="Time">
          <div className="grid grid-cols-3 gap-3">
            <select value={hour} onChange={(e)=>setHour(e.target.value)} className={input}>
              <option value="">Hour</option>
              {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
            </select>

            <select value={minute} onChange={(e)=>setMinute(e.target.value)} className={input}>
              <option value="">Min</option>
              {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            {/* AM / PM TOGGLE */}
            <div className="flex rounded-xl overflow-hidden border border-neutral-800">
              {(["AM","PM"] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`flex-1 py-3 text-sm font-medium transition
                    ${period === p
                      ? "bg-white text-black"
                      : "bg-neutral-950 text-white/60 hover:bg-neutral-900"}
                  `}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-neutral-500 mt-1">
            Restaurant hours: 12 PM – 11 PM
          </p>
        </Field>

        {/* GUESTS */}
        <Field label="Guests">
          <select
            value={guests}
            onChange={(e) =>
              setGuests(e.target.value === "more" ? "more" : Number(e.target.value))
            }
            className={input}
          >
            {DEFAULT_GUESTS.map(n => (
              <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
            ))}
            <option value="more">10+ Guests</option>
          </select>

          {guests === "more" && (
            <input
              type="number"
              min={11}
              value={customGuests}
              onChange={(e)=>setCustomGuests(Number(e.target.value))}
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
