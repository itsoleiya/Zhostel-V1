-- Adapted from itsoleiya/tabi-tabi-po supabase/migrations/20261013101012_tabi_v4_remove_ticket_emails.sql
-- Unchanged (drops are IF EXISTS; leaves email_status default = skipped).

-- Ticket emails removed (decision 2026-10-13). Guests get their QR on screen,
-- can download it, and can recover it by re-entering their email on the site.
drop trigger if exists tabi_rsvp_email_ins on public.tabi_rsvps;
drop trigger if exists tabi_rsvp_email_upd on public.tabi_rsvps;
drop trigger if exists tabi_rsvp_email on public.tabi_rsvps;
do $$ begin perform cron.unschedule('tabi-email-sweep'); exception when others then null; end $$;
drop function if exists public.admin_retry_emails(text);
drop function if exists public.tabi_email_sweep();
drop function if exists public.tabi_rsvp_email_trigger();
update public.tabi_rsvps set email_status = 'skipped' where email_status <> 'skipped';
alter table public.tabi_rsvps alter column email_status set default 'skipped';
