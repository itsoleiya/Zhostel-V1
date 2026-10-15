import { useEffect, useRef, useState } from "react";
import { site } from "../data/site";
import "./Chrome.css";

/** "|| book now ||" fixed tab on the right edge. */
export function BookFloat() {
  return (
    <a className="book-float" href={site.bookingUrl} target="_blank" rel="noopener noreferrer">
      || book now ||<span className="sr-only"> (opens the Cloudbeds booking page)</span>
    </a>
  );
}

/** Arrow that appears once you scroll, as on the original. */
export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const f = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <button
      type="button"
      className={`back-to-top${show ? " is-visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0 })}
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
    >
      <svg viewBox="0 0 24 24" width="36" height="36" aria-hidden="true"><path d="M12 4v17M5 11l7-7 7 7" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
      <span className="sr-only">Back to top</span>
    </button>
  );
}

/** Reveals children once they scroll into view (used for the footer help strip and amenity rows). */
export function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}
