-- Fills the website content tables from this repo's data files (supabase/content.json, src/data/posts.json).
-- Run in the Supabase SQL editor. Safe to re-run: it replaces all content rows.
-- To load a specific version, change 'main' below to a commit SHA.
begin;
create extension if not exists http with schema extensions;
create temp table _src on commit drop as
select
  (select content::jsonb from extensions.http_get('https://raw.githubusercontent.com/soleiyait8/Zhostel-V1/main/supabase/content.json')) as c,
  (select content::jsonb from extensions.http_get('https://raw.githubusercontent.com/soleiyait8/Zhostel-V1/main/src/data/posts.json')) as p;

truncate public.site_settings, public.nav_items, public.pages, public.page_sections, public.section_images,
  public.features, public.feature_images, public.rooms, public.room_images, public.amenities, public.reviews,
  public.activities, public.activity_descriptions, public.venues, public.gallery_albums, public.gallery_images,
  public.posts restart identity cascade;

insert into public.site_settings (id, name, tagline, booking_url, email, group_email, address, address_short, phones, social,
  copyright, footer_title, help_text, map_embed_url, map_link, cover_video, menu_pdf, directions_pdf, contact_subjects)
select 1, x->>'name', x->>'tagline', x->>'booking_url', x->>'email', x->>'group_email', x->>'address', x->>'address_short',
  x->'phones', x->'social', x->>'copyright', x->>'footer_title', x->>'help_text', x->>'map_embed_url', x->>'map_link',
  x->>'cover_video', x->>'menu_pdf', x->>'directions_pdf', array(select jsonb_array_elements_text(x->'contact_subjects'))
from _src, jsonb_array_elements(c->'site_settings') x;

insert into public.nav_items (label, path, is_long, sort_order)
select r.* from _src, jsonb_to_recordset(c->'nav_items') r(label text, path text, is_long boolean, sort_order int);

insert into public.pages (key, slug, title, meta_description, navigation_label, source_url, hero_image, hero_logo, hero_title, hero_subtitle, hero_copyright)
select r.* from _src, jsonb_to_recordset(c->'pages') r(key text, slug text, title text, meta_description text, navigation_label text,
  source_url text, hero_image text, hero_logo text, hero_title text, hero_subtitle text, hero_copyright text);

insert into public.page_sections (page_key, section_key, heading, subheading, body, image, link_label, link_url, sort_order)
select x->>'page_key', x->>'section_key', x->>'heading', x->>'subheading', array(select jsonb_array_elements_text(x->'body')),
  x->>'image', x->>'link_label', x->>'link_url', (x->>'sort_order')::int
from _src, jsonb_array_elements(c->'page_sections') x;

insert into public.section_images (page_key, section_key, src, alt, sort_order)
select r.* from _src, jsonb_to_recordset(c->'section_images') r(page_key text, section_key text, src text, alt text, sort_order int);

insert into public.features (id, heading, subheading, body, link_label, link_url, link_external, show_book_now, sort_order)
select x->>'id', x->>'heading', x->>'subheading', array(select jsonb_array_elements_text(x->'body')), x->>'link_label', x->>'link_url',
  (x->>'link_external')::boolean, (x->>'show_book_now')::boolean, (x->>'sort_order')::int
from _src, jsonb_array_elements(c->'features') x;

insert into public.feature_images (feature_id, src, alt, caption, sort_order)
select r.* from _src, jsonb_to_recordset(c->'feature_images') r(feature_id text, src text, alt text, caption text, sort_order int);

insert into public.rooms (id, section, room_type, name, tagline, description, notes, published_price, price_note, price_from_php,
  price_unit, room_size_sqm, booking_url, sort_order)
select x->>'id', x->>'section', x->>'room_type', x->>'name', x->>'tagline',
  array(select jsonb_array_elements_text(x->'description')), array(select jsonb_array_elements_text(x->'notes')),
  array(select jsonb_array_elements_text(x->'published_price')), x->>'price_note', (x->>'price_from_php')::int,
  x->>'price_unit', (x->>'room_size_sqm')::numeric, x->>'booking_url', (x->>'sort_order')::int
from _src, jsonb_array_elements(c->'rooms') x;

insert into public.room_images (room_id, src, alt, sort_order)
select r.* from _src, jsonb_to_recordset(c->'room_images') r(room_id text, src text, alt text, sort_order int);

insert into public.amenities (label, icon, show_on_home, show_on_rooms, sort_order)
select r.* from _src, jsonb_to_recordset(c->'amenities') r(label text, icon text, show_on_home boolean, show_on_rooms boolean, sort_order int);

insert into public.reviews (page_key, stars, glyphs, title, text, image, platform, platform_logo, platform_logo_width, platform_logo_height, sort_order)
select r.* from _src, jsonb_to_recordset(c->'reviews') r(page_key text, stars smallint, glyphs text, title text, text text, image text,
  platform text, platform_logo text, platform_logo_width int, platform_logo_height int, sort_order int);

insert into public.activities (title, detail, image, sort_order)
select r.* from _src, jsonb_to_recordset(c->'activities') r(title text, detail text, image text, sort_order int);

insert into public.activity_descriptions (label, text, sort_order)
select r.* from _src, jsonb_to_recordset(c->'activity_descriptions') r(label text, text text, sort_order int);

insert into public.venues (type, name, kind, description, image, url, link_label, sort_order)
select x->>'type', x->>'name', x->>'kind', array(select jsonb_array_elements_text(x->'description')), x->>'image', x->>'url',
  x->>'link_label', (x->>'sort_order')::int
from _src, jsonb_array_elements(c->'venues') x;

insert into public.gallery_albums (year, title, sort_order)
select r.* from _src, jsonb_to_recordset(c->'gallery_albums') r(year int, title text, sort_order int);

insert into public.gallery_images (album_id, src, sort_order)
select a.id, r.src, r.sort_order
from _src, jsonb_to_recordset(c->'gallery_images') r(album_title text, src text, sort_order int)
join public.gallery_albums a on a.title = r.album_title;

insert into public.posts (id, slug, title, published_at, modified_at, categories, excerpt, featured_image_src, featured_image_alt,
  featured_image_width, featured_image_height, content_html, source_url)
select (x->>'id')::bigint, x->>'slug', x->>'title', (x->>'date')::timestamp, (x->>'modified')::timestamp,
  array(select jsonb_array_elements_text(x->'categories')), x->>'excerpt',
  x->'featuredImage'->>'src', x->'featuredImage'->>'alt', (x->'featuredImage'->>'width')::int, (x->'featuredImage'->>'height')::int,
  x->>'contentHtml', x->>'sourceUrl'
from _src, jsonb_array_elements(p) x;

commit;
