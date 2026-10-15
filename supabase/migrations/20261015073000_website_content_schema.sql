-- Website content for zhostel.com, modelled on the live site (audited Oct 2026).
-- Public (anon/publishable key) can READ published content; nobody can write except via the
-- dashboard / service role. Image paths are "/wp-content/..." resolved by the site's asset origin.

create or replace function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end $$;

-- ── Site-wide settings (single row) ─────────────────────────────────────────
create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  name text not null,
  tagline text,
  booking_url text not null,
  email text not null,
  group_email text,
  address text not null,
  address_short text,
  phones jsonb not null default '[]',          -- [{label, tel, kind}]
  social jsonb not null default '{}',          -- {facebook, instagram, youtube, ...}
  copyright text,
  footer_title text,
  help_text text,
  map_embed_url text,
  map_link text,
  cover_video text,
  menu_pdf text,
  directions_pdf text,
  contact_subjects text[] not null default '{}',
  updated_at timestamptz not null default now()
);
comment on table public.site_settings is 'Contact details, links and files shared by every page. Exactly one row.';

create table public.nav_items (
  id bigint generated always as identity primary key,
  label text not null,
  path text not null,
  is_long boolean not null default false,      -- smaller font in the slide-out menu
  sort_order int not null default 0
);
comment on table public.nav_items is 'Main menu, in display order.';

-- ── Pages and their sections ───────────────────────────────────────────────
create table public.pages (
  key text primary key,                        -- home, about, rooms, events, gallery, contact, blog
  slug text not null unique,                   -- URL path, e.g. /about-z/
  title text not null,
  meta_description text,
  navigation_label text,
  source_url text,
  hero_image text,
  hero_logo text,
  hero_title text,
  hero_subtitle text,
  hero_copyright text,
  updated_at timestamptz not null default now()
);
comment on table public.pages is 'One row per page: URL, <title> and the full-screen hero.';

create table public.page_sections (
  id bigint generated always as identity primary key,
  page_key text not null references public.pages(key) on update cascade on delete cascade,
  section_key text not null,
  heading text,
  subheading text,
  body text[] not null default '{}',           -- paragraphs
  image text,
  link_label text,
  link_url text,
  sort_order int not null default 0,
  updated_at timestamptz not null default now(),
  unique (page_key, section_key)
);
comment on table public.page_sections is 'Free-form blocks: About story, RFID, CTAs, Getting There, Location, Group Booking.';

create table public.section_images (
  id bigint generated always as identity primary key,
  page_key text not null,
  section_key text not null,
  src text not null,
  alt text not null default '',
  sort_order int not null default 0,
  foreign key (page_key, section_key) references public.page_sections(page_key, section_key) on update cascade on delete cascade
);

-- ── Home: Explore Z features ───────────────────────────────────────────────
create table public.features (
  id text primary key,                         -- rooms, cafe, roofdeck, hood
  heading text not null,
  subheading text,
  body text[] not null default '{}',
  link_label text,
  link_url text,
  link_external boolean not null default false,
  show_book_now boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);
comment on table public.features is 'Homepage "Explore Z" rows (carousel + text).';

create table public.feature_images (
  id bigint generated always as identity primary key,
  feature_id text not null references public.features(id) on update cascade on delete cascade,
  src text not null,
  alt text not null default '',
  caption text,                                -- vertical caption on the slide
  sort_order int not null default 0
);

-- ── Rooms ──────────────────────────────────────────────────────────────────
create table public.rooms (
  id text primary key,                         -- 4-bed, private-room, ...
  section text not null check (section in ('mixed_dorms', 'private_rooms')),
  room_type text not null check (room_type in ('dorm', 'private', 'mixed')),
  name text not null,
  tagline text,
  description text[] not null default '{}',
  notes text[] not null default '{}',          -- "*Room Size: 15 sqm." etc., as published
  published_price text[] not null default '{}',-- price lines exactly as shown on the site
  price_note text,                             -- "*Price may vary"
  price_from_php int check (price_from_php > 0),
  price_unit text check (price_unit in ('per bed', 'per room')),
  room_size_sqm numeric(6,1) check (room_size_sqm > 0),
  booking_url text not null,
  is_published boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);
