/**
 * Menu data – single source of truth for display.
 * Easy to extend (API, CMS) later.
 */

export type MenuItem = {
  name: string;
  price: string;
  description?: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
};

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: "starters",
    name: "Starters",
    items: [
      { name: "Paneer Tikka", price: "₹220" },
      { name: "Chicken Lollipop", price: "₹260" },
      { name: "Veg Spring Rolls", price: "₹180" },
      { name: "Fish Fingers", price: "₹240" },
    ],
  },
  {
    id: "mains",
    name: "Mains",
    items: [
      { name: "Butter Chicken", price: "₹320" },
      { name: "Veg Alfredo Pasta", price: "₹280" },
      { name: "Grilled Fish", price: "₹340" },
      { name: "Dal Makhani", price: "₹260" },
    ],
  },
  {
    id: "beverages",
    name: "Beverages",
    items: [
      { name: "Mocktails", price: "₹150+" },
      { name: "Cold Coffee", price: "₹140" },
      { name: "Fresh Lime", price: "₹80" },
      { name: "Masala Chai", price: "₹60" },
    ],
  },
];
