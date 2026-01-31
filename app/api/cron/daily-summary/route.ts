import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Reservation from "@/models/Reservation";

const SLOT_CAPACITY = 20;

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

    const slots: Record<string, number> = {};
    reservations.forEach((r) => {
      slots[r.time] = (slots[r.time] || 0) + r.guests;
    });

    let peakSlot = "—";
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

    const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    if (!whatsapp) {
      return NextResponse.json(
        { error: "WhatsApp number not configured" },
        { status: 500 }
      );
    }

    const message = `
📊 L4 Rooftop — Daily Summary

📅 Date: ${today.toISOString().split("T")[0]}

• Total Reservations: ${totalReservations}
• Total Guests: ${totalGuests}
• Peak Slot: ${peakSlot}
• Seats Remaining (min): ${availableSeats}

— L4 Admin System
    `.trim();

    return NextResponse.json({
      success: true,
      whatsappURL: `https://wa.me/${whatsapp}?text=${encodeURIComponent(
        message
      )}`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
