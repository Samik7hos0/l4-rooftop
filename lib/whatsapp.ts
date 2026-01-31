// lib/whatsapp.ts

export type WhatsAppPayload = {
  to: string;
  message: string;
};

export async function sendWhatsApp({
  to,
  message,
}: WhatsAppPayload) {
  // Feature flag (OFF by default)
  if (process.env.ENABLE_WHATSAPP !== "true") {
    console.log("📴 WhatsApp DISABLED (preview mode)");
    console.log("To:", to);
    console.log("Message:");
    console.log(message);
    return {
      sent: false,
      preview: true,
    };
  }

  // Future providers (Meta / Twilio)
  const provider = process.env.WHATSAPP_PROVIDER;

  if (!provider || provider === "stub") {
    console.log("🧪 WhatsApp STUB PROVIDER");
    console.log("To:", to);
    console.log(message);
    return {
      sent: true,
      stub: true,
    };
  }

  // Safety net
  throw new Error("WhatsApp provider not configured");
}
