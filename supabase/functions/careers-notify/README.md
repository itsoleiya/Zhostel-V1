Edge function `careers-notify` (deployed, verify_jwt = false). Emails HR each new application with the CV attached, via Resend.
Secrets (Supabase dashboard > Edge Functions > Secrets): RESEND_API_KEY (required), CAREERS_TO (default hr@zhostel.com),
CAREERS_FROM (default "Z Hostel Careers <careers@send.zhostel.com>"), CAREERS_DASHBOARD_URL.
Until RESEND_API_KEY is set, applications are still saved and visible in /careers/admin/; no email is sent.
