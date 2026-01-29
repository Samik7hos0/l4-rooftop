"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReservationForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: 2,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed");

      // ✅ NEXT.JS SAFE REDIRECT (IMPORTANT)
      const params = new URLSearchParams({
        name: form.name,
        date: form.date,
        time: form.time,
        guests: String(form.guests),
      });

      router.push(`/reservation-success?${params.toString()}`);
      return;
    } catch {
      setError(
        "This slot may have just filled up. Please try another time."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 w-full"
    >
      <h2 className="text-2xl mb-6 text-[var(--primary)]">
        Book a Table
      </h2>

      <input
        name="name"
        placeholder="Your Name"
        required
        value={form.name}
        onChange={handleChange}
        className="w-full mb-4 bg-black border border-zinc-700 rounded-lg px-4 py-3"
      />

      <input
        name="phone"
        placeholder="Phone Number"
        required
        value={form.phone}
        onChange={handleChange}
        className="w-full mb-4 bg-black border border-zinc-700 rounded-lg px-4 py-3"
      />

      <input
        type="date"
        name="date"
        required
        min={new Date().toISOString().split("T")[0]}
        value={form.date}
        onChange={handleChange}
        className="w-full mb-4 bg-black border border-zinc-700 rounded-lg px-4 py-3"
      />

      <input
        type="time"
        name="time"
        required
        value={form.time}
        onChange={handleChange}
        className="w-full mb-4 bg-black border border-zinc-700 rounded-lg px-4 py-3"
      />

      <select
        name="guests"
        value={form.guests}
        onChange={handleChange}
        className="w-full mb-6 bg-black border border-zinc-700 rounded-lg px-4 py-3"
      >
        {[1,2,3,4,5,6,7,8].map(n => (
          <option key={n} value={n}>{n} Guests</option>
        ))}
      </select>

      {error && (
        <p className="text-red-400 text-sm mb-4">{error}</p>
      )}

      <button
        disabled={loading}
        className="w-full bg-[var(--primary)] text-black py-3 rounded-lg font-semibold"
      >
        {loading ? "Booking..." : "Confirm Reservation"}
      </button>

      <p className="text-xs text-zinc-400 mt-4 text-center">
        Admin verified • WhatsApp confirmation
      </p>
    </form>
  );
}
