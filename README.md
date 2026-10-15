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

## Booking

Every "Book Now" links to the existing Cloudbeds page (`hotels.cloudbeds.com/reservation/oL7RdR`). The site does not check availability or take reservations itself.
