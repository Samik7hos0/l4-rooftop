import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-neutral-950/80 border-b border-neutral-800">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold tracking-wide transition-premium hover:text-white">
          L4 Rooftop
        </Link>

        <div className="hidden md:flex gap-8 text-sm text-neutral-400">
          <Link href="/" className="hover:text-neutral-100 transition-premium">
            Home
          </Link>
          <Link href="/menu" className="hover:text-neutral-100 transition-premium">
            Menu
          </Link>
          <Link href="/gallery" className="hover:text-neutral-100 transition-premium">
            Gallery
          </Link>
          <Link href="/reservation" className="hover:text-neutral-100 transition-premium">
            Reservation
          </Link>
          <Link href="/contact" className="hover:text-neutral-100 transition-premium">
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}
