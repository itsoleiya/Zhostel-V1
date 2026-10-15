-- Applied earlier as "grant_contact_form_insert". The website may only INSERT these columns.
grant insert (name, email, subject, message, page) on table public.contact_messages to anon, authenticated;
