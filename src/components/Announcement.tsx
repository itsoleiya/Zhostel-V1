import { useEffect, useState } from "react";
import { announcement, upcomingEvents } from "../data/upcoming";
import "./Announcement.css";

/** Orange "Halloween at Z" bar above the header. Each link disappears after its event; the bar after the last one. */
export default function Announcement() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(t);
  }, []);

  const links = announcement.links.filter((l) => {
    const ev = upcomingEvents.find((e) => e.id === l.eventId);
    return !ev || now < Date.parse(ev.endsAt);
  });
  if (!links.length) return null;

  return (
    <aside className="announce" aria-label="Upcoming events">
      <p>
        <span className="announce__label">{announcement.label}</span>{" "}
        {links.map((l, i) => {
          const ext = /^https?:\/\//.test(l.url);
          const href = ext ? l.url : import.meta.env.BASE_URL + l.url;
          return (
            <span key={l.eventId}>
              {i > 0 && <span className="announce__sep" aria-hidden="true"> · </span>}
              <a href={href} target={ext ? "_blank" : undefined} rel={ext ? "noopener noreferrer" : undefined}>
                {l.text}{ext && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            </span>
          );
        })}
      </p>
    </aside>
  );
}
