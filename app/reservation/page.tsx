"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, startOfDay } from "date-fns";
import { RESERVATION_TIME_SLOTS } from "@/lib/reservation";
import "react-day-picker/dist/style.css";

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export default function ReservationPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");

  const today = startOfDay(new Date());

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!date) {
      setError("Please select a date.");
      return;
    }

    if (!time) {
      setError("Please select a time.");
      return;
    }

    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: (formData.get("name") as string)?.trim(),
      phone: (formData.get("phone") as string)?.trim(),
      date: format(date, "yyyy-MM-dd"),
      time,
      guests: Number(formData.get("guests")),
      note: (formData.get("note") as string)?.trim() || "",
    };

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError((data.error as string) || "Unable to place reservation. Please try again.");
        setLoading(false);
        return;
      }

      sessionStorage.setItem("reservation", JSON.stringify(payload));
      window.location.href = "/reservation-success";
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const inputClass =
    "w-full min-h-[44px] rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-3 text-white placeholder:text-neutral-500 transition-premium focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-black focus:border-[var(--primary)]";

  return (
    <main
      className="min-h-screen flex justify-center px-[var(--space-page-x)] py-12 sm:py-16 lg:py-20"
      role="main"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl space-y-6 bg-neutral-900/80 border border-neutral-800 p-6 sm:p-8 rounded-2xl"
        aria-label="Reservation form"
        noValidate
      >
        <header className="text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Reserve a Table
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Open 5:30 PM – 11:30 PM
          </p>
        </header>

        {error && (
          <p
            className="text-sm text-red-400 text-center py-2 px-3 rounded-lg bg-red-500/10"
            role="alert"
          >
            {error}
          </p>
        )}

        <div>
          <label htmlFor="res-name" className="premium-label">
            Full Name
          </label>
          <input
            id="res-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            className={inputClass}
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="res-phone" className="premium-label">
            Phone Number
          </label>
          <input
            id="res-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="10-digit mobile number"
            className={inputClass}
            disabled={loading}
          />
        </div>

        <div>
          <label className="premium-label">Date</label>
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 [&_.rdp]:mx-auto">
            <DayPicker
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={{ before: today }}
              fromMonth={today}
              aria-label="Pick a date"
            />
          </div>
        </div>

        <div>
          <label htmlFor="res-time" className="premium-label">
            Time
          </label>
          <select
            id="res-time"
            name="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={inputClass}
            disabled={loading}
            aria-describedby="res-time-hint"
          >
            <option value="">Select time</option>
            {RESERVATION_TIME_SLOTS.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
          <p id="res-time-hint" className="sr-only">
            Restaurant is open 5:30 PM to 11:00 PM
          </p>
        </div>

        <div>
          <label htmlFor="res-guests" className="premium-label">
            Number of Guests
          </label>
          <select
            id="res-guests"
            name="guests"
            required
            className={inputClass}
            disabled={loading}
          >
            {GUEST_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "Guest" : "Guests"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="res-note" className="premium-label">
            Special request <span className="text-neutral-600">(optional)</span>
          </label>
          <textarea
            id="res-note"
            name="note"
            rows={3}
            placeholder="Dietary needs, occasion, etc."
            className={`${inputClass} min-h-[100px] resize-y`}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full min-h-[48px] rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold hover:opacity-90 transition-premium focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Booking…" : "Confirm Reservation"}
        </button>
      </form>
    </main>
  );
}
