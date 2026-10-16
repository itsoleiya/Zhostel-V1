-- Adapted from itsoleiya/tabi-tabi-po supabase/migrations/20261013095730_tabi_v2_drop_legacy_rsvp_create.sql
-- Unchanged. (20261013095032_tabi_v2_email_trigger_fix.sql is skipped: email triggers only.)

-- Replaced by rsvp_register (which enforces privacy consent).
drop function if exists public.rsvp_create(text, text, text, text, text);
