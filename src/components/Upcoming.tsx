import { useEffect, useState } from "react";
import { upcomingEvents, upcomingSection } from "../data/upcoming";
import type { UpcomingEvent } from "../data/types";
import "./Upcoming.css";

const pad = (n: number) => String(n).padStart(2, "0");

function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(t);
  }, [intervalMs]);
  return now;
}

function Countdown({ event, now }: { event: UpcomingEvent; now: number }) {
  const start = Date.parse(event.startsAt);
  const end = Date.parse(event.endsAt);
  if (now >= start && now < end) {
    return <p className="upc-live"><span aria-hidden="true" />Happening now</p>;
  }
  const s = Math.max(0, Math.floor((start - now) / 1000));
  const parts = [
    { v: Math.floor(s / 86400), l: "Days" },
    { v: Math.floor((s % 86400) / 3600), l: "Hrs" },
    { v: Math.floor((s % 3600) / 60), l: "Min" },
    { v: s % 60, l: "Sec" },
  ];
  return (
    <div className="upc-count">
      {/* Screen readers get one calm sentence instead of a ticking clock. */}
      <p className="sr-only">Starts in {parts[0].v} days and {parts[1].v} hours.</p>
      <ul aria-hidden="true">
        {parts.map((p) => (
          <li key={p.l}><b>{pad(p.v)}</b><span>{p.l}</span></li>
        ))}
      </ul>
    </div>
  );
}

function isExternal(url: string) { return /^https?:\/\//.test(url); }

function Btn({ href, kind, children }: { href: string; kind: "primary" | "ghost"; children: React.ReactNode }) {
  const ext = isExternal(href);
  // Relative URLs point at static pages in this site (e.g. events/tabi-tabi-po/); prefix the deploy base.
  if (!ext && !href.startsWith("/")) href = import.meta.env.BASE_URL + href;
  return (
    <a className={`upc-btn upc-btn--${kind}`} href={href} target={ext ? "_blank" : undefined} rel={ext ? "noopener noreferrer" : undefined}>
      {children}{ext && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}

/** "Coming up / Halloween at Z" — two event cards with live countdowns, as on zhostel.github.io/events/. */
export default function Upcoming({ id = "coming-up" }: { id?: string }) {
  const now = useNow();
  const live = upcomingEvents.filter((e) => now < Date.parse(e.endsAt));
  if (live.length === 0) return null;

  return (
    <section className="upc" id={id} aria-labelledby={`${id}-title`}>
      <div className="container">
        <p className="upc-kicker">{upcomingSection.kicker}</p>
        <h2 className="upc-title" id={`${id}-title`}>{upcomingSection.title}</h2>
        <div className="upc-grid">
          {live.map((e) => (
            <article className="upc-card" key={e.id} aria-labelledby={`${id}-${e.id}`}>
              <img className="upc-card__img" src={/^(https?:)?\/\//.test(e.image) ? e.image : import.meta.env.BASE_URL + e.image} alt={e.imageAlt} loading="lazy" decoding="async" />
              <div className="upc-card__body">
                <p className="upc-pill"><span aria-hidden="true" />{e.tag}</p>
                <h3 className="upc-card__title" id={`${id}-${e.id}`}>{e.title}</h3>
                <p className="upc-date">{e.dateText}</p>
                <p className="upc-venue">{e.venue}</p>
                <Countdown event={e} now={now} />
                <p className="upc-desc">{e.description}</p>
                <div className="upc-actions">
                  <Btn href={e.primary.url} kind="primary">{e.primary.label}</Btn>
                  <Btn href={e.secondary.url} kind="ghost">{e.secondary.label}</Btn>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
