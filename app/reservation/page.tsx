"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, startOfDay } from "date-fns";
import "react-day-picker/dist/style.css";

export default function ReservationPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [period, setPeriod] = useState<"AM" | "PM" | null>(null);

  const today = startOfDay(new Date());

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!date) {
      setError("Please select a date");
      return;
    }

    if (!period) {
      setError("Please select AM or PM");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const time =
      formData.get("hour") +
      ":" +
      formData.get("minute") +
      " " +
      period;

    const payload = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      date: format(date, "yyyy-MM-dd"),
      time,
      guests: Number(formData.get("guests")),
      note: formData.get("note"),
    };

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed");

      sessionStorage.setItem("reservation", JSON.stringify(payload));
      window.location.href = "/reservation-success";
    } catch {
      setError("Unable to place reservation. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex justify-center px-6 py-20">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl space-y-6 bg-neutral-900 border border-neutral-800 p-8 rounded-2xl"
      >
        <h1 className="text-3xl font-semibold text-center">
          Reserve a Table
        </h1>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        {/* NAME */}
        <input
          name="name"
          required
          placeholder="Full Name"
          className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-4 py-3 transition-premium focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
        />

        {/* PHONE */}
        <input
          name="phone"
          required
          placeholder="Phone Number"
          className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-4 py-3 transition-premium focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
        />

        {/* PREMIUM CALENDAR */}
        <div>
          <label className="text-sm text-neutral-400 mb-2 block">
            Select Date
          </label>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3">
            <DayPicker
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={{ before: today }}
              fromMonth={today}
            />
          </div>
        </div>

        {/* LUXURY TIME SELECTOR */}
        <div>
          <label className="text-sm text-neutral-400 mb-2 block">
            Select Time
          </label>

          <div className="space-y-3">
            {/* Hour + Minute */}
            <div className="grid grid-cols-2 gap-3">
              <select
                name="hour"
                required
                className="rounded-md bg-neutral-950 border border-neutral-800 px-4 py-3"
              >
                <option value="">Hour</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={String(h).padStart(2, "0")}>
                    {String(h).padStart(2, "0")}
                  </option>
                ))}
              </select>

              <select
                name="minute"
                required
                className="rounded-md bg-neutral-950 border border-neutral-800 px-4 py-3"
              >
                <option value="">Minute</option>
                {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                  <option key={m} value={String(m).padStart(2, "0")}>
                    {String(m).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>

            {/* AM / PM SEGMENTED CONTROL */}
            <div className="flex rounded-xl border border-neutral-800 overflow-hidden">
              {(["AM", "PM"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
className={`flex-1 py-3 text-sm font-semibold transition-premium ${
                      period === p
                        ? "bg-amber-500 text-neutral-900"
                        : "bg-neutral-950 text-neutral-400 hover:bg-neutral-900"
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* GUESTS */}
        <select
          name="guests"
          required
          className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-4 py-3 transition-premium focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
        >
          <option value="">Number of Guests</option>
          {[1,2,3,4,5,6,7,8,9,10].map((n) => (
            <option key={n} value={n}>
              {n} Guest{n > 1 && "s"}
            </option>
          ))}
        </select>

        {/* NOTE */}
        <textarea
          name="note"
          placeholder="Special request (optional)"
          className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-4 py-3 min-h-[100px] transition-premium focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
        />

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 text-neutral-900 py-3 rounded-md font-semibold hover:bg-amber-400 transition-premium disabled:opacity-50"
        >
          {loading ? "Booking..." : "Confirm Reservation"}
        </button>
      </form>
    </main>
  );
}
