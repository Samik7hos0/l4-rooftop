const MENU = {
  Starters: [
    ["Paneer Tikka", "₹220"],
    ["Chicken Lollipop", "₹260"],
  ],
  Mains: [
    ["Butter Chicken", "₹320"],
    ["Veg Alfredo Pasta", "₹280"],
  ],
  Beverages: [
    ["Mocktails", "₹150+"],
    ["Cold Coffee", "₹140"],
  ],
};

export default function MenuGrid() {
  return (
    <div className="grid md:grid-cols-3 gap-10">
      {Object.entries(MENU).map(([cat, items]) => (
        <div key={cat}>
          <h3 className="text-xl mb-4 text-[var(--primary)]">{cat}</h3>
          <ul className="space-y-3">
            {items.map(([name, price]) => (
              <li
                key={name}
                className="flex justify-between border-b border-zinc-800 pb-2"
              >
                <span>{name}</span>
                <span className="text-zinc-400">{price}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
