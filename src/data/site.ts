export const site = {
  name: "Z Hostel",
  tagline: "Good Vibes Only",
  bookingUrl: "https://hotels.cloudbeds.com/reservation/oL7RdR",
  phones: [
    { label: "(632) 8856 0851", tel: "+63288560851", kind: "T" },
    { label: "(63) 917 889 8531", tel: "+639178898531", kind: "M" },
  ],
  email: "zhostelreservations@gmail.com",
  groupEmail: "sales@zhostelph.com",
  address: "5660 Don Pedro St. Brgy. Poblacion, Makati City, Philippines 1210",
  addressShort: "5660 Don Pedro St. Brgy. Poblacion, Makati City, Philippines, 1210",
  copyright: "© 2024 Flashpacker Inc.",
  footerTitle: "Makati - Philippines",
  helpLine: "Need Help. (632) 8856 0851 | (63) 917 889 8531",
  helpText: "If you want to talk to a human being, then you can ring us on the following number.",
  social: {
    facebook: "https://www.facebook.com/zhostelph/",
    facebookFooter: "https://www.facebook.com/ZHostelph/",
    instagram: "https://www.instagram.com/zhostelph/",
    youtube: "https://www.youtube.com/channel/UCoSwV7kz69fka8q3sapHJUA",
  },
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.618786689355!2d121.02919401431974!3d14.563779281883624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c9aaf1f35e4f%3A0x7f6c432bba82e5b3!2sZ+Hostel!5e0!3m2!1sen!2sph!4v1553682211238",
  mapLink: "https://www.google.com/maps/search/?api=1&query=Z+Hostel+5660+Don+Pedro+St+Poblacion+Makati",
  coverVideo: "/wp-content/uploads/2022/04/zcover.m4v",
  menuPdf: "/wp-content/uploads/2019/03/Menu-downloadable.pdf",
  directionsPdf: "/wp-content/uploads/2018/08/DIRECTIONS-TO-Z.pdf",
  contactSubjects: [
    "Room reservation",
    "Group Bookings",
    "Events & Marketing",
    "Tours / Activities",
    "Join our Z Team (Hiring)",
    "Volunteer at Z",
    "Other Inquiries",
  ],
} as const;

/** Main menu, in the original order. "Contact Us" points at the homepage section, as on the live site. */
export const navigation = [
  { label: "Home", to: "/" },
  { label: "About Z", to: "/about-z/" },
  { label: "Rooms & Services", to: "/rooms-and-services/", long: true },
  { label: "Events & Activities", to: "/events-and-activities/", long: true },
  { label: "Blog", to: "/blog/" },
  { label: "Gallery", to: "/gallery/" },
  { label: "Contact Us", to: "/#contact-us" },
] as const;
