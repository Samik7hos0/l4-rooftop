import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";

export const metadata = {
  metadataBase: new URL("https://l4-rooftop.vercel.app"),
  title: {
    default: "L4 – Level Four Rooftop Restaurant | Dharmanagar",
    template: "%s | L4 Rooftop Restaurant",
  },
  description:
    "L4 – Level Four Rooftop Restaurant in Dharmanagar offering premium rooftop dining, curated cuisine, and unforgettable evening ambience.",
  openGraph: {
    title: "L4 – Level Four Rooftop Restaurant",
    description:
      "Premium rooftop dining experience in Dharmanagar, Tripura.",
    url: "https://l4-rooftop.vercel.app",
    siteName: "L4 Rooftop Restaurant",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "L4 – Level Four Rooftop Restaurant",
    description:
      "Premium rooftop dining experience in Dharmanagar, Tripura.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        {/* Top Navigation */}
        <Navbar />

        {/* Page Content */}
        <main className="min-h-screen">{children}</main>

        {/* Footer */}
        <Footer />

        {/* Floating WhatsApp & Call Actions */}
        <FloatingActions />
      </body>
    </html>
  );
}
