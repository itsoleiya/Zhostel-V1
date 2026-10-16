import type { UpcomingEvent } from "./types";
import { site } from "./site";

/**
 * "Coming up" cards. Copied from https://zhostel.github.io/events/ (Oct 2026).
 * Cards hide themselves after `endsAt`; the whole section hides when none are left.
 */
export const upcomingSection = {
  kicker: "Coming up",
  title: "Halloween at Z",
  sourceUrl: "https://zhostel.github.io/events/",
};

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: "tabi-tabi-po",
    tag: "Salakot opening night · Halloween",
    title: "Tabi Tabi Po",
    dateText: "Fri & Sat, Oct 30–31, 2026 · 9PM",
    venue: "Salakot at Z Hostel, 5660 Don Pedro St.",
    startsAt: "2026-10-30T21:00:00+08:00",
    endsAt: "2026-11-01T04:00:00+08:00",
    description:
      "A night with the spirits of Philippine folklore. DJ sets all night, drinks at the bar, and best in costume for whoever brings the best myth from home.",
    image: "https://zhostel.github.io/events/tabi-tabi-po/assets/myths/whitelady-720.webp",
    imageAlt: "The White Lady, one of the Filipino myths of Tabi Tabi Po",
    primary: { label: "RSVP for your QR ticket", url: "https://itsoleiya.github.io/tabi-tabi-po/" },
    secondary: { label: "Stay for the party", url: site.bookingUrl },
  },
  {
    id: "ody-z",
    tag: "Z Street 2026 · New date",
    title: "THE ODY-Z",
    dateText: "Fri, Nov 20, 2026 (moved from Oct 30)",
    venue: "Don Pedro & Alfonso Streets, Poblacion",
    // Start time isn't published; 6PM matches the countdown on zhostel.github.io/events/. Edit if it changes.
    startsAt: "2026-11-20T18:00:00+08:00",
    endsAt: "2026-11-21T04:00:00+08:00",
    description:
      "It comes home on November 20. A Poblacion homecoming street party across the whole block: Z Hostel, the Vine Building and the street in between. Costumes encouraged. 18+.",
    image: "https://ody-z.com/assets/hero-wide.jpg",
    imageAlt: "THE ODY-Z street party poster art",
    primary: { label: "See more at ody-z.com", url: "https://ody-z.com/" },
    secondary: { label: "Stay for the party", url: site.bookingUrl },
  },
];
