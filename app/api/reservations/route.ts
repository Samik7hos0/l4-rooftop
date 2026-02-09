import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Reservation from "@/models/Reservation";
import { sendReservationConfirmation } from "@/lib/whatsapp";

/* 🔔 ADMIN LIVE NOTIFICATION */
import { notifyAdmins } from "../notifications/route";
import { notifyAdmins as notifyAdminStream } from "@/lib/admin-notification-stream";

const SLOT_CAPACITY = 20;
const MAX_GUESTS = 20;
const MIN_GUESTS = 1;

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

function notFound(error: string = "Not found") {
  return NextResponse.json({ error }, { status: 404 });
}

function serverError(error: string = "Reservation failed") {
  return NextResponse.json({ error }, { status: 500 });
}

/** Validate and normalize POST body */
function validatePostBody(body: unknown): {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  note: string;
} | null {
  if (!body || typeof body !== "object") return null;

  const b = body as Record<string, unknown>;

  const name = typeof b.name === "string" ? b.name.trim() : "";
  const phone =
    typeof b.phone === "string"
      ? b.phone.trim().replace(/\s/g, "")
      : "";
  const date = typeof b.date === "string" ? b.date.trim() : "";
  const time = typeof b.time === "string" ? b.time.trim() : "";
  const guests =
    typeof b.guests === "number" ? b.guests : Number(b.guests);
  const note =
    typeof b.note === "string"
      ? b.note.trim()
      : typeof b.specialRequest === "string"
      ? b.specialRequest.trim()
      : "";

  if (!name || !phone || !date || !time) return null;
  if (!Number.isInteger(guests) || guests < MIN_GUESTS || guests > MAX_GUESTS)
    return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;

  return { name, phone, date, time, guests, note };
}

/** GET – list reservations (admin) */
export async function GET() {
  try {
    await connectDB();
    const reservations = await Reservation.find()
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(reservations);
  } catch (err) {
    console.error("[reservations GET]", err);
    return serverError();
  }
}

/** POST – create reservation */
export async function POST(req: Request) {
  try {
    await connectDB();

    const raw = await req.json().catch(() => null);
    const payload = validatePostBody(raw);

    if (!payload) {
      return badRequest(
        "Missing or invalid fields: name, phone, date, time, guests (1–20)."
      );
    }

    const { name, phone, date, time, guests, note } = payload;

    const existing = await Reservation.find({ date, time }).lean();
    const totalGuests = existing.reduce(
      (sum, r) => sum + (r.guests ?? 0),
      0
    );

    if (totalGuests + guests > SLOT_CAPACITY) {
      return NextResponse.json(
        { error: "This time slot is full. Please choose another time." },
        { status: 409 }
      );
    }

    const bookingDate = new Date(date);
    const weekday = bookingDate.getDay();
    const isWeekday = weekday >= 1 && weekday <= 4;
    const autoConfirm = guests <= 4 && isWeekday;

    const reservation = await Reservation.create({
      name,
      phone,
      date,
      time,
      guests,
      note,
      specialRequest: note,
      status: autoConfirm ? "confirmed" : "pending",
    });

    /* 🔔 INSTANT ADMIN NOTIFICATION */
    notifyAdmins({
      type: "new-reservation",
      id: reservation._id,
      name,
      guests,
      date,
      time,
      status: reservation.status,
    });
    notifyAdminStream({ name, date, time, guests, status: reservation.status });

    if (autoConfirm) {
      try {
        await sendReservationConfirmation({
          name,
          phone,
          date,
          time,
          guests,
        });
      } catch (e) {
        console.error(
          "[reservations POST] WhatsApp send failed",
          e
        );
      }
    }

    return NextResponse.json({
      success: true,
      status: reservation.status,
    });
  } catch (err) {
    console.error("[reservations POST]", err);
    return serverError();
  }
}

/** PATCH – confirm reservation */
export async function PATCH(req: Request) {
  try {
    await connectDB();

    const body = await req.json().catch(() => ({}));
    const id = typeof body.id === "string" ? body.id.trim() : "";

    if (!id) return badRequest("Missing reservation id.");

    const reservation = await Reservation.findById(id).lean();
    if (!reservation) return notFound("Reservation not found.");

    if (reservation.status === "confirmed") {
      return NextResponse.json({
        success: true,
        alreadyConfirmed: true,
      });
    }

    await Reservation.findByIdAndUpdate(id, {
      status: "confirmed",
      notified: true,
    });

    try {
      await sendReservationConfirmation({
        name: reservation.name,
        phone: reservation.phone,
        date: reservation.date,
        time: reservation.time,
        guests: reservation.guests,
      });
    } catch (e) {
      console.error(
        "[reservations PATCH] WhatsApp send failed",
        e
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[reservations PATCH]", err);
    return serverError();
  }
}

/** DELETE – remove reservation */
export async function DELETE(req: Request) {
  try {
    await connectDB();

    const body = await req.json().catch(() => ({}));
    const id = typeof body.id === "string" ? body.id.trim() : "";

    if (!id) return badRequest("Missing reservation id.");

    const deleted = await Reservation.findByIdAndDelete(id);
    if (!deleted) return notFound("Reservation not found.");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[reservations DELETE]", err);
    return serverError();
  }
}
