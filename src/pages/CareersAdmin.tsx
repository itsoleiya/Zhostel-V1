import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { applicationStatuses, jobs } from "../data/careers";
import { supabase } from "../lib/supabase";
import "./CareersAdmin.css";

type Application = {
  id: string; created_at: string; position: string; full_name: string; email: string; phone: string;
  message: string | null; cv_path: string; cv_filename: string; status: string; hr_notes: string | null; notified_at: string | null;
};

const fmt = (iso: string) => new Date(iso).toLocaleString("en-PH", { timeZone: "Asia/Manila", dateStyle: "medium", timeStyle: "short" });
const RETENTION_DAYS = 365;

/** HR dashboard at /careers/admin/. Access: Supabase Auth login + email listed in table careers_admins. */
export default function CareersAdmin() {
  const sb = supabase();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    document.title = "Careers dashboard | Z Hostel";
    const robots = document.createElement("meta");
    robots.name = "robots"; robots.content = "noindex, nofollow";
    document.head.appendChild(robots);
    sb.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => { sub.subscription.unsubscribe(); robots.remove(); };
  }, [sb]);

  useEffect(() => {
    if (!session) { setAllowed(null); return; }
    sb.rpc("is_careers_admin").then(({ data }) => setAllowed(data === true));
  }, [session, sb]);

  if (!ready) return <div className="ca-shell"><p className="ca-muted">Loading…</p></div>;
  if (!session) return <Login />;
  if (allowed === null) return <div className="ca-shell"><p className="ca-muted">Checking access…</p></div>;
  if (!allowed) {
    return (
      <div className="ca-shell ca-narrow">
        <h1>No access</h1>
        <p>{session.user.email} isn't on the careers dashboard list. Ask IT to add you.</p>
        <button className="ca-btn" onClick={() => sb.auth.signOut()}>Sign out</button>
      </div>
    );
  }
  return <Dashboard email={session.user.email ?? ""} />;
}

function Login() {
  const sb = supabase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function onSubmit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
    if (error) setError("Wrong email or password.");
    setBusy(false);
  }
  return (
    <div className="ca-shell ca-narrow">
      <p className="ca-brand">Z Hostel</p>
      <h1>Careers dashboard</h1>
      <form onSubmit={onSubmit} className="ca-login">
        <label htmlFor="ca-email">Email</label>
        <input id="ca-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label htmlFor="ca-pass">Password</label>
        <input id="ca-pass" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="ca-btn ca-btn--primary" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        {error && <p className="ca-error" role="alert">{error}</p>}
        <p className="ca-muted ca-small">Forgot your password? Ask IT to reset it.</p>
      </form>
    </div>
  );
}

