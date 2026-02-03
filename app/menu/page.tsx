"use client";

export default function MenuPage() {
  return (
    <main className="bg-black text-white">
      {/* HEADER */}
      <section className="pt-32 pb-20 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="motion text-sm uppercase tracking-widest text-white/50">
            Our Menu
          </p>

          <h1 className="motion motion-1 text-4xl md:text-6xl font-semibold tracking-tight">
            Thoughtfully curated
            <br />
            <span className="text-white/70">for elevated evenings</span>
          </h1>

          <p className="motion motion-2 text-lg text-white/70">
            Each dish and drink is designed to pair with the atmosphere.
          </p>
        </div>
      </section>

      <MenuSection title="Starters" subtitle="Light beginnings, bold flavors" items={[
        { name: "Crispy Corn", price: "₹249", desc: "Golden fried corn with herbs" },
        { name: "Paneer Tikka", price: "₹329", desc: "Chargrilled cottage cheese" },
        { name: "Chicken Wings", price: "₹399", desc: "House special glaze" },
      ]} />

      <MenuSection title="Main Course" subtitle="Comfort, elevated" items={[
        { name: "Butter Chicken", price: "₹449", desc: "Rich tomato gravy" },
        { name: "Paneer Lababdar", price: "₹399", desc: "Velvety cashew sauce" },
        { name: "Grilled Fish", price: "₹499", desc: "Lemon butter finish" },
      ]} />

      <MenuSection title="Drinks" subtitle="Crafted to complement the night" items={[
        { name: "Signature Mojito", price: "₹299", desc: "Mint, lime & soda" },
        { name: "Old Fashioned", price: "₹399", desc: "Classic bourbon" },
        { name: "Mocktail Platter", price: "₹349", desc: "Non-alcoholic blends" },
      ]} />
    </main>
  );
}

function MenuSection({ title, subtitle, items }: any) {
  return (
    <section className="section border-t border-white/5">
      <div className="max-w-5xl mx-auto space-y-14">
        <div className="text-center space-y-3">
          <h2 className="motion text-3xl md:text-4xl font-semibold">{title}</h2>
          <p className="motion motion-1 text-white/60">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {items.map((item: any, i: number) => (
            <div key={item.name} className={`motion motion-${(i % 4) + 1} card-premium p-8`}>
              <div className="flex justify-between">
                <h3 className="font-medium">{item.name}</h3>
                <span>{item.price}</span>
              </div>
              <p className="text-white/60 text-sm mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
