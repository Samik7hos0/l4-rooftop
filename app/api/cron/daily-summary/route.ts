import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Reservation from "@/models/Reservation";
import { sendWhatsApp } from "@/lib/whatsapp";

export async function GET() {
  try {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const reservations = await Reservation.find({
      date: {
        $gte: today.toISOString().split("T")[0],
        $lt: tomorrow.toISOString().split("T")[0],
      },
    });

    const totalReservations = reservations.length;
    const totalGuests = reservations.reduce(
      (sum, r) => sum + r.guests,
      0
    );

    const SLOT_CAPACITY = 20;
    const slots: Record<string, number> = {};

    reservations.forEach((r) => {
      slots[r.time] = (slots[r.time] || 0) + r.guests;
    });

    let peakSlot = "None";
    let peakGuests = 0;
    let availableSeats = SLOT_CAPACITY;

    Object.entries(slots).forEach(([time, guests]) => {
      if (guests > peakGuests) {
        peakGuests = guests;
        peakSlot = time;
      }
      availableSeats = Math.min(
        availableSeats,
        SLOT_CAPACITY - guests
      );
    });

    const message = `
📊 L4 Rooftop – Today’s Summary

• Total Reservations: ${totalReservations}
• Total Guests: ${totalGuests}
• Peak Slot: ${peakSlot}
• Available Seats Left: ${availableSeats}

Have a great evening 🌆
`.trim();

    await sendWhatsApp({
      to: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER!,
      message,
    });

    return NextResponse.json({
      success: true,
      preview: process.env.ENABLE_WHATSAPP !== "true",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Daily summary failed" },
      { status: 500 }
    );
  }
}
