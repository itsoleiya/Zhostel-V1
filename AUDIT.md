# Z Hostel rebuild — audit and comparison report

Audit date: 15 October 2026. Source of truth: the live site at https://zhostel.com/ (WordPress, "Regina" hotel theme, Unyson page builder).

## 1. URLs inspected

| Original URL | Title | Rebuilt at | Status |
| --- | --- | --- | --- |
| https://zhostel.com/ | Z Hostel | `/` | Rebuilt |
| https://zhostel.com/about-z/ | About Z \| Z Hostel | `/about-z/` | Rebuilt |
| https://zhostel.com/rooms-and-services/ | Rooms and Services \| Z Hostel | `/rooms-and-services/` | Rebuilt |
| https://zhostel.com/events-and-activities/ | Events and Activities \| Z Hostel | `/events-and-activities/` | Rebuilt |
| https://zhostel.com/gallery/ | Gallery \| Z Hostel | `/gallery/` | Rebuilt |
| https://zhostel.com/contact-us/ | Contact Us \| Z Hostel | `/contact-us/` | Rebuilt |
| https://zhostel.com/blog/ (+ /blog/page/2–10/) | Blog \| Z Hostel | `/blog/`, `/blog/page/N/` | Rebuilt |
| 92 posts, e.g. /dos-and-donts-when-travelling-in-the-philippines/ | (post title) \| Z Hostel | `/<slug>/` | All 92 rebuilt |
| https://zhostel.com/footer-page/ | — | — | Not rebuilt: page-builder source for the footer, not a visitor page |
| https://zhostel.com/flipbox-test/ | — | — | Not rebuilt: internal test page |
| https://zhostel.com/sitemap.xml, /robots.txt | — | generated at build | Replaced by a sitemap for the new deployment |
| https://zhostel.com/wp-json/wp/v2/posts, /media, /categories | — | — | Public REST API, used to export post content |

The menu's "Contact Us" item points to the homepage section `/#contact-us`, not to `/contact-us/`. That is kept as-is; `/contact-us/` (Getting There + Location) is still reachable by URL and from the sitemap.

## 2. Page content inventory (sections in original order)

**Home** — Hero (video cover over photo, logo, "Good Vibes Only", Book Now strip) · Explore Z (4 alternating rows: Rooms / Cafe / Sunset Sessions and Roof Deck / Explore the hood, each with photo carousel) · "Don't Skip Manila" photo CTA · Amenities & Services (12) · "Getting There" CTA → directions PDF · Contact Us (phones, address, email, form, map) · Reviews (3) · @zhostelph band · Footer.

**About Z** — Hero ("The Z Story" / "what about us") · HEY! (video tile "Watch Z in 1 Minute" → YouTube, THE BASIC / About Z, 3 paragraphs) · RFID (heading, subheading, 2-slide carousel: What is RFID? / Why use RFID at Z?).

**Rooms & Services** — Hero ("Take a Tour" / "(rooms & services)") · Rooms: Mixed Dorms intro, 4 Bed, 6 Bed, 8 Bed · All Female, Private Room, Private Room Bunk Bed, Fun Floor · Services (9) · Group Booking (carousel, sales email) · Room Reviews (3).

**Events & Activities** — Hero ("DO MORE. BE MORE." / "(events & activities)") · Activities (3 cards + 3 descriptions) · Z Street (9 flip cards) · Tours (Coming Soon) (6 flip cards).

**Gallery** — Hero ("Gallery") · 2019 (6 albums) · 2018 (5 albums) · Location.

**Contact Us** — Hero (video only) · Getting there (Print PDF tile + 4 paragraphs) · Location.

**Blog** — Hero (video only) · "Blog" heading · 10 full posts per page · Older/Newer posts.

**Post** — Hero (video only) · title, featured image, content · previous/next post links.

## 3. Assets

- Logos: 5 hero logo variants (black, white ×2, yellow-on-black, black-on-yellow), favicon/touch icon.
- Photos: 4 hero covers per page type, 18 Explore Z slides, 29 room slides, 5 group booking, 6 review photos, 3 activity cards, 9 venue logos, 6 tour photos, 164 gallery photos, 4 CTA backgrounds, 2 RFID photos, 1 video thumbnail.
- Video: `zcover.m4v` (cover video on every page).
- PDFs: `Menu-downloadable.pdf`, `DIRECTIONS-TO-Z.pdf`.
- Review platform logos: Hostelworld, Facebook, TripAdvisor.
- Blog: 77 featured images plus in-post images and all responsive sizes (srcset).

In total the site references about 1,750 files under `/wp-content/`. All are referenced by their original paths, loaded from zhostel.com by default, and can be mirrored locally with `npm run mirror:assets`.

Original images carry no alt text. Descriptive alt text was added for room and feature photos; decorative images use empty alt.

## 4. Unavailable, broken or unverified on the original

