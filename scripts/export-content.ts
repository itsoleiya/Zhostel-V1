// Exports all page content from src/data to supabase/content.json (blog posts stay in src/data/posts.json).
import { writeFileSync } from "node:fs";
import { site, navigation } from "../src/data/site";
import { pageMeta, heroes, exploreZ, homeAmenities, roomServices, homeCtas, homeReviews, about, gettingThere, locationBlock } from "../src/data/pages";
import { mixedDormsIntro, mixedDorms, privateRooms, groupBooking, roomReviews } from "../src/data/rooms";
import { activities, zStreet, tours } from "../src/data/events";
import { gallery } from "../src/data/gallery";

const heroFor: Record<string, string> = { home: "home", about: "about", rooms: "rooms", events: "events", gallery: "gallery", contact: "plain", blog: "plain" };
const sizeOf = (notes: string[]) => { const m = notes.join(" ").match(/Room Size:\s*([\d.]+)\s*sqm/i); return m ? Number(m[1]) : null; };
const priceOf = (lines: string[]) => { const m = lines[0]?.match(/^PHP\s*(\d+)/); return m ? Number(m[1]) : null; };

const content = {
  site_settings: [{ id: 1, name: site.name, tagline: site.tagline, booking_url: site.bookingUrl, email: site.email, group_email: site.groupEmail,
    address: site.address, address_short: site.addressShort, phones: site.phones, social: site.social, copyright: site.copyright,
    footer_title: site.footerTitle, help_text: site.helpText, map_embed_url: site.mapEmbed, map_link: site.mapLink,
    cover_video: site.coverVideo, menu_pdf: site.menuPdf, directions_pdf: site.directionsPdf, contact_subjects: site.contactSubjects }],
  nav_items: navigation.map((n, i) => ({ label: n.label, path: n.to, is_long: "long" in n, sort_order: i + 1 })),
  pages: Object.entries(pageMeta).map(([key, m]) => {
    const h = heroes[heroFor[key]];
    return { key, slug: m.slug, title: m.title, meta_description: m.metaDescription, navigation_label: m.navigationLabel, source_url: m.sourceUrl,
      hero_image: h.image, hero_logo: h.logo, hero_title: h.title, hero_subtitle: h.subtitle, hero_copyright: h.copyright };
  }),
  page_sections: [
    { page_key: "home", section_key: "cta_manila", heading: homeCtas.manila.title, subheading: null, body: [], image: homeCtas.manila.image, link_label: homeCtas.manila.button, link_url: homeCtas.manila.url, sort_order: 2 },
    { page_key: "home", section_key: "cta_getting_there", heading: homeCtas.gettingThere.title, subheading: null, body: [], image: homeCtas.gettingThere.image, link_label: homeCtas.gettingThere.button, link_url: homeCtas.gettingThere.url, sort_order: 4 },
    { page_key: "home", section_key: "instagram", heading: homeCtas.instagram.title, subheading: null, body: [], image: homeCtas.instagram.image, link_label: "Follow on Instagram", link_url: site.social.instagram, sort_order: 7 },
    { page_key: "about", section_key: "about", heading: about.heading, subheading: about.basicTitle, body: about.body, image: about.video.image, link_label: about.video.lines.join(" "), link_url: about.video.url, sort_order: 1 },
    ...about.rfid.blocks.map((b, i) => ({ page_key: "about", section_key: `rfid_${i + 1}`, heading: b.heading, subheading: i === 0 ? about.rfid.subtitle : null, body: [b.body], image: b.image, link_label: null, link_url: null, sort_order: 2 + i })),
    { page_key: "rooms", section_key: "mixed_dorms_intro", heading: mixedDormsIntro.heading, subheading: null, body: [mixedDormsIntro.body], image: null, link_label: null, link_url: null, sort_order: 1 },
    { page_key: "rooms", section_key: "group_booking", heading: groupBooking.heading, subheading: groupBooking.contactLabel, body: [site.groupEmail], image: groupBooking.background, link_label: "Book Now", link_url: site.bookingUrl, sort_order: 4 },
    { page_key: "contact", section_key: "getting_there", heading: gettingThere.heading, subheading: null, body: gettingThere.body, image: null, link_label: gettingThere.pdfLabel, link_url: site.directionsPdf, sort_order: 1 },
    { page_key: "contact", section_key: "location", heading: "Location", subheading: locationBlock.phones, body: [locationBlock.address], image: null, link_label: null, link_url: null, sort_order: 2 },
  ],
  section_images: groupBooking.images.map((im, i) => ({ page_key: "rooms", section_key: "group_booking", src: im.src, alt: im.alt, sort_order: i + 1 })),
  features: exploreZ.map((f, i) => ({ id: f.id, heading: f.heading, subheading: f.subheading, body: f.body, link_label: f.link?.label ?? null, link_url: f.link?.url ?? null, link_external: f.link?.external ?? false, show_book_now: f.showBookNow, sort_order: i + 1 })),
  feature_images: exploreZ.flatMap((f) => f.images.map((im, i) => ({ feature_id: f.id, src: im.src, alt: im.alt, caption: im.caption ?? null, sort_order: i + 1 }))),
  rooms: [...mixedDorms.map((r) => ({ r, sec: "mixed_dorms" })), ...privateRooms.map((r) => ({ r, sec: "private_rooms" }))].map(({ r, sec }, i) => ({
    id: r.id, section: sec,
    room_type: ({ "all-female": "dorm", "private-room": "private", "private-bunk": "private", "fun-floor": "mixed" } as Record<string, string>)[r.id] ?? "dorm", name: r.name, tagline: r.tagline, description: r.description, notes: r.notes, published_price: r.publishedPrice,
    price_note: r.priceNote, price_from_php: r.id === "fun-floor" ? null : priceOf(r.publishedPrice),
    price_unit: r.id === "fun-floor" ? null : (r.publishedPrice.join(" ").includes("bed") ? "per bed" : "per room"),
    room_size_sqm: sizeOf(r.notes), booking_url: r.bookingUrl, sort_order: i + 1 })),
  room_images: [...mixedDorms, ...privateRooms].flatMap((r) => r.images.map((im, i) => ({ room_id: r.id, src: im.src, alt: im.alt, sort_order: i + 1 }))),
  amenities: homeAmenities.map((a, i) => ({ label: a.label, icon: a.icon, show_on_home: true, show_on_rooms: roomServices.some((s) => s.label === a.label), sort_order: i + 1 })),
  reviews: [...homeReviews.map((r) => ({ r, page: "home" })), ...roomReviews.map((r) => ({ r, page: "rooms" }))].map(({ r, page }, i) => ({
    page_key: page, stars: r.stars, glyphs: (r as { glyphs?: string }).glyphs ?? null, title: r.title, text: r.text, image: r.image,
    platform: r.platform.name, platform_logo: r.platform.logo, platform_logo_width: r.platform.width, platform_logo_height: r.platform.height, sort_order: i + 1 })),
  activities: activities.cards.map((c, i) => ({ title: c.title, detail: c.detail, image: c.image, sort_order: i + 1 })),
  activity_descriptions: activities.details.map((d, i) => ({ label: d.label, text: d.text, sort_order: i + 1 })),
  venues: [...zStreet.map((v) => ({ v, t: "z_street" })), ...tours.map((v) => ({ v, t: "tour" }))].map(({ v, t }, i) => ({
    type: t, name: v.name, kind: v.kind, description: v.description, image: v.image, url: v.url, link_label: v.linkLabel, sort_order: i + 1 })),
  gallery_albums: gallery.flatMap((y, yi) => y.albums.map((a, ai) => ({ year: Number(y.year), title: a.title, sort_order: yi * 100 + ai + 1 }))),
  gallery_images: gallery.flatMap((y) => y.albums.flatMap((a) => a.images.map((src, i) => ({ album_title: a.title, src, sort_order: i + 1 })))),
};
writeFileSync("supabase/content.json", JSON.stringify(content, null, 1));
console.log(Object.entries(content).map(([k, v]) => `${k}: ${v.length}`).join("\n"));
