import { useMemo, useRef, useState, type FormEvent } from "react";
import Hero from "../components/Hero";
import { heroes } from "../data/pages";
import {
  ADDITIONAL_GUEST_RATE, MENU_MIN_PAX, eventTypes, exclusions, inclusions, menuNote, menuSets,
  packagesIntro, peso, spaces, startTimes,
} from "../data/eventPackages";
import { supabase } from "../lib/supabase";
import { usePageMeta } from "../utils/meta";
import "./pages.css";
import "./EventPackages.css";

type F = { eventType: string; space: string; date: string; time: string; guests: string; menu: string; name: string; mobile: string; email: string; company: string; notes: string };
const EMPTY: F = { eventType: "", space: "", date: "", time: "", guests: "", menu: "", name: "", mobile: "", email: "", company: "", notes: "" };
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const todayManila = () => new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);

export default function EventPackages() {
  usePageMeta({
    title: "Event Packages | Z Hostel",
    path: "/event-packages/",
    description: "Barkada, birthday, corporate and private events at Z Hostel, Poblacion Makati. No venue fee: fully consumable packages for the Sundeck, Roofdeck, Salakot Lounge and Theater.",
  });

  const formRef = useRef<HTMLElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const [f, setF] = useState<F>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ kind: "idle" | "sending" | "sent" | "error"; msg?: string }>({ kind: "idle" });
  const set = (k: keyof F, v: string) => setF((s) => ({ ...s, [k]: v }));

  const space = spaces.find((s) => s.id === f.space);
  const menu = menuSets.find((m) => m.id === f.menu);
  const guests = Math.max(0, parseInt(f.guests, 10) || 0);

  // Venue rate (+ ₱1,500 per extra guest) is a MINIMUM consumable spend. With a set menu, the bill is
  // whichever is higher: the minimum or the set menu total (can go above the minimum, never below).
  const est = useMemo(() => {
    if (!space) return null;
    const extra = Math.max(0, guests - space.capacity);
    const minimum = space.rate + extra * ADDITIONAL_GUEST_RATE;
    const food = menu?.price && guests ? menu.price * guests : null;
    const total = food ? Math.max(minimum, food) : minimum;
    return { extra, minimum, food, total };
  }, [space, menu, guests]);

  function pickSpace(id: string) {
    set("space", id);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!f.eventType) e.eventType = "Choose the type of event.";
    if (!f.space) e.space = "Choose a venue.";
    if (!f.date) e.date = "Choose your preferred date.";
    else if (f.date < todayManila()) e.date = "Choose a future date.";
    if (!guests) e.guests = "Enter the number of guests.";
    else if (menu?.price && guests < MENU_MIN_PAX) e.guests = `Menu sets need at least ${MENU_MIN_PAX} guests.`;
    if (f.name.trim().length < 2) e.name = "Enter your name.";
    if (f.mobile.replace(/\D/g, "").length < 7) e.mobile = "Enter a valid mobile number.";
    if (!EMAIL_RE.test(f.email.trim())) e.email = "Enter a valid email address.";
    return e;
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) return;
    setStatus({ kind: "sending" });
    const spaceLabel = space ? `${space.name}${space.option ? ` (${space.option})` : ""}` : f.space;
    const sb = supabase();
    const { data: id, error } = await sb.rpc("event_inquiry_submit", {
      p_event_type: eventTypes.find((t) => t.id === f.eventType)?.title ?? f.eventType,
      p_space: spaceLabel, p_event_date: f.date, p_start_time: f.time, p_guests: guests,
      p_menu_set: menu ? menu.name : "", p_full_name: f.name, p_mobile: f.mobile, p_email: f.email,
      p_company: f.company, p_notes: f.notes, p_estimate: est?.total ?? null, p_website: honeypot.current?.value ?? "",
    });
    if (error) { setStatus({ kind: "error", msg: error.message && error.message.length < 160 ? error.message : "Something went wrong. Please try again." }); return; }
    // Notify the reservations team by email (set up after launch); the inquiry is already saved either way.
    sb.functions.invoke("inquiry-notify", { body: { id } }).catch(() => {});
    setStatus({ kind: "sent", msg: f.name.trim().split(/\s+/)[0] });
    setF(EMPTY);
  }

  const fp = (k: string) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `ep-err-${k}` : undefined });
  const Err = ({ k }: { k: string }) => (errors[k] ? <p className="ep-field-error" id={`ep-err-${k}`}>{errors[k]}</p> : null);

  return (
    <>
      <Hero data={heroes.eventPackages} />
      <main id="content" className="ep">
        <section className="section section--white ep-intro">
          <div className="container text-center">
            <h2 className="ep-title">{packagesIntro.title}</h2>
            <p className="ep-lede">{packagesIntro.lede}</p>
            <p className="ep-badge"><b>{packagesIntro.badge}</b> <span>{packagesIntro.badgeNote}</span></p>
            <ul className="ep-types">
              {eventTypes.map((t) => (
                <li key={t.id}><h3>{t.title}</h3><p>{t.text}</p></li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section section--grey" aria-labelledby="ep-spaces">
          <div className="container">
            <h2 id="ep-spaces" className="ep-h2">Our event spaces</h2>
            <p className="ep-sub">Each rate is a <b>minimum consumable spend</b>: no venue fee, just enjoy it on anything from the Z Hostel menu or a curated menu set. Your bill can go above the minimum, never below. Every package is 4 hours with exclusive use of the space. Additional guests: {peso(ADDITIONAL_GUEST_RATE)} each (fully consumable).</p>
            <ul className="ep-spaces">
              {spaces.map((s) => (
                <li key={s.id} className="ep-space">
                  <img src={s.image} alt={`${s.name} at Z Hostel`} loading="lazy" width={800} height={533} />
                  <div className="ep-space__body">
                    <h3>{s.name}</h3>
                    {s.option && <p className="ep-space__opt">{s.option}</p>}
                    <p className="ep-price">Starts at <b>{peso(s.rate)}</b> <span>fully consumable</span></p>
                    <ul className="ep-facts">
                      <li><span>Guest capacity</span>{s.capacityLabel}</li>
                      <li><span>Duration</span>4 hours</li>
                      <li><span>Accommodation</span>{s.rooms === 1 ? "1 room" : `${s.rooms} rooms`}</li>
                      <li><span>Parking</span>{s.parking === 1 ? "1 free slot" : `${s.parking} free slots`}</li>
                      {s.idealFor && <li><span>Ideal for</span>{s.idealFor}</li>}
                    </ul>
                    <button type="button" className="ep-btn" onClick={() => pickSpace(s.id)}>Inquire for this space</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section section--white" aria-labelledby="ep-inc">
          <div className="container ep-incwrap">
            <div>
              <h2 id="ep-inc" className="ep-h2 ep-left">Inclusions</h2>
              <ul className="ep-check">{inclusions.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
            <div className="ep-excl">
              <h3>Not included</h3>
              <ul>{exclusions.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          </div>
        </section>

        <section className="section section--dark ep-menus" aria-labelledby="ep-menu">
          <div className="container">
            <h2 id="ep-menu" className="ep-h2">Curated menu sets</h2>
            <p className="ep-sub">{menuNote} A set menu counts toward your venue's minimum spend: if the set menu total is higher, that becomes your bill.</p>
            <ul className="ep-menu-list">
              {menuSets.map((m) => (
                <li key={m.id} className="ep-menu">
                  <h3>{m.name}</h3>
                  <p className="ep-menu__price">{m.price ? `${peso(m.price)} per person` : "Personalized quote"}</p>
                  {m.sections.map((sec) => (
                    <div key={sec.heading}>
                      <h4>{sec.heading}</h4>
                      <ul>{sec.items.map((it) => <li key={it}>{it}</li>)}</ul>
                    </div>
                  ))}
                  {m.note && <p className="ep-menu__note">{m.note}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section ref={formRef} id="inquire" className="section section--white" aria-labelledby="ep-form">
          <div className="container ep-formwrap">
            <h2 id="ep-form" className="ep-h2">Inquire now</h2>
            <p className="ep-sub">Tell us about your event and our team will get back to you with availability and a quote. Prefer to talk? Call <a href={`tel:${packagesIntro.phone.replace(/\s/g, "")}`}>{packagesIntro.phone}</a> or email <a href={`mailto:${packagesIntro.email}`}>{packagesIntro.email}</a>.</p>

            {status.kind === "sent" ? (
              <div className="ep-done" role="status">
                <h3>Thank you, {status.msg}!</h3>
                <p>We received your inquiry. Our reservations team will contact you soon to confirm availability and your quote.</p>
                <button type="button" className="ep-btn ep-btn--ghost" onClick={() => setStatus({ kind: "idle" })}>Send another inquiry</button>
              </div>
            ) : (
              <form className="ep-form" noValidate onSubmit={onSubmit}>
                <div className="ep-grid">
                  <div>
                    <label htmlFor="ep-type">Type of event *</label>
                    <select id="ep-type" value={f.eventType} onChange={(e) => set("eventType", e.target.value)} {...fp("eventType")}>
                      <option value="">Choose one</option>
                      {eventTypes.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
                    </select><Err k="eventType" />
                  </div>
                  <div>
                    <label htmlFor="ep-space">Venue *</label>
                    <select id="ep-space" value={f.space} onChange={(e) => set("space", e.target.value)} {...fp("space")}>
                      <option value="">Choose a space</option>
                      {spaces.map((s) => <option key={s.id} value={s.id}>{s.name}{s.option ? ` – ${s.option.replace(/^Option \d: /, "")}` : ""} ({s.capacityLabel})</option>)}
                    </select><Err k="space" />
                  </div>
                  <div>
                    <label htmlFor="ep-date">Preferred date *</label>
                    <input id="ep-date" type="date" min={todayManila()} value={f.date} onChange={(e) => set("date", e.target.value)} {...fp("date")} /><Err k="date" />
                  </div>
                  <div>
                    <label htmlFor="ep-time">Start time</label>
                    <select id="ep-time" value={f.time} onChange={(e) => set("time", e.target.value)}>
                      <option value="">Choose a time</option>
                      {startTimes.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="ep-guests">Number of guests *</label>
                    <input id="ep-guests" type="number" inputMode="numeric" min={1} max={500} value={f.guests} onChange={(e) => set("guests", e.target.value)} {...fp("guests")} /><Err k="guests" />
                  </div>
                  <div>
                    <label htmlFor="ep-menuset">Menu set</label>
                    <select id="ep-menuset" value={f.menu} onChange={(e) => set("menu", e.target.value)}>
                      <option value="">Undecided / à la carte</option>
                      {menuSets.map((m) => <option key={m.id} value={m.id}>{m.name}{m.price ? ` – ${peso(m.price)}/person` : " – personalized quote"}</option>)}
                    </select>
                  </div>
                </div>

                {est && (
                  <div className="ep-est" aria-live="polite">
                    <p className="ep-est__title">Your estimate</p>
                    <div className="ep-est__row"><span>{space!.name}{space!.option ? ` (${space!.option.replace(/^Option \d: /, "")})` : ""}, up to {space!.capacity} guests</span><b>{peso(space!.rate)}</b></div>
                    {est.extra > 0 && <div className="ep-est__row"><span>{est.extra} additional guest{est.extra > 1 ? "s" : ""} × {peso(ADDITIONAL_GUEST_RATE)}</span><b>{peso(est.extra * ADDITIONAL_GUEST_RATE)}</b></div>}
                    <div className="ep-est__row"><span>Minimum consumable spend</span><b>{peso(est.minimum)}</b></div>
                    {est.food !== null && menu && (
                      <div className="ep-est__row"><span>{menu.name} set menu: {guests} × {peso(menu.price!)}</span><b>{peso(est.food)}</b></div>
                    )}
                    <div className="ep-est__row ep-est__total"><span>Estimated total</span><b>{peso(est.total)}</b></div>
                    <p className="ep-est__note">
                      {est.food === null
                        ? menu ? `${menu.name} menu: our chef will send a personalized quote. Your bill won't go below the minimum spend.`
                          : "Spend your minimum on anything from the Z Hostel menu. Your bill can go above it, never below."
                        : est.food >= est.minimum
                          ? `Your ${menu!.name} set menu is above the minimum spend, so your estimate is the set menu total.`
                          : `Your ${menu!.name} set menu is below the minimum spend. The remaining ${peso(est.minimum - est.food)} can be spent on drinks or anything else from our menu.`}
                    </p>
                    <p className="ep-est__note">Estimate only. Our reservations team will confirm the final quote.</p>
                  </div>
                )}

                <div className="ep-grid">
                  <div><label htmlFor="ep-name">Your name *</label><input id="ep-name" autoComplete="name" maxLength={120} value={f.name} onChange={(e) => set("name", e.target.value)} {...fp("name")} /><Err k="name" /></div>
                  <div><label htmlFor="ep-company">Company or group</label><input id="ep-company" autoComplete="organization" maxLength={120} value={f.company} onChange={(e) => set("company", e.target.value)} /></div>
                  <div><label htmlFor="ep-mobile">Mobile *</label><input id="ep-mobile" type="tel" autoComplete="tel" maxLength={30} placeholder="09XX XXX XXXX" value={f.mobile} onChange={(e) => set("mobile", e.target.value)} {...fp("mobile")} /><Err k="mobile" /></div>
                  <div><label htmlFor="ep-email">Email *</label><input id="ep-email" type="email" autoComplete="email" maxLength={200} value={f.email} onChange={(e) => set("email", e.target.value)} {...fp("email")} /><Err k="email" /></div>
                </div>
                <label htmlFor="ep-notes">Anything else?</label>
                <textarea id="ep-notes" rows={4} maxLength={3000} placeholder="Program, dietary needs, extras like a DJ or styling…" value={f.notes} onChange={(e) => set("notes", e.target.value)} />
                <div className="ep-hp" aria-hidden="true"><label htmlFor="ep-website">Website</label><input id="ep-website" ref={honeypot} tabIndex={-1} autoComplete="off" /></div>
                <button type="submit" className="ep-btn ep-submit" disabled={status.kind === "sending"}>{status.kind === "sending" ? "Sending…" : "Send my inquiry"}</button>
                <div role="status" aria-live="polite">{status.kind === "error" && <p className="ep-bad">Not sent: {status.msg}</p>}</div>
              </form>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
