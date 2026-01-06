"use client";

import { useEffect, useState } from "react";

export default function ReservationForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
  });

  const [minDate, setMinDate] = useState("");
  const [minTime, setMinTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ⏰ Set minimum date & time
  useEffect(() => {
    const now = new Date();

    const today = now.toISOString().split("T")[0];
    setMinDate(today);

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    setMinTime(`${hours}:${minutes}`);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });

    // Reset time if date changes
    if (e.target.name === "date") {
      setForm((prev) => ({ ...prev, time: "" }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          guests: Number(form.guests),
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.nextAvailable) {
          setMessage(
            `❌ Slot full. Next available time: ${result.nextAvailable}`
          );
        } else {
          setMessage(`❌ ${result.error}`);
        }
        setLoading(false);
        return;
      }

      setMessage("✅ Reservation confirmed!");
      setForm({
        name: "",
        phone: "",
        date: "",
        time: "",
        guests: "",
      });
    } catch {
      setMessage("❌ Network error. Please try again.");
    }

    setLoading(false);
  }

  const isToday = form.date === minDate;

  return (
    <section className="py-20 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-black/70 p-8 rounded-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-3xl text-center text-[var(--primary)]">
          Reserve a Table
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-3 rounded bg-zinc-900"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full p-3 rounded bg-zinc-900"
        />

        {/* 📅 Date (no past dates) */}
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          min={minDate}
          required
          className="w-full p-3 rounded bg-zinc-900"
        />

        {/* ⏰ Time (no past time for today) */}
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          min={isToday ? minTime : undefined}
          required
          className="w-full p-3 rounded bg-zinc-900"
        />

        <input
          type="number"
          name="guests"
          placeholder="Number of Guests"
          value={form.guests}
          onChange={handleChange}
          min={1}
          required
          className="w-full p-3 rounded bg-zinc-900"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--primary)] text-black py-3 rounded font-semibold"
        >
          {loading ? "Booking..." : "Confirm Reservation"}
        </button>

        {message && (
          <p className="text-center mt-2 text-sm">{message}</p>
        )}
      </form>
    </section>
  );
}