- **Asset check:** all 1,752 referenced files were requested from zhostel.com. 1,750 respond (about 285 MB in total). Two are already missing on the live site and show as broken images there too:
  - `/wp-content/uploads/2016/02/jeepney-300x225.jpg` in "Ultimate Traveler's Guide on How to Ride a Jeepney"
  - `/wp-content/uploads/2016/09/Smokeyard-Makati.jpg` in "The Smokeyard: American Barbecue in Poblacion, Makati"
  Every image, PDF and video used on the main pages is present.

- **Instagram feed** (homepage `@zhostelph`): the embedded access token has expired, so the live feed is empty. Rebuilt as the same photo band with a "Follow on Instagram" button.
- **Location map** (Contact, Gallery): the original uses the Google Maps JavaScript API and renders an empty canvas. Rebuilt with the working Google Maps embed from the homepage.
- **Contact form**: the original submits to WordPress (Contact Form 7). There is no server in the rebuild; see section 5.
- **Blog comments**: the original shows a WordPress "Leave a Reply" form on posts. Not rebuilt (needs a backend and moderation); no comments were displayed on the posts inspected.
- **Raleway font**: declared in the theme CSS but never loaded. Reproduced as visitors actually see it (Arial; serif for the menu tab and menu links). `VITE_LOAD_RALEWAY=true` restores the intended font.
- **Icon fonts**: amenity icons come from Themify and a licensed Flaticon set. Replaced with visually similar open-source Lucide icons.
- **Meta descriptions**: none of the original pages publish one, so none were invented. Posts use their excerpt.
- **Phone formats**: header/footer use "(632) 8856 0851"; the Location blocks print the older "(632) 856 0851". Both kept verbatim; please confirm which is current.
- **Prices**: the published "from" rates (PHP 1250–3000) are shown exactly as on the site, including "*Price may vary". They are not live rates.
- **Posts**: 7 links inside older posts point to `localhost` (left over from drafting) and are broken on the live site too. Instagram embed scripts in one post were removed; the fallback links remain.
- **Gallery page** returned a bot-verification page on first request; a normal retry worked. No protections were bypassed.

## 5. Behaviour

| Feature | Original | Rebuild |
| --- | --- | --- |
| Menu | Rotated "Z Hostel" tab opens a dark slide-out panel | Same; also keyboard accessible (focus moves into the panel, Tab is trapped, Esc closes and returns focus) |
| Carousels | Owl Carousel, prev/next squares + line pager | Same look; arrow keys and swipe; pauses on hover/focus |
| Flip cards | Hover rotates and reveals details | Same on mouse and keyboard focus; on touch screens details show below the image |
| Booking | Links to Cloudbeds | Same link everywhere; review-slide "BOOK NOW" buttons (`href="#"`, dead on the original) now also go to Cloudbeds |
| Contact form | Name, Email, Subject (7 options), Message → WordPress | Same fields and options, with validation and error messages. Sends to `VITE_CONTACT_ENDPOINT`; if unset, opens the visitor's email app pre-filled and says so. Never reports a message as sent unless the endpoint confirms it. |
| Phones, email, address | Plain text (email hidden by Cloudflare) | `tel:`, `mailto:` and Google Maps links |
| Video | Autoplaying muted cover | Same; disabled for visitors who prefer reduced motion |
| About video | Links to YouTube | Plays inline in the tile |
| 404 | WordPress 404 | Custom 404 page |

## 6. Visual comparison checklist

Compared with Chromium screenshots of the original and the rebuild at 1440 × 900, plus the rebuild at 768 × 1024 and 390 × 844. Pixel-perfect accuracy is **not** claimed.

| Check | Result |
| --- | --- |
| Section order, all pages | Matches |
| Text, headings, prices, labels | Matches (copied from the source HTML/API) |
| Image selection and order | Matches; same files and crops (cover-fit) |
| Header strip, side tab, slide-out menu | Matches |
| Hero: logo, title bar, scroll cue, Book Now strip, rotated credit | Matches |
| Section titles with yellow bar | Matches |
| Explore Z / rooms alternating rows | Matches; row heights within a few px |
| Amenity grid | Matches layout; icons are substitutes (see §4) |
| Flip cards, gallery tiles | Matches |
| Footer and "Need Help" strip | Matches; strip animates in like the original, and is static on tablet/mobile |
| Mobile 390 px / tablet 768 px | No horizontal scrolling; columns stack as on the original |
| Browser console | No errors on any page in the rebuild |
| Known visual differences | Amenity icon artwork; Location map now shows a real map; Instagram band shows a button instead of an empty feed; blog posts show a publish date under the title (the original shows none) |

## 7. Known limitations

- It is a client-rendered single-page app. Google renders JavaScript, but other crawlers and link previews see only the shared `index.html` metadata. If social previews per page matter, add prerendering (e.g. `vite-plugin-ssg`) as a follow-up.
- Unknown URLs return the 404 page with HTTP 200 on static hosts (soft 404).
- The cover video is 1 file loaded on every page, as on the original; consider a smaller mobile encode after mirroring.
