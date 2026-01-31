export type WhatsAppPayload = {
  to: string;
  message: string;
};

export async function sendWhatsApp({
  to,
  message,
}: WhatsAppPayload) {
  if (process.env.ENABLE_WHATSAPP !== "true") {
    console.log("📴 WhatsApp DISABLED (preview mode)");
    console.log("To:", to);
    console.log("Message:");
    console.log(message);
    return { sent: false, preview: true };
  }

  const provider = process.env.WHATSAPP_PROVIDER;

  if (!provider || provider === "stub") {
    console.log("🧪 WhatsApp STUB MODE");
    console.log("To:", to);
    console.log(message);
    return { sent: true, stub: true };
  }

  throw new Error("WhatsApp provider not configured");
}

export async function sendReservationConfirmation({
  name,
  phone,
  date,
  time,
  guests,
}: {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
}) {
  const message = `
✅ Reservation Confirmed – L4 Rooftop

Hello ${name},

Your table is confirmed.

📅 Date: ${date}
⏰ Time: ${time}
👥 Guests: ${guests}

We look forward to hosting you ✨
`.trim();

  return sendWhatsApp({
    to: phone,
    message,
  });
}
