import { MENU_CATEGORIES } from "@/lib/menu";

export default function MenuGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
      {MENU_CATEGORIES.map((category) => (
        <section
          key={category.id}
          className="space-y-4"
          aria-labelledby={`menu-${category.id}`}
        >
          <h2
            id={`menu-${category.id}`}
            className="text-lg sm:text-xl font-semibold text-[var(--primary)] tracking-tight"
          >
            {category.name}
          </h2>
          <ul className="space-y-0" role="list">
            {category.items.map((item) => (
              <li
                key={item.name}
                className="flex justify-between gap-4 py-3 border-b border-neutral-800 last:border-0"
              >
                <span className="text-neutral-200 font-medium">{item.name}</span>
                <span className="text-neutral-500 shrink-0 tabular-nums">
                  {item.price}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
