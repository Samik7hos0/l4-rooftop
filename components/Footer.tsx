export default function Footer() {
  return (
    <footer
      className="max-w-6xl mx-auto px-[var(--space-page-x)] py-12 sm:py-14 text-sm text-neutral-500 border-t border-neutral-800/80"
      role="contentinfo"
    >
      <p>© {new Date().getFullYear()} L4 – Level Four Rooftop Restaurant</p>
    </footer>
  );
}
