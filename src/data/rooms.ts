import type { Room } from "./types";
import { site } from "./site";

const U = "/wp-content/uploads";
const img = (src: string, alt: string) => ({ src: `${U}/${src}`, alt });

export const mixedDormsIntro = {
  heading: "Mixed Dorms",
  body: "Our Mixed Dorm Rooms are probably the biggest and most comfortable you will ever stay in. The customized bunk beds are wide and big with your own electric socket and reading lamp. Each bed also has its own towel rack and there are hooks around the room for hanging your clothing articles. Out for a walk around the city? No need to worry! Our dorm lockers are big enough to fit your valuables and each one has its own electric socket so you could charge that GoPro for your next adventure!",
};

const sinkNote =
  "*The 6-bed and 8-bed dorm rooms also have a built-in sink inside the room for a quick fix-up without having to wait forever for the shower room.";

/** Prices are the published "from" rates on zhostel.com; the site marks them "*Price may vary". */
export const mixedDorms: Room[] = [
  {
    id: "4-bed",
    name: "4 Bed",
    tagline: "Stylish 4 bed dorms!",
    description: ["Perfect for those who want a good mix of privacy and sociability"],
    notes: ["*Room Size: 15 sqm."],
    publishedPrice: ["PHP 1350", "/ bed with breakfast"],
    priceNote: "*Price may vary",
    images: [
      img("2019/02/Z-Hostel-Rooms-Q1-2019-35-1000x666.jpg", "4-bed mixed dorm"),
      img("2019/03/Z-Hostel-Rooms-Q1-2019-36-1000x665.jpg", "4-bed dorm bunks"),
      img("2019/02/Copy-of-Z-Hostel-Rooms-Q1-2019-39-1000x665.jpg", "4-bed dorm detail"),
    ],
    bookingUrl: site.bookingUrl,
  },
  {
    id: "6-bed",
    name: "6 Bed",
    tagline: "Stylish 6 bed dorms!",
    description: ["Just the right amount of people to turn your stay into a fun experience"],
    notes: [sinkNote, "*Room Size: 30 sqm."],
    publishedPrice: ["PHP 1300 /", "bed with breakfast"],
    priceNote: "*Price may vary",
    images: [
      img("2019/02/Z-Hostel-Rooms-Q1-2019-25-1000x665.jpg", "6-bed mixed dorm"),
      img("2019/02/Z-Hostel-Rooms-Q1-2019-27-1000x665.jpg", "6-bed dorm bunks"),
      img("2019/02/Z-Hostel-Rooms-Q1-2019-28-1000x665.jpg", "6-bed dorm view"),
      img("2019/02/Copy-of-Z-Hostel-Rooms-Q1-2019-23-1000x665.jpg", "6-bed dorm sink"),
      img("2019/02/Copy-of-Z-Hostel-Rooms-Q1-2019-22-1000x665.jpg", "6-bed dorm lockers"),
    ],
    bookingUrl: site.bookingUrl,
  },
  {
    id: "8-bed",
    name: "8 Bed",
    tagline: "Stylish 8 bed dorms!",
    description: [
      "If you're up for a party and designed for interaction without compromising comfort. They are near the elevators, too, for an easier access to the Roofdeck or the lobby for a chill-out session with your new-found friends!",
    ],
    notes: [sinkNote, "*Room Size: 30 sqm."],
    publishedPrice: ["PHP 1250", "/ bed with breakfast"],
    priceNote: "*Price may vary",
    images: [
      img("2019/02/Z-Hostel-Rooms-Q1-2019-55-1000x666.jpg", "8-bed mixed dorm"),
      img("2019/02/Z-Hostel-Rooms-Q1-2019-52-1000x665.jpg", "8-bed dorm bunks"),
      img("2019/02/Z-Hostel-Rooms-Q1-2019-57-1000x665.jpg", "8-bed dorm view"),
      img("2019/02/Copy-of-Z-Hostel-Rooms-Q1-2019-63-1000x665.jpg", "8-bed dorm detail"),
      img("2019/02/Copy-of-Z-Hostel-Rooms-Q1-2019-59-1000x665.jpg", "8-bed dorm mirror"),
    ],
    bookingUrl: site.bookingUrl,
  },
];

