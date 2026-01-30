import "./globals.css";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import CallButton from "@/components/CallButton";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-neutral-100">
        <Navbar />
        {children}

        {/* MUST be last */}
        <WhatsAppButton />
        <CallButton />
      </body>
    </html>
  );
}
