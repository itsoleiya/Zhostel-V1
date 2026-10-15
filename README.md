# Z Hostel website (React rebuild)

A faithful rebuild of **zhostel.com**: same pages, URLs, text, photos, layout and behaviour, moved off WordPress onto React + TypeScript + Vite. See `AUDIT.md` for what was inspected and every known difference from the original.

## Quick start

```bash
npm install
cp .env.example .env      # optional, defaults work
npm run dev               # http://localhost:5173
```

Requires Node 18 or newer.

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Type-check, build to `dist/`, write `dist/sitemap.xml` and `dist/robots.txt` |
| `npm run preview` | Serve the production build locally |
| `npm run import:posts` | Re-download all blog posts from the WordPress REST API (only while WordPress is still online) |
| `npm run mirror:assets` | Download every referenced image, PDF and video into `public/wp-content/` |

## Settings (`.env`)

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_SITE_URL` | `https://zhostel.com` | Public URL of this deployment. Used for canonical tags and the sitemap. Set it to the staging URL while testing so search engines don't see duplicates. |
| `VITE_ASSET_ORIGIN` | `https://zhostel.com` | Where `/wp-content/...` files load from. Leave as-is while WordPress is live. |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` | project "Zhostel V1" | Where contact form messages are saved (table `contact_messages`). Built in; override to use another project. |
| `VITE_CONTACT_ENDPOINT` | empty | URL that accepts a JSON POST `{name, email, subject, message}` (Formspree, Basin, your own API). Empty = the form opens the visitor's email app with the message pre-filled. |
| `VITE_LOAD_RALEWAY` | `false` | The live site names Raleway but never loads it, so visitors see Arial (and a serif in the menu). `false` reproduces that; `true` loads real Raleway. |

## Before switching off WordPress

1. `npm run mirror:assets` — copies ~1,750 files (all photos, srcset sizes, the cover video, both PDFs) into `public/wp-content/`. Expect a few hundred MB; files that are already missing on the live site are listed in `mirror-failures.txt`.
2. Set `VITE_ASSET_ORIGIN=` (empty) in `.env` and rebuild. Every image now comes from your own deployment.
3. Optionally run `npm run import:posts` one last time to capture any new posts.

`public/wp-content` is git-ignored because of its size; deploy it with your host's file upload, or remove that line from `.gitignore` if your repo can hold it.

## Editing content

All text, prices, photos and links live in `src/data/` — no component changes needed:

- `site.ts` — phones, emails, address, social links, booking URL, menu items, contact-form subjects
- `pages.ts` — page titles, hero banners, Home and About content, Getting There text
- `rooms.ts` — room types, published prices, room photos, group booking, room reviews
- `events.ts` — activities, Z Street venues, tours
- `gallery.ts` — gallery albums and photo order
- `posts.json` — blog posts (generated; edit via WordPress + re-import, or by hand)

Images are written as `/wp-content/uploads/...` paths and resolved through `VITE_ASSET_ORIGIN`. New images can go anywhere in `public/` and be referenced by path.

## Deploying

The site is a static single-page app; the host must send unknown paths to `index.html` so URLs like `/about-z/` and `/dos-and-donts-when-travelling-in-the-philippines/` work.

- **Netlify:** connect the repo; `netlify.toml` sets the build and the rewrite.
- **Vercel:** import the repo; `vercel.json` sets the build and the rewrite.
- **GitHub Pages:** `npm run build:pages && npm run deploy:pages` builds for the `/Zhostel-V1/` path and pushes to the `gh-pages` branch (Settings → Pages → Branch: `gh-pages`). Old build files are kept so visitors with a cached page don't hit missing-file errors.
- **Any static host / nginx:** upload `dist/` and add `try_files $uri /index.html;`.

Set the `VITE_*` variables in the host's environment settings, not only in a local `.env`.

## Project structure

```
src/
  components/   Header + slide-out menu, Hero, Carousel, split rows, sections, footer
  pages/        Home, About, Rooms, Events, Gallery, Contact, Blog, Post, NotFound
  layouts/      SiteLayout (header, footer, floating Book button, scroll handling)
  routes/       URL map (matches the WordPress URLs)
  data/         All content (see above)
  styles/       Design tokens and base styles
  utils/        Asset URL resolution, page metadata
  config/       Environment settings
scripts/        Sitemap, post import, asset mirroring
```

## Contact form messages (Supabase)

Messages from the contact form are saved in the Supabase project **Zhostel V1**, table `public.contact_messages` (name, email, subject, message, page, status, created_at). Read and manage them in the Supabase dashboard: Table Editor → `contact_messages`. Set `status` to `replied` or `archived` as you work through them.

The website uses the publishable key, which is safe to expose. The database allows that key to **insert** new messages only. It cannot read, edit or delete them; reading happens in the dashboard. Fields are validated by the database too (length limits, email format, the 7 allowed subjects).

Supabase does not send an email when a message arrives. To get notified, add a Database Webhook or an Edge Function on `contact_messages` inserts.

## Database (Supabase "Zhostel V1")

All website content is also stored in Supabase, one table per kind of content:

| Table | Rows | Holds |
| --- | --- | --- |
| `site_settings` | 1 | Phones, emails, address, social links, booking URL, PDFs, contact subjects |
| `nav_items` | 7 | Main menu |
| `pages` | 7 | URL, title and hero banner of each page |
| `page_sections` / `section_images` | 10 / 5 | About story, RFID, CTAs, Getting There, Location, Group Booking |
| `features` / `feature_images` | 4 / 17 | Homepage "Explore Z" rows and slides |
| `rooms` / `room_images` | 7 / 29 | Room types, published prices, size, photos |
| `amenities` | 12 | Amenities & Services (flags for Home and Rooms pages) |
| `reviews` | 6 | Quoted reviews (Home and Rooms) |
| `activities` / `activity_descriptions` | 3 / 3 | Events & Activities |
| `venues` | 15 | Z Street places (9) and Tours (6) |
| `gallery_albums` / `gallery_images` | 11 / 164 | Gallery |
| `posts` | 92 | Blog posts (full HTML) |
| `contact_messages` | — | Contact form submissions |

The website's publishable key can **read** content and **insert** contact messages; nothing else. Edit content in the Supabase Table Editor. `rooms`, `venues` and `posts` have an `is_published` switch to hide a row without deleting it.

Schema: `supabase/migrations/`. To reload all content from the repo's data files: `npm run export:content`, commit and push, then run `supabase/seed.sql` in the SQL editor (it replaces all content rows).

The website still reads its content from `src/data/`. Switching the pages to read from these tables is a separate step.

## Booking

Every "Book Now" links to the existing Cloudbeds page (`hotels.cloudbeds.com/reservation/oL7RdR`). The site does not check availability or take reservations itself.
