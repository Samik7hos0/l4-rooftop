import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <Link
          href="/"
          className="text-xl font-semibold tracking-wide text-[var(--primary)]"
        >
          L4 Rooftop
        </Link>

        {/* NAV LINKS */}
        <div className="flex items-center gap-8 text-sm text-zinc-300">
          <Link href="/" className="hover:text-white transition">
            Home
          </Link>

          <Link href="/menu" className="hover:text-white transition">
            Menu
          </Link>

          <Link href="/gallery" className="hover:text-white transition">
            Gallery
          </Link>

          <Link href="/reservation" className="hover:text-white transition">
            Reservation
          </Link>

          <Link href="/contact" className="hover:text-white transition">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
