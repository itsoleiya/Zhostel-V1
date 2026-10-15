-- Supabase's default privileges give anon/authenticated ALL on new public tables.
-- Content tables must be strictly read-only for the website; TRUNCATE also bypasses RLS.
do $$ declare t text; begin
  foreach t in array array['site_settings','nav_items','pages','page_sections','section_images','features','feature_images',
                           'rooms','room_images','amenities','reviews','activities','activity_descriptions','venues',
                           'gallery_albums','gallery_images','posts'] loop
    execute format('revoke insert, update, delete, truncate, references, trigger on public.%I from anon, authenticated', t);
  end loop;
end $$;
revoke execute on function public.set_updated_at() from anon, authenticated, public;
drop extension if exists http;
