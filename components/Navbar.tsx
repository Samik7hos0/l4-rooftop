"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [activeRect, setActiveRect] = useState<DOMRect | null>(null);

  const navRef = useRef<HTMLUListElement>(null);
  const lastScroll = useRef(0);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  /* ================= SCROLL AWARE ================= */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 16);

      if (y > lastScroll.current && y > 120) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastScroll.current = y;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= ACTIVE INDICATOR ================= */
  useEffect(() => {
    if (!expanded) {
      setActiveRect(null);
      return;
    }

    const el = navRef.current?.querySelector(
      `[data-href="${pathname}"]`
    ) as HTMLElement | null;

    if (el && navRef.current) {
      setActiveRect(el.getBoundingClientRect());
    }
  }, [pathname, expanded]);

  /* ================= IDLE SHRINK ================= */
  function triggerIdle() {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      setExpanded(false);
      setActiveRect(null);
    }, 3000);
  }

  function expandNav() {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    setExpanded(true);
  }

  /* ================= MAGNETIC ================= */
  function onMouseMove(
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) {
    if (!expanded) return;

    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    el.style.transform = `translate3d(${x * 0.06}px, ${y * 0.1}px, 0)`;
  }

  function resetMagnet(e: React.MouseEvent<HTMLAnchorElement>) {
    e.currentTarget.style.transform = "translate3d(0,0,0)";
  }

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <header
        className={`
          hidden md:flex fixed top-0 inset-x-0 z-50 justify-center
          pointer-events-none
          transition-all duration-300
          ${hidden ? "-translate-y-24 opacity-0" : "translate-y-0 opacity-100"}
        `}
      >
        <nav
          onMouseEnter={expandNav}
          onMouseLeave={triggerIdle}
          className={`
            pointer-events-auto
            mt-5
            flex items-center gap-7
            ${expanded ? "px-7 py-3.5" : "px-5 py-2"}
            rounded-full
            backdrop-blur-2xl
            border border-white/10
            shadow-[0_12px_50px_rgba(0,0,0,0.5)]
            transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
            bg-black/${scrolled ? "85" : "65"}
            ${expanded ? "hover:px-9 hover:py-4" : ""}
          `}
        >
          {/* BRAND */}
          <Link
            href="/"
            className="text-sm font-semibold text-white tracking-wide pr-2"
          >
            L4
          </Link>

          {/* NAV ITEMS */}
          <ul
            ref={navRef}
            className="flex items-center gap-1 relative"
          >
            {/* SLIDING UNDERLINE — ONLY WHEN EXPANDED */}
            {expanded && activeRect && navRef.current && (
              <span
                className="absolute bottom-0 h-[2px] rounded-full bg-white transition-all duration-300"
                style={{
                  width: activeRect.width,
                  left:
                    activeRect.left -
                    navRef.current.getBoundingClientRect().left,
                }}
              />
            )}

            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    data-href={item.href}
                    onMouseEnter={(e) => {
                      if (!expanded) return;
                      setActiveRect(
                        (e.currentTarget as HTMLElement).getBoundingClientRect()
                      );
                    }}
                    onMouseMove={onMouseMove}
                    onMouseLeave={resetMagnet}
                    className={`
                      relative
                      ${expanded ? "px-4 py-1.5" : "px-2 py-1"}
                      text-sm
                      transition-all duration-200
                      ${
                        expanded
                          ? active
                            ? "text-white"
                            : "text-white/65 hover:text-white"
                          : "text-white/50"
                      }
                    `}
                  >
                    {expanded ? item.label : "•"}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      {/* ================= MOBILE ================= */}
      <header className="md:hidden fixed top-0 inset-x-0 z-50 px-5 pt-4">
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-lg">
          <Link href="/" className="text-sm font-semibold text-white">
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
            className="absolute right-4 top-4 w-[88%] max-w-sm rounded-2xl bg-black border border-white/10 p-6 space-y-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">Menu</span>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm ${
                      active
                        ? "bg-white/15 text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