function Dashboard({ email }: { email: string }) {
  const sb = supabase();
  const [rows, setRows] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("all");
  const [position, setPosition] = useState("all");
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    const { data, error } = await sb.from("job_applications")
      .select("id, created_at, position, full_name, email, phone, message, cv_path, cv_filename, status, hr_notes, notified_at")
      .order("created_at", { ascending: false }).limit(1000);
    if (error) setError("Couldn't load applications. Refresh the page or sign in again.");
    setRows((data as Application[]) ?? []);
    setLoading(false);
  }, [sb]);
  useEffect(() => { load(); }, [load]);

  const positions = useMemo(() => Array.from(new Set([...jobs.map((j) => j.title), ...rows.map((r) => r.position)])), [rows]);
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    for (const r of rows) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [rows]);
  const shown = rows.filter((r) =>
    (status === "all" || r.status === status) &&
    (position === "all" || r.position === position) &&
    (!q.trim() || `${r.full_name} ${r.email} ${r.phone}`.toLowerCase().includes(q.trim().toLowerCase())));

  const patch = (id: string, change: Partial<Application>) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...change } : r)));

  async function setAppStatus(r: Application, value: string) {
    const prev = r.status; patch(r.id, { status: value });
    const { error } = await sb.from("job_applications").update({ status: value }).eq("id", r.id);
    if (error) { patch(r.id, { status: prev }); alert("Couldn't save the status. Try again."); }
  }
  async function saveNotes(r: Application, value: string) {
    if ((r.hr_notes ?? "") === value) return;
    const { error } = await sb.from("job_applications").update({ hr_notes: value || null }).eq("id", r.id);
    if (error) alert("Couldn't save the notes. Try again."); else patch(r.id, { hr_notes: value || null });
  }
  async function openCv(r: Application) {
    const win = window.open("", "_blank");
    const { data, error } = await sb.storage.from("careers-cvs").createSignedUrl(r.cv_path, 300, { download: false });
    if (error || !data) { win?.close(); alert("Couldn't open the CV."); return; }
    if (win) win.location.href = data.signedUrl; else window.location.href = data.signedUrl;
  }
  async function remove(r: Application) {
    if (!confirm(`Delete ${r.full_name}'s application and CV permanently? This can't be undone.`)) return;
    const st = await sb.storage.from("careers-cvs").remove([r.cv_path]);
    const { error } = await sb.from("job_applications").delete().eq("id", r.id);
    if (error || st.error) alert("Something couldn't be deleted. Refresh and check again.");
    if (!error) setRows((rs) => rs.filter((x) => x.id !== r.id));
  }

  const old = rows.filter((r) => Date.now() - Date.parse(r.created_at) > RETENTION_DAYS * 864e5).length;

  return (
    <div className="ca-shell">
      <header className="ca-top">
        <div>
          <p className="ca-brand">Z Hostel</p>
          <h1>Careers dashboard</h1>
        </div>
        <div className="ca-top__right">
          <span className="ca-muted ca-small">{email}</span>
          <button className="ca-btn" onClick={load}>Refresh</button>
          <button className="ca-btn" onClick={() => sb.auth.signOut()}>Sign out</button>
        </div>
      </header>

      <div className="ca-stats">
        {[{ value: "all", label: "All" }, ...applicationStatuses].map((s) => (
          <button key={s.value} className={`ca-stat${status === s.value ? " is-active" : ""}`} onClick={() => setStatus(s.value)}>
            <b>{counts[s.value] ?? 0}</b><span>{s.label}</span>
          </button>
        ))}
      </div>

      <div className="ca-filters">
        <select value={position} onChange={(e) => setPosition(e.target.value)} aria-label="Filter by position">
          <option value="all">All positions</option>
          {positions.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <input type="search" placeholder="Search name, email or phone" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
      </div>

      {old > 0 && <p className="ca-warn">{old} application{old > 1 ? "s are" : " is"} older than 12 months. Under the privacy notice, please delete {old > 1 ? "them" : "it"}.</p>}
      {error && <p className="ca-error">{error}</p>}
      {loading ? <p className="ca-muted">Loading applications…</p> : shown.length === 0 ? (
        <p className="ca-muted">No applications {rows.length ? "match these filters" : "yet"}.</p>
      ) : (
        <ul className="ca-list">
          {shown.map((r) => (
            <li key={r.id} className="ca-card">
              <div className="ca-card__main">
                <h2>{r.full_name}</h2>
                <p className="ca-pos">{r.position}</p>
                <p className="ca-contact">
                  <a href={`mailto:${r.email}`}>{r.email}</a> · <a href={`tel:${r.phone.replace(/[^\d+]/g, "")}`}>{r.phone}</a>
                </p>
                <p className="ca-muted ca-small">
                  Received {fmt(r.created_at)} · {r.notified_at ? "Emailed to HR" : "Not emailed (check here)"}
                </p>
                {r.message && <p className="ca-message">{r.message}</p>}
              </div>
              <div className="ca-card__side">
                <button className="ca-btn ca-btn--primary" onClick={() => openCv(r)}>Open CV</button>
                <label className="ca-small" htmlFor={`st-${r.id}`}>Status</label>
                <select id={`st-${r.id}`} value={r.status} onChange={(e) => setAppStatus(r, e.target.value)}>
                  {applicationStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <label className="ca-small" htmlFor={`nt-${r.id}`}>HR notes</label>
                <textarea id={`nt-${r.id}`} rows={3} defaultValue={r.hr_notes ?? ""} onBlur={(e) => saveNotes(r, e.target.value.trim())} maxLength={5000} />
                <button className="ca-btn ca-btn--danger" onClick={() => remove(r)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
