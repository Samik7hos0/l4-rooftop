export const metadata = {
  title: "Menu",
  description:
    "Explore the curated menu at L4 Rooftop Restaurant featuring Indian, Continental and signature dishes.",
};

import MenuGrid from "@/components/MenuGrid";

export default function MenuPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-4xl mb-10 text-[var(--primary)]">
        Our Menu
      </h1>
      <MenuGrid />
    </main>
  );
}
