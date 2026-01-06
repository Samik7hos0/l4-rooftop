import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Reservation from "@/models/Reservation";

const MAX_GUESTS_PER_SLOT = 20;

export async function GET() {
  await connectDB();

  const reservations = await Reservation.find();

  const slotMap: Record<
    string,
    {
      date: string;
      time: string;
      booked: number;
    }
  > = {};

  reservations.forEach((r: any) => {
    const key = `${r.date}_${r.time}`;
    if (!slotMap[key]) {
      slotMap[key] = {
        date: r.date,
        time: r.time,
        booked: 0,
      };
    }
    slotMap[key].booked += r.guests;
  });

  const slots = Object.values(slotMap).map((slot) => ({
    ...slot,
    remaining: Math.max(MAX_GUESTS_PER_SLOT - slot.booked, 0),
    full: slot.booked >= MAX_GUESTS_PER_SLOT,
  }));

  return NextResponse.json(slots);
}
