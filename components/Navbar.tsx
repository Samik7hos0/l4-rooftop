import Link from "next/link";

export default function Navbar() {
  return (
    <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
      <Link href="/" className="text-lg font-semibold">
        L4 Rooftop
      </Link>

      <nav className="hidden md:flex gap-8 text-sm">
        <Link href="/">Home</Link>
        <Link href="/menu">Menu</Link>
        <Link href="/gallery">Gallery</Link>
        <Link href="/reservation">Reservation</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </header>
  );
}
