import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Reservation from "@/models/Reservation";

const MAX_GUESTS_PER_SLOT = 20;

// 🔍 Helper: check slot capacity
async function slotHasSpace(
  date: string,
  time: string,
  guests: number
) {
  const existing = await Reservation.find({ date, time });
  const totalGuests = existing.reduce(
    (sum: number, r: any) => sum + r.guests,
    0
  );
  return totalGuests + guests <= MAX_GUESTS_PER_SLOT;
}

// ⏰ Helper: check past date/time
function isPastDateTime(date: string, time: string) {
  const now = new Date();
  const selected = new Date(`${date}T${time}`);
  return selected.getTime() < now.getTime();
}

// ➕ CREATE RESERVATION
export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectDB();

    // ❌ Reject past date/time
    if (isPastDateTime(data.date, data.time)) {
      return NextResponse.json(
        { error: "You cannot book for a past date or time." },
        { status: 400 }
      );
    }

    // 1️⃣ Check requested slot capacity
    const available = await slotHasSpace(
      data.date,
      data.time,
      data.guests
    );

    if (!available) {
      // 2️⃣ Auto-suggest next 4 slots
      const [hour, minute] = data.time.split(":").map(Number);

      for (let i = 1; i <= 4; i++) {
        const nextHour = (hour + i) % 24;
        const nextTime = `${String(nextHour).padStart(2, "0")}:${String(
          minute
        ).padStart(2, "0")}`;

        // Skip past suggestions
        if (isPastDateTime(data.date, nextTime)) continue;

        const hasSpace = await slotHasSpace(
          data.date,
          nextTime,
          data.guests
        );

        if (hasSpace) {
          return NextResponse.json(
            {
              error: "Slot is fully booked.",
              nextAvailable: nextTime,
            },
            { status: 400 }
          );
        }
      }

      return NextResponse.json(
        { error: "All nearby time slots are fully booked." },
        { status: 400 }
      );
    }

    // 3️⃣ Save booking
    await Reservation.create(data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Reservation failed" },
      { status: 500 }
    );
  }
}

// 📖 READ (ADMIN)
export async function GET() {
  await connectDB();
  const reservations = await Reservation.find().sort({ createdAt: -1 });
  return NextResponse.json(reservations);
}

// ✅ CONFIRM
export async function PATCH(req: Request) {
  const { id } = await req.json();
  await connectDB();
  await Reservation.findByIdAndUpdate(id, { confirmed: true });
  return NextResponse.json({ success: true });
}

// 🗑️ DELETE
export async function DELETE(req: Request) {
  const { id } = await req.json();
  await connectDB();
  await Reservation.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
