import { useRef, useState, type FormEvent } from "react";
import Hero from "../components/Hero";
import { heroes } from "../data/pages";
import { careersIntro, cvRules, jobs, privacyNotice } from "../data/careers";
import { supabase } from "../lib/supabase";
import { usePageMeta } from "../utils/meta";
import "./pages.css";
import "./Careers.css";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; name: string } | { kind: "error"; message: string };
type Fields = { position: string; name: string; email: string; phone: string; message: string; consent: boolean };

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function safeFileName(name: string) {
  const dot = name.lastIndexOf(".");
  const ext = dot > 0 ? name.slice(dot).toLowerCase() : "";
  const base = (dot > 0 ? name.slice(0, dot) : name).normalize("NFKD").replace(/[^\w.-]+/g, "-").replace(/-+/g, "-").slice(0, 80) || "cv";
  return base + ext;
}

export default function Careers() {
  usePageMeta({
    title: "Careers | Z Hostel",
    path: "/careers/",
    description: "Join the Z Hostel team in Poblacion, Makati. See our open positions and apply online.",
  });

  const formRef = useRef<HTMLElement>(null);
  const [f, setF] = useState<Fields>({ position: "", name: "", email: "", phone: "", message: "", consent: false });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [open, setOpen] = useState<string | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => setF((s) => ({ ...s, [k]: v }));

  function applyFor(title: string) {
    set("position", title);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!f.position) e.position = "Choose the position you're applying for.";
    if (f.name.trim().length < 2) e.name = "Enter your full name.";
    if (!EMAIL_RE.test(f.email.trim())) e.email = "Enter a valid email address.";
    if (f.phone.replace(/\D/g, "").length < 7) e.phone = "Enter a valid mobile number.";
    if (!file) e.cv = "Attach your CV (PDF or Word).";
    else if (!cvRules.types.includes(file.type) && !/\.(pdf|docx?)$/i.test(file.name)) e.cv = "Your CV must be a PDF or Word file.";
    else if (file.size > cvRules.maxBytes) e.cv = "Your CV must be 5 MB or smaller.";
    if (!f.consent) e.consent = "Please agree to the privacy notice to continue.";
    return e;
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length || !file) return;
    setStatus({ kind: "sending" });
    try {
      const sb = supabase();
      const path = `pending/${crypto.randomUUID()}/${safeFileName(file.name)}`;
      const contentType = cvRules.types.includes(file.type) ? file.type
        : /\.pdf$/i.test(file.name) ? "application/pdf"
        : /\.docx$/i.test(file.name) ? cvRules.types[2] : cvRules.types[1];
      const up = await sb.storage.from("careers-cvs").upload(path, file, { contentType, upsert: false });
      if (up.error) throw new Error("We couldn't upload your CV. Check the file and try again.");
      const { data: id, error } = await sb.rpc("careers_apply", {
        p_position: f.position, p_full_name: f.name, p_email: f.email, p_phone: f.phone,
        p_message: f.message, p_cv_path: path, p_cv_filename: file.name, p_consent: f.consent,
        p_website: honeypot.current?.value ?? "",
      });
      if (error) throw new Error(error.message && error.message.length < 160 ? error.message : "Something went wrong. Please try again.");
      // Email HR in the background; the application is already saved even if this fails.
      sb.functions.invoke("careers-notify", { body: { id } }).catch(() => {});
      setStatus({ kind: "sent", name: f.name.trim().split(/\s+/)[0] });
      setF({ position: "", name: "", email: "", phone: "", message: "", consent: false });
      setFile(null);
      if (fileInput.current) fileInput.current.value = "";
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong. Please try again." });
    }
  }

  const fieldProps = (k: string) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `err-${k}` : undefined });

  return (
    <>
      <Hero data={heroes.careers} />
      <main id="content" className="careers">
        <section className="section section--white careers-intro">
          <div className="container text-center">
            <p className="careers-kicker">{careersIntro.kicker}</p>
            <h2 className="careers-title">{careersIntro.title}</h2>
            <p className="careers-lede">{careersIntro.lede}</p>
          </div>
        </section>

        <section className="section section--grey careers-jobs" aria-labelledby="open-positions">
          <div className="container">
            <h2 id="open-positions" className="careers-h2">Available positions</h2>
            <ul className="job-list">
              {jobs.map((j) => {
                const isOpen = open === j.id;
                return (
                  <li key={j.id} className={`job-card${isOpen ? " is-open" : ""}`}>
                    <div className="job-card__head">
                      <div>
                        <h3>{j.title}</h3>
                        <p className="job-card__meta">{j.type} · {j.location}</p>
                        <p className="job-card__summary">{j.summary}</p>
                      </div>
                      <div className="job-card__actions">
                        <button type="button" className="job-btn job-btn--ghost" aria-expanded={isOpen} aria-controls={`job-${j.id}`}
                          onClick={() => setOpen(isOpen ? null : j.id)}>{isOpen ? "Hide details" : "View details"}</button>
                        <button type="button" className="job-btn" onClick={() => applyFor(j.title)}>Apply now</button>
                      </div>
                    </div>
                    <div className="job-card__body" id={`job-${j.id}`} hidden={!isOpen}>
                      <div>
                        <h4>What you'll do</h4>
                        <ul>{j.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul>
                      </div>
                      <div>
                        <h4>What we're looking for</h4>
                        <ul>{j.qualifications.map((q) => <li key={q}>{q}</li>)}</ul>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section ref={formRef} className="section section--white careers-apply" aria-labelledby="apply-heading" id="apply">
          <div className="container">
            <h2 id="apply-heading" className="careers-h2">Apply now</h2>
            <p className="careers-apply__note">
              Fill in the form and attach your CV. Prefer email? Send your CV to{" "}
              <a href={`mailto:${careersIntro.hrEmail}`}>{careersIntro.hrEmail}</a>.
            </p>

            {status.kind === "sent" ? (
              <div className="apply-done" role="status">
                <h3>Thank you, {status.name}!</h3>
                <p>We received your application. Our HR team will review it and contact you if your profile matches the role.</p>
                <button type="button" className="job-btn job-btn--ghost" onClick={() => setStatus({ kind: "idle" })}>Submit another application</button>
              </div>
            ) : (
              <form className="apply-form" noValidate onSubmit={onSubmit}>
                <label htmlFor="ap-position">Position *</label>
                <select id="ap-position" value={f.position} onChange={(e) => set("position", e.target.value)} {...fieldProps("position")}>
                  <option value="">Choose a position</option>
                  {jobs.map((j) => <option key={j.id} value={j.title}>{j.title}</option>)}
                </select>
                {errors.position && <p className="field-error" id="err-position">{errors.position}</p>}

                <div className="apply-form__row">
                  <div>
                    <label htmlFor="ap-name">Full name *</label>
                    <input id="ap-name" autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} maxLength={120} {...fieldProps("name")} />
                    {errors.name && <p className="field-error" id="err-name">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="ap-phone">Mobile number *</label>
                    <input id="ap-phone" type="tel" autoComplete="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} maxLength={30} {...fieldProps("phone")} />
                    {errors.phone && <p className="field-error" id="err-phone">{errors.phone}</p>}
                  </div>
                </div>

                <label htmlFor="ap-email">Email address *</label>
                <input id="ap-email" type="email" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} maxLength={200} {...fieldProps("email")} />
                {errors.email && <p className="field-error" id="err-email">{errors.email}</p>}

                <label htmlFor="ap-cv">CV / resume * <span className="hint">PDF or Word, max 5 MB</span></label>
                <input id="ap-cv" ref={fileInput} type="file" accept={cvRules.accept} onChange={(e) => setFile(e.target.files?.[0] ?? null)} {...fieldProps("cv")} />
                {errors.cv && <p className="field-error" id="err-cv">{errors.cv}</p>}

                <label htmlFor="ap-message">Message <span className="hint">optional</span></label>
                <textarea id="ap-message" rows={5} value={f.message} onChange={(e) => set("message", e.target.value)} maxLength={3000}
                  placeholder="Tell us a bit about yourself and why you'd like to join Z Hostel." />

                <div className="hp" aria-hidden="true">
                  <label htmlFor="ap-website">Website</label>
                  <input id="ap-website" ref={honeypot} tabIndex={-1} autoComplete="off" />
                </div>

                <div className="apply-privacy">
                  <p className="apply-privacy__title">Privacy notice</p>
                  {privacyNotice.map((p) => <p key={p}>{p}</p>)}
                </div>
                <label className="apply-consent">
                  <input type="checkbox" checked={f.consent} onChange={(e) => set("consent", e.target.checked)} {...fieldProps("consent")} />
                  <span>I have read the privacy notice and agree to Z Hostel processing my data for this application. *</span>
                </label>
                {errors.consent && <p className="field-error" id="err-consent">{errors.consent}</p>}

                <button type="submit" className="job-btn apply-submit" disabled={status.kind === "sending"}>
                  {status.kind === "sending" ? "Sending…" : "Submit application"}
                </button>
                <div role="status" aria-live="polite">
                  {status.kind === "error" && <p className="bad">Not sent: {status.message}</p>}
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
