import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Reservation from "@/models/Reservation";
import { sendReservationConfirmation } from "@/lib/whatsapp";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    if (reservation.status !== "confirmed") {
      return NextResponse.json(
        { error: "Reservation not confirmed yet" },
        { status: 400 }
      );
    }

    await sendReservationConfirmation({
      name: reservation.name,
      phone: reservation.phone,
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to resend confirmation" },
      { status: 500 }
    );
  }
}
