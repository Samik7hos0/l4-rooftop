import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Reservation from "@/models/Reservation";

const SLOT_CAPACITY = 20;

/* ================= GET ================= */
export async function GET() {
  await connectDB();
  const reservations = await Reservation.find().sort({ createdAt: -1 });
  return NextResponse.json(reservations);
}

/* ================= POST ================= */
export async function POST(req: Request) {
  try {
    await connectDB();

    const {
      name,
      phone,
      date,
      time,
      guests,
      note,
      specialRequest,
    } = await req.json();

    if (!name || !phone || !date || !time || !guests) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // SLOT CHECK
    const existing = await Reservation.find({ date, time });
    const totalGuests = existing.reduce(
      (sum: number, r: any) => sum + r.guests,
      0
    );

    if (totalGuests + guests > SLOT_CAPACITY) {
      return NextResponse.json(
        { error: "Slot is full" },
        { status: 409 }
      );
    }

    // AUTO CONFIRM LOGIC
    const bookingDate = new Date(date);
    const weekday = bookingDate.getDay();
    const isWeekday = weekday >= 1 && weekday <= 4;
    const autoConfirm = guests <= 4 && isWeekday;

    // ✅ NORMALIZE NOTE
    const finalNote = note || specialRequest || "";

    const reservation = await Reservation.create({
      name,
      phone,
      date,
      time,
      guests,
      note: finalNote,
      specialRequest: finalNote,
      status: autoConfirm ? "confirmed" : "pending",
    });

    return NextResponse.json({
      success: true,
      status: reservation.status,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Reservation failed" },
      { status: 500 }
    );
  }
}

/* ================= PATCH ================= */
export async function PATCH(req: Request) {
  await connectDB();
  const { id } = await req.json();

  await Reservation.findByIdAndUpdate(id, {
    status: "confirmed",
  });

  return NextResponse.json({ success: true });
}

/* ================= DELETE ================= */
export async function DELETE(req: Request) {
  await connectDB();
  const { id } = await req.json();

  await Reservation.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
