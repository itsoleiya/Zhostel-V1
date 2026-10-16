-- Pin search_path on the two helper functions flagged by the Supabase security advisor.
alter function public.tabi_event_nights() set search_path = '';
alter function public.tabi_current_night() set search_path = '';
