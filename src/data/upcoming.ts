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
    dateText: "Fri & Sat, Oct 30–31, 2026 · 6:00PM onwards",
    venue: "Salakot at Z Hostel, 5660 Don Pedro St.",
    startsAt: "2026-10-30T18:00:00+08:00",
    endsAt: "2026-11-01T04:00:00+08:00",
    description:
      "A night with the spirits of Philippine folklore. DJ sets all night, drinks at the bar, and best in costume for whoever brings the best myth from home.",
    image: "events/tabi-tabi-po/assets/myths/whitelady-720.webp", // local copy in public/
    imageAlt: "The White Lady, one of the Filipino myths of Tabi Tabi Po",
    primary: { label: "RSVP for your QR ticket", url: "events/tabi-tabi-po/" }, // page inside this site (public/events/tabi-tabi-po)
    secondary: { label: "Stay for the party", url: site.bookingUrl },
  },
];

/** Orange bar at the top of every page (copied from zhostel.github.io/events/). Links hide after their event ends. */
export const announcement = {
  label: "", // no prefix; Halloween is over
  links: [
    { eventId: "tabi-tabi-po", text: "Tabi Tabi Po at Salakot, Oct 30–31", url: "events/tabi-tabi-po/" },
  ],
};
