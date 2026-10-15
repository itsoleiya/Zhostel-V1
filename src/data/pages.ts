import type { Amenity, Feature, Hero, PageMeta, Review } from "./types";
import { site } from "./site";

const U = "/wp-content/uploads";

export const pageMeta: Record<string, PageMeta> = {
  home: { slug: "/", title: "Z Hostel", metaDescription: null, navigationLabel: "Home", sourceUrl: "https://zhostel.com/" },
  about: { slug: "/about-z/", title: "About Z | Z Hostel", metaDescription: null, navigationLabel: "About Z", sourceUrl: "https://zhostel.com/about-z/" },
  rooms: { slug: "/rooms-and-services/", title: "Rooms and Services | Z Hostel", metaDescription: null, navigationLabel: "Rooms & Services", sourceUrl: "https://zhostel.com/rooms-and-services/" },
  events: { slug: "/events-and-activities/", title: "Events and Activities | Z Hostel", metaDescription: null, navigationLabel: "Events & Activities", sourceUrl: "https://zhostel.com/events-and-activities/" },
  gallery: { slug: "/gallery/", title: "Gallery | Z Hostel", metaDescription: null, navigationLabel: "Gallery", sourceUrl: "https://zhostel.com/gallery/" },
  contact: { slug: "/contact-us/", title: "Contact Us | Z Hostel", metaDescription: null, navigationLabel: null, sourceUrl: "https://zhostel.com/contact-us/" },
  blog: { slug: "/blog/", title: "Blog | Z Hostel", metaDescription: null, navigationLabel: "Blog", sourceUrl: "https://zhostel.com/blog/" },
};

export const heroes: Record<string, Hero> = {
  home: { image: `${U}/2018/08/Home-1400x933.jpg`, logo: `${U}/2019/03/Black-w-BG-Logo-300x300.png`, title: "Good Vibes Only", subtitle: null, copyright: null },
  about: { image: `${U}/2019/03/Z-Hostel-Rooms-1400x932.jpg`, logo: `${U}/2019/03/White-W-BG-Logo-300x300.png`, title: "The Z Story", subtitle: "what about us", copyright: "@ ZHostel 2018" },
  rooms: { image: `${U}/2018/08/ras_cover-1400x933.jpg`, logo: `${U}/2019/03/White-W-BG-Logo-1-300x300.png`, title: "Take a Tour", subtitle: "(rooms & services)", copyright: "@ ZHostel 2018" },
  events: { image: `${U}/2018/08/a6-1400x933.jpg`, logo: `${U}/2019/03/Yellow-_-Black-Logo-300x300.png`, title: "DO MORE. BE MORE.", subtitle: "(events & activities)", copyright: "@ ZHostel 2020" },
  gallery: { image: `${U}/2018/09/gallery-1400x749.jpg`, logo: `${U}/2019/03/Black-_-Yellow-Logo-300x300.png`, title: "Gallery", subtitle: null, copyright: null },
  // The original Contact, Blog and post pages set no hero photo or title, so only the cover video shows.
  plain: { image: null, logo: null, title: null, subtitle: null, copyright: null },
};

/* ───────────────────────────── Home ───────────────────────────── */

