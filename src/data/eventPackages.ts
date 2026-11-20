/**
 * Event Packages page content, from "Z - Event packages 2026.pdf" (Nov 2026).
 * Year-round packages (no longer Christmas-only). Edit prices and menus here.
 */
const IMG = "/events/packages";

export const packagesIntro = {
  title: "Your next event starts at Z!",
  lede: "Good vibes, great company, and unforgettable moments. Enjoy our event spaces in Poblacion, Makati with fully consumable rates.",
  badge: "No venue fee!",
  badgeNote: "Enjoy our event spaces with fully consumable rates",
  phone: "+63 917 316 9362",
  email: "reservations@zhostel.com",
};

export const eventTypes = [
  { id: "barkada", title: "Barkada Gatherings", text: "Gather your crew for great food, refreshing drinks, and memorable moments in a space perfect for bonding and celebrations." },
  { id: "birthday", title: "Birthday Celebrations", text: "Celebrate your special day with your favorite people, great food, refreshing drinks, and unforgettable moments." },
  { id: "corporate", title: "Corporate Gatherings", text: "Take your corporate gatherings beyond the office with a relaxed setting, great food, and refreshing drinks, ideal for team socials, company celebrations, and networking events." },
  { id: "private", title: "Private Events", text: "Enjoy an exclusive space for your special gatherings, from intimate get-togethers to lively celebrations, with great food, drinks, and memorable moments." },
  { id: "special", title: "Special Celebrations", text: "Celebrate life's special moments, from anniversaries and graduations to milestones worth remembering, in a space made for good company and lasting memories." },
];

export const inclusions = [
  "Fully consumable food and beverage package",
  "Exclusive use of the venue for 4 hours",
  "Complimentary use of the venue's basic sound system",
  "Access to existing tables, chairs, and lounge seating",
  "Standard venue lighting and ambiance",
  "Dedicated space for private gatherings and celebrations",
  "Basic venue setup and arrangement",
  "On-site staff assistance throughout the event",
  "Complimentary parking slots, depending on package",
  "Room accommodations, depending on package",
];

export const exclusions = [
  "Private DJ or Live Band",
  "Event Host / Emcee",
  "Event Styling and Themed Decorations",
  "Additional Sound and Lighting Equipment",
  "Photo and Video Coverage",
  "Customized Signages and Tarpaulins",
  "Additional Tables, Chairs, and Furniture",
  "Extended Venue Hours",
  "Other Additional Services upon Request",
];

export const ADDITIONAL_GUEST_RATE = 1500;

export type Space = {
  id: string;
  name: string;
  option?: string;
  capacityLabel: string;
  /** Guests covered by the base rate (upper capacity). */
  capacity: number;
  rate: number;
  rooms: number;
  parking: number;
  idealFor?: string;
  image: string;
};

export const spaces: Space[] = [
  { id: "sundeck", name: "Sundeck", capacityLabel: "50 pax", capacity: 50, rate: 75000, rooms: 2, parking: 2, image: `${IMG}/sundeck.webp` },
  { id: "roofdeck", name: "Roofdeck", option: "Option 1: Roofdeck A or B", capacityLabel: "40 pax", capacity: 40, rate: 60000, rooms: 2, parking: 2, image: `${IMG}/roofdeck.webp` },
  { id: "roofdeck-both", name: "Roofdeck", option: "Option 2: Both Roofdecks", capacityLabel: "80 pax", capacity: 80, rate: 120000, rooms: 2, parking: 2, image: `${IMG}/roofdeck-both.webp` },
  { id: "salakot", name: "Salakot Lounge", capacityLabel: "30–60 pax", capacity: 60, rate: 50000, rooms: 1, parking: 1, image: `${IMG}/salakot.webp` },
  { id: "theater", name: "Theater", capacityLabel: "15 pax", capacity: 15, rate: 20000, rooms: 1, parking: 1, idealFor: "Movie / Screening Nights and KTV", image: `${IMG}/theater.webp` },
];

export type MenuSet = { id: string; name: string; price: number | null; sections: { heading: string; items: string[] }[]; note?: string };

export const MENU_MIN_PAX = 15;
export const menuNote = "All menu sets include beverages, with a choice of Iced Tea or Sago't Gulaman. Minimum of 15 pax required to avail.";

export const menuSets: MenuSet[] = [
  { id: "marilag", name: "Marilag", price: 1800, sections: [
    { heading: "Appetizers", items: ["Creamy Corn Soup", "Choice of Gising-Gising or Steamed Seasonal Vegetables"] },
    { heading: "Main Courses", items: ["Choice of Pork or Chicken Sisig", "Sweet and Sour Breaded Fish Fillet", "Korean-Style Beef", "Steamed Rice"] },
    { heading: "Pasta Selection", items: ["Choice of Crispy Noodles or Classic Carbonara"] },
    { heading: "Dessert Selection", items: ["Maja Blanca Shots", "Tiramisu Shots"] },
    { heading: "Additional Food Stations", items: ["Fresh Salad Station", "Curated Grazing Table"] },
  ] },
  { id: "hiraya", name: "Hiraya", price: 2500, sections: [
    { heading: "Appetizers", items: ["Traditional Molo Soup", "Chopsuey with Fresh Vegetables"] },
    { heading: "Main Courses", items: ["Choice of Pork or Chicken Sisig", "Grilled Pork Barbecue", "Filipino-Style Beef Caldereta", "Ceviche Shots", "Steamed Rice"] },
    { heading: "Pizza", items: ["Classic Margherita Pizza"] },
    { heading: "Dessert Selection", items: ["Panna Cotta Shots", "Buko Pandan Shots"] },
    { heading: "Additional Food Stations", items: ["Fresh Salad Station", "Curated Grazing Table", "Roast Beef Carving Station"] },
  ] },
  { id: "sinag", name: "Sinag", price: 3000, sections: [
    { heading: "Appetizers", items: ["Creamy Mushroom Soup", "Pinakbet"] },
    { heading: "Main Courses", items: ["Crispy Bagnet Kare-Kare", "Japanese-Style Yakitori", "Beef and Mushroom", "Sweet and Sour Cod"] },
    { heading: "Seafood Selection", items: ["Garlic Butter Shrimp"] },
    { heading: "Pasta Selection", items: ["Choice of Classic Carbonara or Aglio Olio"] },
    { heading: "Dessert Selection", items: ["Assorted Mini Cakes", "Maja Blanca Shots", "Panna Cotta Shots"] },
    { heading: "Additional Food Stations", items: ["Fresh Salad Station", "Curated Grazing Table", "Roast Beef Carving Station"] },
  ] },
  { id: "custom", name: "Custom", price: null, sections: [
    { heading: "Build your own", items: ["Appetizers", "Main Courses", "Seafood Selection", "Pasta Selection", "Dessert Selection", "Additional Food Stations", "Beverages"] },
  ], note: "Feel free to select your preferred dishes, from appetizers and main courses to desserts and drinks. Our chef will curate a customized menu set and provide a personalized quotation based on your selections." },
];

export const startTimes = ["11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "Not sure yet"];

export const peso = (n: number) => "₱" + n.toLocaleString("en-PH");
