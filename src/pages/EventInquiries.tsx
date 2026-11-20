import { useCallback, useEffect, useMemo, useState } from "react";
import { peso } from "../data/eventPackages";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { Login } from "./CareersAdmin";
import "./CareersAdmin.css";

type Inquiry = {
  id: string; created_at: string; event_type: string; space: string; event_date: string; start_time: string | null;
  guests: number; menu_set: string | null; full_name: string; mobile: string; email: string; company: string | null;
  notes: string | null; estimate: number | null; status: string; staff_notes: string | null;
};

const STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted", label: "Quoted" },
  { value: "confirmed", label: "Confirmed" },
  { value: "declined", label: "Declined" },
];
const fmtDateTime = (iso: string) => new Date(iso).toLocaleString("en-PH", { timeZone: "Asia/Manila", dateStyle: "medium", timeStyle: "short" });
const fmtDay = (d: string) => new Date(`${d}T00:00:00+08:00`).toLocaleDateString("en-PH", { timeZone: "Asia/Manila", weekday: "short", month: "short", day: "numeric", year: "numeric" });
const todayManila = () => new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);

/** "Event inquiries" tab: requests from zhostel.com/event-packages/. Access: table events_admins. */
export function Inquiries() {
  const sb = supabase();
  const [rows, setRows] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("all");
  const [when, setWhen] = useState<"upcoming" | "past" | "all">("upcoming");
  const [sort, setSort] = useState<"received" | "event">("received");
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    const { data, error } = await sb.from("event_inquiries")
      .select("id, created_at, event_type, space, event_date, start_time, guests, menu_set, full_name, mobile, email, company, notes, estimate, status, staff_notes")
      .order("created_at", { ascending: false }).limit(1000);
    if (error) setError("Couldn't load inquiries. Refresh the page or sign in again.");
    setRows((data as Inquiry[]) ?? []);
    setLoading(false);
  }, [sb]);
  useEffect(() => { load(); }, [load]);

  const today = todayManila();
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    for (const r of rows) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [rows]);
  const shown = rows
    .filter((r) => (status === "all" || r.status === status)
      && (when === "all" || (when === "upcoming" ? r.event_date >= today : r.event_date < today))
      && (!q.trim() || `${r.full_name} ${r.email} ${r.mobile} ${r.company ?? ""}`.toLowerCase().includes(q.trim().toLowerCase())))
    .sort((a, b) => (sort === "event" ? a.event_date.localeCompare(b.event_date) : b.created_at.localeCompare(a.created_at)));

  const patch = (id: string, change: Partial<Inquiry>) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...change } : r)));
  async function setRowStatus(r: Inquiry, value: string) {
    const prev = r.status; patch(r.id, { status: value });
    const { error } = await sb.from("event_inquiries").update({ status: value }).eq("id", r.id);
    if (error) { patch(r.id, { status: prev }); alert("Couldn't save the status. Try again."); }
  }
  async function saveNotes(r: Inquiry, value: string) {
    if ((r.staff_notes ?? "") === value) return;
    const { error } = await sb.from("event_inquiries").update({ staff_notes: value || null }).eq("id", r.id);
    if (error) alert("Couldn't save the notes. Try again."); else patch(r.id, { staff_notes: value || null });
  }
  async function remove(r: Inquiry) {
    if (!confirm(`Delete the inquiry from ${r.full_name}? This can't be undone.`)) return;
    const { error } = await sb.from("event_inquiries").delete().eq("id", r.id);
    if (error) alert("Couldn't delete. Try again."); else setRows((rs) => rs.filter((x) => x.id !== r.id));
  }

  return (
    <>
      <div className="ca-tabbar"><span /><button className="ca-btn" onClick={load}>Refresh</button></div>
      <div className="ca-stats">
        {[{ value: "all", label: "All" }, ...STATUSES].map((s) => (
          <button key={s.value} className={`ca-stat${status === s.value ? " is-active" : ""}`} onClick={() => setStatus(s.value)}>
            <b>{counts[s.value] ?? 0}</b><span>{s.label}</span>
          </button>
        ))}
      </div>
      <div className="ca-filters ca-filters--3">
        <select value={when} onChange={(e) => setWhen(e.target.value as typeof when)} aria-label="Event date">
          <option value="upcoming">Upcoming events</option><option value="past">Past events</option><option value="all">All dates</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sort">
          <option value="received">Newest inquiries first</option><option value="event">Soonest event first</option>
        </select>
        <input type="search" placeholder="Search name, email, mobile or company" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
      </div>
      {error && <p className="ca-error">{error}</p>}
      {loading ? <p className="ca-muted">Loading inquiries…</p> : shown.length === 0 ? (
        <p className="ca-muted">No inquiries {rows.length ? "match these filters" : "yet"}.</p>
      ) : (
        <ul className="ca-list">
          {shown.map((r) => (
            <li key={r.id} className="ca-card">
              <div className="ca-card__main">
                <h2>{r.full_name}{r.company ? <span className="ca-muted"> · {r.company}</span> : null}</h2>
                <p className="ca-pos">{r.event_type} · {r.space}</p>
                <p className="ca-event">
                  <b>{fmtDay(r.event_date)}</b>{r.start_time ? `, ${r.start_time}` : ""} · {r.guests} guest{r.guests === 1 ? "" : "s"}
                  {r.menu_set ? ` · ${r.menu_set} menu` : ""}{r.estimate ? ` · from ${peso(r.estimate)}` : ""}
                </p>
                <p className="ca-contact">
                  <a href={`tel:${r.mobile.replace(/[^\d+]/g, "")}`}>{r.mobile}</a> · <a href={`mailto:${r.email}`}>{r.email}</a>
                </p>
                <p className="ca-muted ca-small">Received {fmtDateTime(r.created_at)}</p>
                {r.notes && <p className="ca-message">{r.notes}</p>}
              </div>
              <div className="ca-card__side">
                <label className="ca-small" htmlFor={`is-${r.id}`}>Status</label>
                <select id={`is-${r.id}`} value={r.status} onChange={(e) => setRowStatus(r, e.target.value)}>
                  {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <label className="ca-small" htmlFor={`in-${r.id}`}>Team notes</label>
                <textarea id={`in-${r.id}`} rows={3} defaultValue={r.staff_notes ?? ""} onBlur={(e) => saveNotes(r, e.target.value.trim())} maxLength={5000} />
                <button className="ca-btn ca-btn--danger" onClick={() => remove(r)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/** Event inquiries dashboard at /event-packages/admin/. Access: Supabase login + email in table events_admins. */
export default function EventInquiriesAdmin() {
  const sb = supabase();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    document.title = "Event inquiries | Z Hostel";
    const robots = document.createElement("meta");
    robots.name = "robots"; robots.content = "noindex, nofollow";
    document.head.appendChild(robots);
    sb.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => { sub.subscription.unsubscribe(); robots.remove(); };
  }, [sb]);

  useEffect(() => {
    if (!session) { setAllowed(null); return; }
    sb.rpc("is_events_admin").then(({ data }) => setAllowed(data === true));
  }, [session, sb]);

  if (!ready) return <div className="ca-shell"><p className="ca-muted">Loading…</p></div>;
  if (!session) return <Login title="Event inquiries" />;
  if (allowed === null) return <div className="ca-shell"><p className="ca-muted">Checking access…</p></div>;
  if (!allowed) {
    return (
      <div className="ca-shell ca-narrow">
        <h1>No access</h1>
        <p>{session.user.email} doesn't have access to event inquiries. Ask IT to add you.</p>
        <button className="ca-btn" onClick={() => sb.auth.signOut()}>Sign out</button>
      </div>
    );
  }
  return (
    <div className="ca-shell">
      <header className="ca-top">
        <div><p className="ca-brand">Z Hostel</p><h1>Event inquiries</h1></div>
        <div className="ca-top__right">
          <span className="ca-muted ca-small">{session.user.email}</span>
          <button className="ca-btn" onClick={() => sb.auth.signOut()}>Sign out</button>
        </div>
      </header>
      <Inquiries />
    </div>
  );
}
