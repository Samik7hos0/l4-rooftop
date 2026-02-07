"use client";

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="
        relative
        mt-40
        bg-black/55
        backdrop-blur-2xl
        border-t border-white/10
      "
    >
      {/* Ambient top glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      {/* Depth shadow (VisionOS-style) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/40 to-transparent" />

      <div
        className="
          max-w-7xl mx-auto
          px-[var(--space-page-x)]
          py-14 sm:py-16
          flex flex-col gap-12
        "
      >
        {/* Top row */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
          {/* Brand block */}
          <div className="space-y-3 max-w-md">
            <p className="text-sm font-semibold tracking-wide text-white">
              L4 Rooftop
            </p>

            <p className="text-sm text-white/55 leading-relaxed">
              Level Four Rooftop Restaurant — a calm, elevated dining experience
              above the city. Designed for unhurried evenings and meaningful
              moments.
            </p>
          </div>

          {/* Navigation */}
          <nav
            aria-label="Footer navigation"
            className="
              grid grid-cols-2 sm:flex
              gap-x-8 gap-y-4
              text-sm
            "
          >
            <FooterLink href="/menu">Menu</FooterLink>
            <FooterLink href="/gallery">Gallery</FooterLink>
            <FooterLink href="/reservation">Reservation</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </nav>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs text-white/40 tracking-wide">
            © {new Date().getFullYear()} L4 — Level Four Rooftop Restaurant
          </p>

          <p className="text-xs text-white/35 tracking-wide">
            Dharmanagar, Tripura · Crafted with restraint
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Sub component ---------- */

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="
        relative
        inline-block
        text-white/60
        transition-all duration-200 ease-out
        hover:text-white
        after:absolute
        after:left-0
        after:-bottom-1
        after:h-[1px]
        after:w-0
        after:bg-white/70
        after:transition-all
        after:duration-300
        after:ease-[cubic-bezier(0.22,1,0.36,1)]
        hover:after:w-full
      "
    >
      {children}
    </a>
  );
}
