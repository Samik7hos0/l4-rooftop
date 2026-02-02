"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/gallery", label: "Gallery" },
  { href: "/reservation", label: "Reservation" },
  { href: "/contact", label: "Contact" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-neutral-950/90 border-b border-neutral-800/80">
      <nav
        className="max-w-7xl mx-auto px-[var(--space-page-x)] py-4 flex items-center justify-between gap-4"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="text-sm font-semibold tracking-wide text-white transition-premium hover:text-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm min-h-[44px] inline-flex items-center"
        >
          L4 Rooftop
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-1" role="menubar">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              role="menuitem"
              className={`min-h-[44px] inline-flex items-center px-4 py-2 rounded-md text-sm transition-premium focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                pathname === href
                  ? "text-[var(--primary)] font-medium"
                  : "text-neutral-400 hover:text-neutral-100"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="nav-menu-mobile"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md text-neutral-400 hover:text-white transition-premium focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {menuOpen ? (
            <span className="text-xl" aria-hidden>×</span>
          ) : (
            <span className="text-xl" aria-hidden>☰</span>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="nav-menu-mobile"
        className={`md:hidden border-t border-neutral-800/80 ${menuOpen ? "block" : "hidden"}`}
        role="menu"
      >
        <div className="max-w-7xl mx-auto px-[var(--space-page-x)] py-3 flex flex-col gap-0.5">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              role="menuitem"
              onClick={() => setMenuOpen(false)}
              className={`min-h-[44px] inline-flex items-center px-4 rounded-md text-sm transition-premium focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                pathname === href
                  ? "text-[var(--primary)] font-medium bg-white/5"
                  : "text-neutral-400 hover:text-neutral-100 hover:bg-white/5"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