export const privateRooms: Room[] = [
  {
    id: "all-female",
    name: "All Female",
    tagline: null,
    description: [
      "Who says backpacking means always having to rough it up? Unleash the lady in you and welcome to our “Stiletto” room! Our All-Female Dorm is every girl traveller’s ideal home on the road. There’s a dresser where you can lounge around and a vanity mirror to get ready for that night out in the city! We’ve got your priceless possessions covered, too! The room’s lockers are designed to be bigger than usual mixed dorm lockers. This room is perfect for socializing with fellow female travelers and being comfortable in your skin. And if you’re a group of girls traveling together, then make this your she-shed while in Manila!",
    ],
    notes: ["*Hairdryer, flat iron and board are available upon request.", "*Free Breakfast Included", "*Room Size: 30 sqm."],
    publishedPrice: ["PHP 1300", "/ bed with breakfast"],
    priceNote: "*Price may vary",
    images: [
      img("2019/03/MG_0434-1-1000x667.jpg", "All-female dorm"),
      img("2019/03/MG_0448-1000x667.jpg", "All-female dorm vanity"),
      img("2019/03/218A1758-1000x667.jpg", "All-female dorm bunks"),
    ],
    bookingUrl: site.bookingUrl,
  },
  {
    id: "private-room",
    name: "Private Room",
    tagline: null,
    description: [
      "Good vibes taken on a whole new level! Strategically located on the highest floors, our private rooms are the perfect place for comfort while staying at the hostel --- it is fully air-conditioned, features a queen size bed with two pillows and duvet, your own private bathroom en-suite, and two bathrobes. And the great part? You are just a few steps away from the world-renowned Z Roofdeck, which gives you a breathtaking view of the skyline while having some cold beers at the bar. The music beats might just get you in the groove for some drinks and socializing at night! So if you are looking for a good night’s sleep, this might not be the ideal place for you.",
    ],
    notes: ["*Hairdryer, flat iron and board are available upon request", "*Free Breakfast for 2 included", "*Room Size: 15 sqm."],
    publishedPrice: ["PHP 3000"],
    priceNote: "*Price may vary",
    images: [
      img("2019/02/ZHostel-Interiors-24-A-1000x665.jpg", "Private room queen bed"),
      img("2019/02/ZHostel-Interiors-23-1000x691.jpg", "Private room"),
      img("2019/02/ZHostel-Interiors-22-1000x1502.jpg", "Private room bathroom"),
      img("2019/02/ZHostel-Interiors-21-1000x1503.jpg", "Private room detail"),
      img("2019/03/ZHostel-Interiors-20-1000x665.jpg", "Private room interior"),
      img("2019/02/ZHostel-Interiors-19-1000x666.jpg", "Private room window"),
    ],
    bookingUrl: site.bookingUrl,
  },
  {
    id: "private-bunk",
    name: "Private Room Bunk Bed",
    tagline: null,
    description: [
      "Privacy and personal space in one — Z Hostel is spoiling you with this Private Bunk Bed Room! Now you can have a whole room for you and your buddy but you also get your own down or private time from each other. Not that being cozy is bad but you get what we mean!",
    ],
    notes: ["*Hairdryer, flat iron and board are available upon request", "*Free Breakfast for 2 included", "*Room Size: 15 sqm."],
    publishedPrice: ["PHP 3000"],
    priceNote: "*Price may vary",
    images: [
      img("2019/02/ZHostel-Interiors-4-A-1000x665.jpg", "Private bunk bed room"),
      img("2019/02/ZHostel-Interiors-3-1000x665.jpg", "Private bunk room interior"),
      img("2019/03/ZHostel-Interiors-2-A-1000x665.jpg", "Private bunk room"),
      img("2019/02/ZHostel-Interiors-10-1000x1503.jpg", "Private bunk room detail"),
    ],
    bookingUrl: site.bookingUrl,
  },
  {
    id: "fun-floor",
    name: "Fun Floor",
    tagline: null,
    description: [
      "Our social fun rooms are perfect for those who want a good mix of comfort, sociability, and fun. These rooms are situated right below our world renowned roof deck bar where we hold events almost every night. Now you have a closer access to a whole deck of fun and more reasons to make new friends! Since we operate until 3AM, the music and chitchats can be heard in these rooms so just let us know if you’re up for the fun.",
    ],
    notes: [],
    // Published as three separate lines on the original page.
    publishedPrice: ["PHP 3000 / Bed (2 PAX) with Free Breakfast for 2", "PHP 1350 / Bed with breakfast", "PHP 1300 / Bed with breakfast"],
    priceNote: "*Price may vary",
    images: [
      img("2019/02/20190222-IMG_1889-1000x667.jpg", "Fun Floor room"),
      img("2019/02/Z-Hostel-Rooms-Q1-2019-10-1000x665.jpg", "Fun Floor bunks"),
      img("2019/03/Z-Hostel-Rooms-Q1-2019-17-1000x665.jpg", "Fun Floor interior"),
    ],
    bookingUrl: site.bookingUrl,
  },
];

export const groupBooking = {
  title: "Group Booking",
  background: `${U}/2018/08/booking_services_cover-1400x933.jpg`,
  heading: "We Accept Group Bookings",
  contactLabel: "Contact us for Group Bookings:",
  images: ["gb5-1000x1000.jpg", "gb2-1000x1000.jpg", "gb3-1000x1000.jpg", "gb1-1000x1000.jpg", "gb4-1000x1000.jpg"].map((f) => ({
    src: `${U}/2018/08/${f}`,
    alt: "Group of guests at Z Hostel",
  })),
};

export const roomReviews = [
  {
    stars: 5,
    title: "Nice hub in Manila",
    text: "Our 4 person, mixed dorm was nice. There are spaces for all of your belongings, charging stations and nooks in your allocated bed , aircon, and a decent bathroom.",
    image: `${U}/2019/01/review-1-1000x993.jpg`,
    platform: { name: "TripAdvisor", logo: `${U}/2018/08/tripvisor-1-175x30.png`, width: 175, height: 30 },
  },
  {
    stars: 5,
    title: "Best hostel I've been to in awhile!",
    text: "I stayed in Z hostel for 3 nights and my time there wasn't anything less than fantastic. My best friend and myself stayed in a 6 bed mixed dorm room and the place was exceptionally clean. The rooms came with lockers to safely keep your valueables and towels were provided as well. Hot running water for showers throughout the day and all the staff were very helpful to us. Best of all, it was afforable and really got our value for money here.",
    image: `${U}/2019/03/Z-Hostel-Rooms-Q1-2019-39-1000x666.jpg`,
    platform: { name: "TripAdvisor", logo: `${U}/2018/08/tripvisor-1-175x30.png`, width: 175, height: 30 },
  },
  {
    stars: 4,
    title: "Fabulous",
    text: "The room is full of mirrors which is fantastic. Great views on the roof terrace as well! Very clean and comfortable beds and bathrooms. Big plus is beds come with personal light and 2 outlets!",
    image: `${U}/2019/03/Z-Hostel-Rooms-Q1-2019-12-1000x1504.jpg`,
    platform: { name: "Hostelworld", logo: `${U}/2018/08/hostel-world-logo-136x30.png`, width: 136, height: 30 },
  },
];
