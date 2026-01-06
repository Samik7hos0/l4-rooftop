import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  metadataBase: new URL("https://l4rooftop.com"),
  title: {
    default: "L4 – Level Four Rooftop Restaurant | Dharmanagar",
    template: "%s | L4 Rooftop Restaurant",
  },
  description:
    "L4 – Level Four Rooftop Restaurant in Dharmanagar offers premium rooftop dining, curated cuisine, and stunning evening ambience.",
  openGraph: {
    title: "L4 – Level Four Rooftop Restaurant",
    description:
      "Premium rooftop dining experience in Dharmanagar, Tripura.",
    url: "https://l4rooftop.com",
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
      <body className="bg-black text-white">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