export const exploreZ: Feature[] = [
  {
    id: "rooms",
    heading: "Feel-good and Comfy",
    subheading: "Rooms",
    body: [
      "Spacious accommodation with customized big beds, each with its own electric socket and reading lamp. Our rooms offer air-conditioning, counters with kitchen sink, and en-suite bathrooms perfect for any traveler. Regular sanitation protocols are ensured for your safety. Enjoy a modern and minimal environment throughout your stay.",
    ],
    images: [
      { src: `${U}/2019/03/ZHostel-Interiors-2-A-1000x665.jpg`, alt: "Private room at Z Hostel" },
      { src: `${U}/2019/03/ZHostel-Interiors-20-1000x665.jpg`, alt: "Z Hostel room interior" },
      { src: `${U}/2019/03/Z-Hostel-Rooms-Q1-2019-17-1000x665.jpg`, alt: "Fun Floor room" },
      { src: `${U}/2019/03/Z-Hostel-Rooms-Q1-2019-36-1000x665.jpg`, alt: "Mixed dorm bunk beds" },
      { src: `${U}/2019/03/Z-Hostel-Rooms-Q1-2019-62-1000x665.jpg`, alt: "Dorm room" },
    ],
    link: { label: "MORE", url: "/rooms-and-services/" },
    showBookNow: true,
  },
  {
    id: "cafe",
    heading: "Taste the Flavor",
    subheading: "Cafe",
    body: [
      "Hostel vibe with restaurant-quality offers and service. The Z Cafe houses the Original Z blend coffee, a buffet breakfast, and sumptuous bestsellers such as Adobo Flakes, Sisig, Beef Sinigang. New menu additions such as Yakitori and Street Ramen take your hostel dining to a whole new level. Alcoholic beverages and refreshments are always available during cafe hours.",
    ],
    images: [
      { src: `${U}/2018/08/c4-1000x667.jpg`, alt: "Self-service foods", caption: "Self-service Foods" },
      { src: `${U}/2018/08/c5-1000x667.jpg`, alt: "Guests at the Z Cafe", caption: "Good People is a Plus" },
      { src: `${U}/2018/08/c1-1000x666.jpg`, alt: "Z Cafe", caption: "Only in Z" },
      { src: `${U}/2022/04/IMG_6713-1000x1333.jpg`, alt: "Dish from the Z Cafe", caption: "Taste the Flavor" },
      { src: `${U}/2018/08/c7-1000x666.jpg`, alt: "Z Cafe chef", caption: "The Master Chef" },
    ],
    link: { label: "Download Menu PDF", url: site.menuPdf, external: true },
    showBookNow: true,
  },
  {
    id: "roofdeck",
    heading: "Party All Night!",
    subheading: "Sunset Sessions and Roof Deck",
    body: [
      "Now world-renowned, the Z Roofdeck has definitely put the hostel on a sweet, top spot in the traveling industry. It features a fantastic view of the Manila skyline from every angle, a bar serving cold beers, fresh cocktails, and cracking munchies, and a DJ deck which has become home to local and international artists. Happy Hour Monday-Thursday 5-8pm. It's packed with great crowd on a weekday, on weekends it's a rooftop party.",
    ],
    images: [
      { src: `${U}/2022/04/e0912722-e838-4082-8307-f632e5031205-1000x666.jpg`, alt: "DJ at the Z Roofdeck", caption: "Hit the best Hits" },
      { src: `${U}/2018/08/rd2-1000x667.jpg`, alt: "Roofdeck party", caption: "Party! Party!" },
      { src: `${U}/2018/08/rd4-1000x1000.jpg`, alt: "Guests on the roofdeck", caption: "Oh yeahhh!" },
      { src: `${U}/2018/08/rd5-1000x1000.jpg`, alt: "Friends at the roofdeck", caption: "Girl Friend" },
      { src: `${U}/2018/08/rd8-1000x1000.jpg`, alt: "Live acoustic band", caption: "Live Acoustic Bands" },
    ],
    link: null,
    showBookNow: true,
  },
  {
    id: "hood",
    heading: "Explore the hood",
    subheading: "Right smack in the center of a business and cultural district",
    body: [
      "Dotted with hole-in-the-wall restaurants, quaint coffee shops, and art spaces, Z Hostel’s neighborhood is a throbbing heartbeat in the middle of a bustling city. Join our Sunset Sessions from 6PM at the Roofdeck where one free cocktail awaits all in-house guests. Get walking and sample local and international food from many establishments around.",
    ],
    images: [
      { src: `${U}/2019/03/WhatsApp-Image-2019-03-21-at-9.08.43-PM1-1000x666.jpeg`, alt: "Walking around Poblacion" },
      { src: `${U}/2019/03/WhatsApp-Image-2019-03-21-at-9.08.42-PM-1000x1501.jpeg`, alt: "Poblacion street" },
    ],
    link: null,
    showBookNow: true,
  },
];

export const homeAmenities: Amenity[] = [
  { label: "Free Wifi", icon: "wifi" },
  { label: "Sanitation Kit & Toiletries", icon: "toiletries" },
  { label: "Clothing", icon: "laundry" },
  { label: "Locker", icon: "locker" },
  { label: "Front Desk", icon: "reception" },
  { label: "Luggage", icon: "luggage" },
  { label: "Hot & Cold Shower", icon: "shower" },
  { label: "Working Space", icon: "workspace" },
  { label: "Temperature Check", icon: "temperature" },
  { label: "24hr Security & CCTV", icon: "security" },
  { label: "PC at Lobby", icon: "pc" },
  { label: "Concierge", icon: "concierge" },
];

/** The Rooms page lists the same services minus Locker, Front Desk and Luggage. */
export const roomServices: Amenity[] = homeAmenities.filter(
  (a) => !["Locker", "Front Desk", "Luggage"].includes(a.label),
);

export const homeCtas = {
  manila: { title: "Don't Skip Manila", image: `${U}/2019/07/35479224_10212084324679774_5359697771806851072_n-1400x934.jpg`, button: "Click Here", url: "/events-and-activities/" },
  gettingThere: { title: "Getting There", image: `${U}/2018/09/facade2-1400x933.png`, button: "Print PDF", url: site.directionsPdf },
  instagram: { title: "@zhostelph", image: `${U}/2018/08/hey_resize-1400x934.jpg` },
};

