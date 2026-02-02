export const metadata = {
  title: "Menu",
  description:
    "Explore the curated menu at L4 Rooftop Restaurant – Indian, Continental and signature dishes.",
};

import MenuGrid from "@/components/MenuGrid";

export default function MenuPage() {
  return (
    <main className="min-h-screen max-w-6xl mx-auto px-[var(--space-page-x)] py-12 sm:py-16 lg:py-20" role="main">
      <header className="mb-10 lg:mb-12">
        <h1 className="text-3xl sm:text-4xl font-semibold text-[var(--primary)] tracking-tight">
          Our Menu
        </h1>
        <p className="mt-2 text-neutral-500 text-sm sm:text-base">
          Curated dishes for rooftop dining
        </p>
      </header>
      <MenuGrid />
    </main>
  );
}
