import { NextResponse } from "next/server";
import { startDailyCron } from "@/lib/cron";

export async function GET() {
  startDailyCron();
  return NextResponse.json({
    status: "Daily WhatsApp cron started",
  });
}
