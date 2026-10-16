import { useEffect, useRef, useState } from "react";
import type { Hero as HeroData } from "../data/types";
import { site } from "../data/site";
import { assetUrl } from "../utils/assets";
import { Tag } from "./Icons";
import "./Hero.css";

/**
 * Full-screen cover: photo (or looping cover video), logo, title, scroll cue and the white "Book Now" strip.
 * Phones (≤769px): the strip becomes a dark panel that slides in from the left, opened by the tag button
 * next to the menu button — exactly as the live theme does.
 */
export default function Hero({ data }: { data: HeroData }) {
  const [fade, setFade] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const openRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const onScroll = () => {
      setFade(Math.max(0, 1 - window.scrollY / 500));
      setScrolled(window.scrollY > 200); // the strip flips away after 200px, like the original
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!bookOpen) return;
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setBookOpen(false); openRef.current?.focus(); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [bookOpen]);

  const style = data.image ? { backgroundImage: `url(${assetUrl(data.image)})` } : undefined;

  return (
    <section className={`hero on-dark${bookOpen ? " hero--book-open" : ""}`} style={style} aria-label={data.title ?? "Z Hostel"}>
      {!reduced && (
        <video className="hero__video" autoPlay muted loop playsInline preload="metadata"
          poster={data.image ? assetUrl(data.image) : undefined} aria-hidden="true">
          <source src={assetUrl(site.coverVideo)} type="video/mp4" />
        </video>
      )}
      <div className="hero__overlay" />
      <div className="container hero__inner">
        {data.copyright && <div className="hero__copyright">{data.copyright}</div>}
        <div className="hero__text" style={{ opacity: fade }}>
          {data.logo && <p className="hero__logo-wrap"><img className="hero__logo" src={assetUrl(data.logo)} alt="Z Hostel" width={250} height={250} /></p>}
          {data.title && <h1 className="hero__title">{data.title}</h1>}
          {/* Always rendered, like the theme: its 20px margins set the block height even when empty. */}
          <p className="hero__subtitle" aria-hidden={data.subtitle ? undefined : true}>{data.subtitle}</p>
        </div>
        <a className="hero__scroll" href="#content">
          <b aria-hidden="true" />
          Scroll
        </a>
      </div>

      {/* Phone-only tag button (theme .reg_book) */}
      <button ref={openRef} type="button" className="hero__book-btn" aria-expanded={bookOpen} aria-controls="hero-book"
        onClick={() => setBookOpen(true)}>
        <Tag size={27} strokeWidth={1.4} aria-hidden="true" />
        <span className="sr-only">Book a room</span>
      </button>

      <div className="container hero__book-wrap">
        <div id="hero-book" ref={panelRef}
          className={`hero__book${scrolled ? " is-flipped" : ""}${bookOpen ? " is-open" : ""}`}>
          <span className="hero__book-row">
            <button type="button" className="hero__book-close" onClick={() => { setBookOpen(false); openRef.current?.focus(); }}>
              <span aria-hidden="true" /><span aria-hidden="true" />
              <span className="sr-only">Close</span>
            </button>
            <a className="title-bar" href={site.bookingUrl} target="_blank" rel="noopener noreferrer">Book Now</a>
          </span>
        </div>
      </div>
    </section>
  );
}
