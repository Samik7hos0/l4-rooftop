"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reservation", href: "/reservation" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ================= DESKTOP NAV ================= */}
      <header className="fixed top-0 inset-x-0 z-50 hidden md:block">
        <nav
          className="
            mx-auto max-w-7xl
            mt-4
            px-6
          "
        >
          <div
            className="
              flex items-center justify-between
              rounded-full
              bg-black/80
              backdrop-blur-xl
              border border-white/10
              shadow-[0_4px_24px_rgba(0,0,0,0.4)]
              px-6 py-3
            "
          >
            {/* Brand */}
            <Link
              href="/"
              className="text-sm font-semibold tracking-tight text-white"
            >
              L4 Rooftop
            </Link>

            {/* Nav Items */}
            <div className="flex items-center gap-2">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      px-4 py-2 rounded-full text-sm
                      transition-premium
                      ${
                        active
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* ================= MOBILE NAV ================= */}
      <header className="fixed top-0 inset-x-0 z-50 md:hidden">
        <div
          className="
            flex items-center justify-between
            px-5 py-4
            bg-black/90 backdrop-blur-xl
            border-b border-white/10
          "
        >
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-white"
          >
            L4 Rooftop
          </Link>

          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="
              rounded-lg
              px-3 py-2
              text-white/80
              hover:bg-white/10
              transition
            "
          >
            ☰
          </button>
        </div>
      </header>

      {/* ================= MOBILE DRAWER ================= */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              absolute right-4 top-4
              w-[88%] max-w-sm
              rounded-2xl
              bg-black
              border border-white/10
              p-6
              space-y-4
            "
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`
                      px-4 py-3 rounded-xl text-sm
                      transition-premium
                      ${
                        active
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Spacer so content doesn’t hide under navbar */}
      <div className="h-20 md:h-28" />
    </>
  );
}
