import cron from "node-cron";
import { generateDailySummary } from "@/lib/dailySummary";

let started = false;

export function startDailyCron() {
  if (started) return;
  started = true;

  cron.schedule(
    "0 18 * * *", // 6:00 PM IST
    async () => {
      try {
        const { whatsappURL } = await generateDailySummary();
        console.log("📲 Daily WhatsApp Summary:", whatsappURL);
      } catch (err) {
        console.error("Cron failed:", err);
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
}