export const homeReviews: Review[] = [
  { stars: 5, title: "Best Hostel!", text: "One of the best hostels in Asia...", image: `${U}/2019/03/the-ruins-1000x1026.jpg`, platform: { name: "Hostelworld", logo: `${U}/2018/08/hostel-world-logo-136x30.png`, width: 136, height: 30 } },
  { stars: 4, glyphs: "★★★★☆", title: "I Love Z Hostel", text: "I love Z Hostel and the crowd. I always go with my friends.", image: `${U}/2019/03/Z-Hostel-Rooms-Q1-2019-12-1000x1504.jpg`, platform: { name: "Facebook", logo: `${U}/2018/08/Official-Facebook-Logo-92x30.png`, width: 92, height: 30 } },
  { stars: 5, title: "It Was Great!", text: "I spent my 3 days there in bed because I was sick. BUT EVEN LIKE THAT, IT WAS GREAT!", image: `${U}/2019/03/Z-Hostel-Rooms-Q1-2019-39-1000x666.jpg`, platform: { name: "TripAdvisor", logo: `${U}/2018/08/tripvisor-1-175x30.png`, width: 175, height: 30 } },
];

/* ───────────────────────────── About ───────────────────────────── */

export const about = {
  hey: "HEY!",
  video: { image: `${U}/2019/04/video-1000x667.jpg`, url: "https://www.youtube.com/watch?v=omIWP2YsxCo", embed: "https://www.youtube.com/embed/omIWP2YsxCo?autoplay=1", lines: ["Watch", "Z in", "1 Minute"] },
  basicTitle: "THE BASIC",
  heading: "About Z",
  body: [
    "Z Hostel is part of a new breed of hostels that combines a higher standard of accommodation with a fun, social atmosphere. Every detail that you find in each room was well thought of to best suit the guest. The Café gives you a taste of authentic Filipino cuisine, while the Z Roof Deck Bar offers great entertainment nightly by live artists and DJs, both local and international. It makes one wonder, how did this all come together?",
    "The managing owners at Z Hostel are a passionate group of friends who took their time to conceptualize and build the hostel from an inspiration. This inspiration began from their Sunday Slowdown sessions at a beach resort called La Luz. There was a certain vibe that was born from music, being around like minded individuals, strangers becoming lifelong friends, and having sophisticated conversations. This was where the foundation of Z Hostel was created.",
    "And it is this same foundation that kept Z going and open throughout the challenging times of the pandemic. We’re going back to full-swing — stronger than ever and with the same brand of good vibes and top-notch service.",
  ],
  rfid: {
    title: "RFID",
    subtitle: "Z Hostel Introduces the FIRST RFID payment system in a hostel in the Philippines",
    background: `${U}/2019/03/IMG_2722-1400x934.jpg`,
    blocks: [
      {
        heading: "What is RFID?",
        image: `${U}/2019/03/IMG_2722-1000x667.jpg`,
        body: "Radio frequency identification, or RFID, is a generic term for technologies that use radio waves to automatically identify people or objects. The most common type used is to store a serial number that identifies a person or object, and perhaps other information on a microchip that is attached to an antenna (the chip and the antenna together are called an RFID transponder or an RFID tag). The antenna enables the chip to transmit the identification information to a reader. The reader converts the radio waves reflected back from the RFID tag into digital information that can then be passed on to computers that can make use of it.",
      },
      {
        heading: "Why use RFID at Z?",
        image: `${U}/2019/03/IMG_0896-1000x997.jpg`,
        body: "This will facilitate cashless transactions. Transactions at the bar will be faster and there will be no need to wait for change because the exact amount will be debited. Efficiency.",
      },
    ],
  },
};

/* ───────────────────────────── Contact ───────────────────────────── */

export const gettingThere = {
  heading: "Getting there",
  pdfLabel: "Print PDF",
  body: [
    "We are located in a prime area in Makati City. We are walking distance to the famous red light district of P. Burgos Street. We are also walking distance to numerous bars, restaurants, clubs and cafes. Getting a cab is also not a problem. Powerplant Mall in Rockwell and Century Mall are just less than a kilometer away as well.",
    "From Ninoy Aquino International Airport, taking a taxi is the most convenient way to get to the hostel. Simply give the driver the following instructions:",
    "Ask the driver to take you to Kalayaan Ave. in Makati via Edsa Northbound and exiting to Rockwell. Drive through Rockwell out towards Kalayaan. Along Kalayaan Ave., you will find a Mini Stop Convenience Store on your right. That street is Don Pedro Street. Make a right there. Our hostel will be on your left, just a few meters from the corner.",
    "We recommend our guests to use the Grab or Uber app as airport taxis tend to overcharge. Rates should vary between Php 250 – 350 depending on the time of day and Manila traffic.",
  ],
};

/** As printed in the "Location" block on Contact and Gallery (note: older landline format than the header). */
export const locationBlock = {
  phones: "(632) 856 0851 or (63) 917 889 8531",
  address: "5660 Don Pedro St. Brgy. Poblacion, Makati City, Philippines, 1210",
};
