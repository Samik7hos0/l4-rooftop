"use client";

export default function MenuPage() {
  return (
    <main className="bg-black text-white">
      {/* ================= HEADER ================= */}
      <section className="pt-32 pb-20 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-sm uppercase tracking-widest text-white/50">
            Our Menu
          </p>

          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            Thoughtfully curated
            <br />
            <span className="text-white/70">for elevated evenings</span>
          </h1>

          <p className="text-lg text-white/70">
            Each dish and drink is designed to pair with the atmosphere —
            refined, balanced, and memorable.
          </p>
        </div>
      </section>

      {/* ================= STARTERS ================= */}
      <MenuSection
        title="Starters"
        subtitle="Light beginnings, bold flavors"
        items={[
          { name: "Crispy Corn", price: "₹249", desc: "Golden fried corn tossed with herbs & spices" },
          { name: "Paneer Tikka", price: "₹329", desc: "Chargrilled cottage cheese with smoky marinade" },
          { name: "Chicken Wings", price: "₹399", desc: "Glazed wings with house special sauce" },
        ]}
      />

      {/* ================= MAINS ================= */}
      <MenuSection
        title="Main Course"
        subtitle="Comfort, elevated"
        items={[
          { name: "Butter Chicken", price: "₹449", desc: "Slow-cooked tomato gravy, rich & creamy" },
          { name: "Paneer Lababdar", price: "₹399", desc: "Soft paneer in velvety cashew gravy" },
          { name: "Grilled Fish", price: "₹499", desc: "Seasonal catch with lemon butter sauce" },
        ]}
      />

      {/* ================= DRINKS ================= */}
      <MenuSection
        title="Drinks"
        subtitle="Crafted to complement the night"
        items={[
          { name: "Signature Mojito", price: "₹299", desc: "Fresh mint, lime & soda" },
          { name: "Old Fashioned", price: "₹399", desc: "Classic bourbon cocktail, L4 style" },
          { name: "Mocktail Platter", price: "₹349", desc: "Assorted non-alcoholic blends" },
        ]}
      />

      {/* ================= NOTE ================= */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <p className="text-white/60 text-sm">
            Prices are indicative and subject to change.
          </p>
          <p className="text-white/50 text-sm">
            Please inform our staff of any allergies or special preferences.
          </p>
        </div>
      </section>
    </main>
  );
}

/* ================= COMPONENT ================= */

function MenuSection({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: {
    name: string;
    price: string;
    desc: string;
  }[];
}) {
  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto space-y-14">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            {title}
          </h2>
          <p className="text-white/60">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {items.map((item) => (
            <div
              key={item.name}
              className="
                rounded-2xl
                bg-white/[0.04]
                border border-white/10
                p-8
                space-y-2
                hover:bg-white/[0.06]
                transition
              "
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{item.name}</h3>
                <span className="text-white/80">{item.price}</span>
              </div>
              <p className="text-white/60 text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
