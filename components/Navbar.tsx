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
      {/* ================= DESKTOP ================= */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:block">
        <nav
          className="
            flex items-center gap-6
            px-6 py-3
            rounded-full
            bg-black/60
            backdrop-blur-xl
            border border-white/10
          "
        >
          <span className="text-sm font-medium text-white">
            L4 Rooftop
          </span>

          <ul className="flex items-center gap-1 text-sm">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      px-4 py-1.5 rounded-full
                      transition-premium
                      ${
                        active
                          ? "bg-white/15 text-white"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      {/* ================= MOBILE ================= */}
      <header className="fixed top-0 inset-x-0 z-50 md:hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <Link href="/" className="text-sm font-medium text-white">
            L4 Rooftop
          </Link>

          <button
            onClick={() => setOpen(true)}
            className="px-3 py-2 rounded-lg text-white/70 hover:bg-white/10"
          >
            ☰
          </button>
        </div>
      </header>

      {/* ================= MOBILE DRAWER ================= */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
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
              p-6 space-y-4
            "
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">Menu</span>
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
                          ? "bg-white/15 text-white"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
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

      {/* Spacer */}
      <div className="h-20 md:h-28" />
    </>
  );
}
