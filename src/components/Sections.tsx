import { useState, type FormEvent } from "react";
import { site } from "../data/site";
import type { Amenity, Review, Venue } from "../data/types";
import { CONTACT_ENDPOINT } from "../config/site";
import { assetUrl } from "../utils/assets";
import Carousel from "./Carousel";
import { useInView } from "./Chrome";
import { AmenityIcon } from "./Icons";
import { SectionTitle } from "./Media";
import { DarkPanelSlide } from "./Split";
import "./Sections.css";

/** Full-width photo band with title and a yellow outline button (#cta_manila, #cta_getting_there). */
export function PhotoCta({ title, image, button, url, external, dots = true, fixed = true, children }: {
  title: string; image: string; button?: string; url?: string; external?: boolean; dots?: boolean; fixed?: boolean; children?: React.ReactNode;
}) {
  const isFile = url?.endsWith(".pdf");
  return (
    <section className={`section section--photo${fixed ? " section--fixed" : ""} on-dark`} style={{ backgroundImage: `url(${assetUrl(image)})` }}>
      {dots && <div className="overlay overlay--dots" style={{ opacity: 0.5 }} />}
      <div className="container text-center">
        <SectionTitle tight>{title}</SectionTitle>
        {button && url && (
          <div>
            <a className="btn-outline" href={isFile ? assetUrl(url) : url} target={external || isFile ? "_blank" : undefined} rel={external || isFile ? "noopener noreferrer" : undefined}>
              <span>{button}</span>
            </a>
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function AmenityGrid({ items }: { items: Amenity[] }) {
  const { ref, inView } = useInView<HTMLUListElement>(0.15);
  return (
    <ul ref={ref} className={`amenities${inView ? " is-active" : ""}`}>
      {items.map((a, i) => (
        <li key={a.label} className="amenity" style={{ transitionDelay: `${(i % 3) * 120}ms` }}>
          <AmenityIcon name={a.icon} size={40} />
          <h3><b>{a.label}</b></h3>
        </li>
      ))}
    </ul>
  );
}

/** Reviews slider. Text is exactly what the original publishes; star glyphs match each slide. */
export function ReviewsSlider({ reviews }: { reviews: Review[] }) {
  return (
    <Carousel
      items={reviews}
      controls="below"
      label="Guest reviews"
      className="reviews"
      render={(r) => (
        <DarkPanelSlide image={r.image} alt="">
          <div className="text-center">
            <h2 className="stars" aria-label={`${r.stars} out of 5 stars`}>
              <span aria-hidden="true">{r.glyphs ?? "★".repeat(r.stars)}</span>
            </h2>
            <h3>{r.title}</h3>
            <p>{r.text}</p>
            <p><a className="btn-dark" href={site.bookingUrl} target="_blank" rel="noopener noreferrer">BOOK NOW</a></p>
            <p><img src={assetUrl(r.platform.logo)} alt={`Review from ${r.platform.name}`} width={r.platform.width} height={r.platform.height} loading="lazy" /></p>
          </div>
        </DarkPanelSlide>
      )}
    />
  );
}

/** Flip card grid (.reg_special_offers): image face; hovering or focusing reveals the dark details face. */
export function FlipGrid({ items, variant }: { items: Venue[]; variant: "logo" | "photo" }) {
  return (
    <ul className={`flip-grid flip-grid--${variant}`}>
      {items.map((v) => {
        const external = v.url?.startsWith("http");
        return (
          <li key={v.name} className="flip-card">
            <a
              className="flip-card__inner"
              href={v.url ?? undefined}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
            >
              <div className="flip-card__back on-dark">
                <h3>{v.name}</h3>
                {v.kind && <h4>{v.kind}</h4>}
                {v.description.map((d, i) => <p key={i}>{d}</p>)}
                {v.linkLabel && <span className="btn-dark">{v.linkLabel}</span>}
              </div>
              <div className="flip-card__face" aria-hidden="true">
                <img src={assetUrl(v.image)} alt="" loading="lazy" />
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

type FormState = { status: "idle" } | { status: "sending" } | { status: "sent"; via: "endpoint" | "mail" } | { status: "error"; message: string };

/** Contact form with the original fields. Delivery: VITE_CONTACT_ENDPOINT if set, otherwise a pre-filled email. */
export function ContactForm() {
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: String(fd.get("your-name") ?? "").trim(),
      email: String(fd.get("your-email") ?? "").trim(),
      subject: String(fd.get("your-subject") ?? ""),
      message: String(fd.get("your-message") ?? "").trim(),
    };
    const errs: Record<string, string> = {};
    if (!data.name) errs.name = "Enter your name.";
    if (!data.email) errs.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = "Enter an email address like name@example.com.";
    if (!data.subject) errs.subject = "Choose what your message is about.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = form.querySelector<HTMLElement>(`[name="your-${Object.keys(errs)[0]}"]`);
      first?.focus();
      return;
    }

    if (!CONTACT_ENDPOINT) {
      const body = `${data.message}\n\n— ${data.name} (${data.email})`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
      setState({ status: "sent", via: "mail" });
      return;
    }
    setState({ status: "sending" });
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`The server answered ${res.status}.`);
      setState({ status: "sent", via: "endpoint" });
      form.reset();
    } catch (err) {
      setState({ status: "error", message: err instanceof Error ? err.message : "The message could not be sent." });
    }
  }

  const field = (name: string) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `err-${name}` : undefined,
  });

  return (
    <form className="contact-form" noValidate onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="cf-name">Name</label>
      <input id="cf-name" name="your-name" type="text" placeholder="Name" autoComplete="name" required {...field("name")} />
      {errors.name && <p className="field-error" id="err-name">{errors.name}</p>}

      <label className="sr-only" htmlFor="cf-email">Email Address</label>
      <input id="cf-email" name="your-email" type="email" placeholder="Email Address" autoComplete="email" required {...field("email")} />
      {errors.email && <p className="field-error" id="err-email">{errors.email}</p>}

      <label className="sr-only" htmlFor="cf-subject">Subject</label>
      <select id="cf-subject" name="your-subject" required defaultValue="" {...field("subject")}>
        <option value="">---</option>
        {site.contactSubjects.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      {errors.subject && <p className="field-error" id="err-subject">{errors.subject}</p>}

      <label className="sr-only" htmlFor="cf-message">Message</label>
      <textarea id="cf-message" name="your-message" rows={10} placeholder="Message" />

      <button type="submit" disabled={state.status === "sending"}>{state.status === "sending" ? "Sending…" : "Send"}</button>
      <div className="form-status" role="status" aria-live="polite">
        {state.status === "sent" && state.via === "endpoint" && <p className="ok">Message sent. The Z Hostel team will reply by email.</p>}
        {state.status === "sent" && state.via === "mail" && (
          <p className="ok">Your email app should open with the message filled in. Press send there to deliver it, or write to <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
        )}
        {state.status === "error" && (
          <p className="bad">Message not sent: {state.message} Try again, or email <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
        )}
      </div>
    </form>
  );
}

export function MapEmbed() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="map-embed">
      {!loaded && <div className="map-embed__placeholder">Loading map…</div>}
      <iframe
        title="Map showing Z Hostel, 5660 Don Pedro St., Poblacion, Makati"
        src={site.mapEmbed}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <a className="map-embed__link" href={site.mapLink} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
    </div>
  );
}

/** Big centered contact lines (font: 700 20px/20px Raleway, Arial on the original). */
export function ContactLines({ phones, address, email = true }: { phones: string; address: string; email?: boolean }) {
  return (
    <div className="contact-lines">
      <p>
        <a href={`tel:${site.phones[0].tel}`}>{phones.split(" or ")[0]}</a> or <a href={`tel:${site.phones[1].tel}`}>{phones.split(" or ")[1]}</a>
      </p>
      <p><a href={site.mapLink} target="_blank" rel="noopener noreferrer">{address}</a></p>
      {email && <p><a className="contact-lines__email" href={`mailto:${site.email}`}>{site.email}</a></p>}
    </div>
  );
}
