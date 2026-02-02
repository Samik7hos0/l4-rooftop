import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientShell from "./ClientShell";

export const metadata: Metadata = {
  title: {
    default: "L4 Rooftop – Level Four Rooftop Restaurant",
    template: "%s | L4 Rooftop",
  },
  description:
    "Premium rooftop dining in Dharmanagar. Curated cuisine, city lights, and unforgettable evenings.",
  openGraph: {
    title: "L4 Rooftop – Level Four Rooftop Restaurant",
    description: "Premium rooftop dining in Dharmanagar.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-black text-white antialiased">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