comment on table public.rooms is 'Room types. published_price is the display text; price_from_php/room_size_sqm are parsed from it (null when the site gives several prices).';
comment on column public.rooms.price_from_php is 'Published "from" rate in PHP, not a live rate. Live prices are on Cloudbeds.';

create table public.room_images (
  id bigint generated always as identity primary key,
  room_id text not null references public.rooms(id) on update cascade on delete cascade,
  src text not null,
  alt text not null default '',
  sort_order int not null default 0
);

create table public.amenities (
  id bigint generated always as identity primary key,
  label text not null unique,
  icon text not null,
  show_on_home boolean not null default true,
  show_on_rooms boolean not null default true,
  sort_order int not null default 0
);

create table public.reviews (
  id bigint generated always as identity primary key,
  page_key text not null references public.pages(key) on update cascade on delete cascade,
  stars smallint not null check (stars between 1 and 5),
  glyphs text,                                 -- star text exactly as printed, if different
  title text not null,
  text text not null,
  image text,
  platform text,
  platform_logo text,
  platform_logo_width int,
  platform_logo_height int,
  sort_order int not null default 0
);
comment on table public.reviews is 'Reviews as quoted on the site (Home and Rooms pages).';

-- ── Events & Activities ────────────────────────────────────────────────────
create table public.activities (
  id bigint generated always as identity primary key,
  title text not null,
  detail text,                                 -- "From 6:00 PM to 7:00 PM everyday!" / "Coming Soon"
  image text,
  sort_order int not null default 0
);

create table public.activity_descriptions (
  id bigint generated always as identity primary key,
  label text not null,
  text text not null,
  sort_order int not null default 0
);

create table public.venues (
  id bigint generated always as identity primary key,
  type text not null check (type in ('z_street', 'tour')),
  name text not null,
  kind text,                                   -- "Hong Kong Roast", "Oyster Bar", ...
  description text[] not null default '{}',
  image text,
  url text,
  link_label text,
  is_published boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now(),
  unique (type, name)
);
comment on table public.venues is 'Z Street restaurants/bars and Tours (flip cards on Events & Activities).';

-- ── Gallery ────────────────────────────────────────────────────────────────
create table public.gallery_albums (
  id bigint generated always as identity primary key,
  year int not null,
  title text not null unique,
  sort_order int not null default 0
);

create table public.gallery_images (
  id bigint generated always as identity primary key,
  album_id bigint not null references public.gallery_albums(id) on delete cascade,
  src text not null,
  alt text,
  sort_order int not null default 0
);

-- ── Blog ───────────────────────────────────────────────────────────────────
create table public.posts (
  id bigint primary key,                       -- WordPress post ID
  slug text not null unique,
  title text not null,
  published_at timestamp not null,             -- site-local time, as WordPress shows it
  modified_at timestamp,
  categories text[] not null default '{}',
  excerpt text,
  featured_image_src text,
  featured_image_alt text,
  featured_image_width int,
  featured_image_height int,
  content_html text not null,
  source_url text,
  is_published boolean not null default true,
  updated_at timestamptz not null default now()
);
comment on table public.posts is 'Blog posts imported from WordPress. content_html uses root-relative links and /wp-content/ image paths.';

-- ── Indexes (foreign keys and common sorts) ────────────────────────────────
create index on public.page_sections (page_key);
create index on public.section_images (page_key, section_key);
create index on public.feature_images (feature_id);
create index on public.room_images (room_id);
create index on public.reviews (page_key);
create index on public.gallery_images (album_id);
create index on public.posts (published_at desc);

-- ── updated_at triggers ────────────────────────────────────────────────────
do $$ declare t text; begin
  foreach t in array array['site_settings','pages','page_sections','features','rooms','venues','posts'] loop
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ── Security: public read-only ─────────────────────────────────────────────
do $$ declare t text; begin
  foreach t in array array['site_settings','nav_items','pages','page_sections','section_images','features','feature_images',
                           'rooms','room_images','amenities','reviews','activities','activity_descriptions','venues',
                           'gallery_albums','gallery_images','posts'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('grant select on public.%I to anon, authenticated', t);
    if t in ('rooms','venues','posts') then
      execute format('create policy "Public can read published" on public.%I for select to anon, authenticated using (is_published)', t);
    else
      execute format('create policy "Public can read" on public.%I for select to anon, authenticated using (true)', t);
    end if;
  end loop;
end $$;
