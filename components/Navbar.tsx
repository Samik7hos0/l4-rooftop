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
  const [idle, setIdle] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [activeRect, setActiveRect] = useState<DOMRect | null>(null);

  const navRef = useRef<HTMLUListElement>(null);
  const lastScroll = useRef(0);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  /* ================= IDLE AUTO-DOCK ================= */
  function resetIdle() {
    setIdle(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIdle(true), 3000);
  }

  useEffect(() => {
    resetIdle();
    window.addEventListener("mousemove", resetIdle);
    window.addEventListener("touchstart", resetIdle);
    return () => {
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("touchstart", resetIdle);
    };
  }, []);

  /* ================= SCROLL AWARE ================= */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);

      if (y > lastScroll.current && y > 120) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastScroll.current = y;
      resetIdle();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= ACTIVE INDICATOR ================= */
  useEffect(() => {
    if (!hoveredHref && navRef.current) {
      const el = navRef.current.querySelector(
        `[data-href="${pathname}"]`
      ) as HTMLElement | null;

      if (el) setActiveRect(el.getBoundingClientRect());
    }
  }, [pathname, hoveredHref]);

  /* ================= MAGNETIC CURSOR ================= */
  function onMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (idle) return;

    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    el.style.transform = `translate3d(${x * 0.08}px, ${y * 0.12}px, 0)`;
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
          ${hidden ? "-translate-y-28 opacity-0" : "translate-y-0 opacity-100"}
        `}
      >
        <nav
          onMouseEnter={() => {
            resetIdle();
            setHoveredHref(null);
          }}
          onMouseLeave={() => {
            setHoveredHref(null);
          }}
          className={`
            pointer-events-auto
            mt-5
            flex items-center gap-6
            ${idle ? "px-6" : "px-9"}
            ${scrolled ? "py-2.5" : "py-3.5"}
            rounded-full
            backdrop-blur-2xl
            border border-white/10
            transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
            bg-black/${scrolled ? "90" : "65"}
            shadow-[0_8px_40px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.05)]
            hover:shadow-[0_24px_70px_rgba(0,0,0,0.65)]
          `}
        >
          {/* BRAND */}
          <Link
            href="/"
            className={`text-sm font-semibold text-white tracking-wide transition-opacity ${
              idle ? "opacity-60" : "opacity-100"
            }`}
          >
            L4
          </Link>

          {/* NAV */}
          <ul ref={navRef} className="relative flex items-center gap-1">
            {/* SLIDING INDICATOR — only when active OR hovered */}
            {activeRect && (hoveredHref || pathname) && (
              <span
                className="absolute bottom-0 h-[2px] rounded-full bg-white transition-all duration-300"
                style={{
                  width: activeRect.width * 0.55,
                  left:
                    activeRect.left -
                    navRef.current!.getBoundingClientRect().left +
                    activeRect.width * 0.225,
                  opacity: hoveredHref || pathname ? 1 : 0,
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
                      setHoveredHref(item.href);
                      setActiveRect(
                        (e.currentTarget as HTMLElement).getBoundingClientRect()
                      );
                    }}
                    onMouseMove={onMouseMove}
                    onMouseLeave={(e) => {
                      resetMagnet(e);
                      setHoveredHref(null);
                    }}
                    className={`
                      relative
                      px-4 py-1.5 rounded-full
                      text-sm
                      transition-all duration-200
                      ${
                        active
                          ? "text-white"
                          : "text-white/65 hover:text-white"
                      }
                      2xl:px-3
                      ${
                        idle
                          ? "2xl:text-[0px]"
                          : "2xl:text-sm"
                      }
                    `}
                  >
                    <span className="2xl:inline">{item.label}</span>
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
