import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import "./Carousel.css";

interface Props<T> {
  items: T[];
  render: (item: T, index: number, active: boolean) => ReactNode;
  label: string;
  /** "inside": controls sit on the slide's bottom edge (photo carousels). "below": under the slides (reviews, RFID). */
  controls?: "inside" | "below";
  className?: string;
  autoPlayMs?: number;
}

/** Accessible slide carousel matching the theme's owl-carousel: dark square prev/next, thin line pager. */
export default function Carousel<T>({ items, render, label, controls = "inside", className = "", autoPlayMs }: Props<T>) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;
  const touchX = useRef<number | null>(null);
  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (!autoPlayMs || paused || count < 2) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % count), autoPlayMs);
    return () => window.clearInterval(t);
  }, [autoPlayMs, paused, count]);

  if (count === 0) return <div className="carousel carousel--empty">No images yet.</div>;

  return (
    <div
      className={`carousel carousel--${controls} ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
        if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
      }}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      <div className="carousel__viewport">
        <div className="carousel__track" style={{ transform: `translateX(-${index * 100}%)` }} aria-live="polite">
          {items.map((item, i) => (
            <div
              className="carousel__slide"
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== index}
              ref={(el) => { if (el) el.inert = i !== index; }}
            >
              {render(item, i, i === index)}
            </div>
          ))}
        </div>
      </div>
      {count > 1 && (
        <div className="carousel__controls">
          <div className="carousel__dots">
            {items.map((_, i) => (
              <button key={i} type="button" className={i === index ? "is-active" : ""} aria-label={`Show slide ${i + 1}`} aria-current={i === index} onClick={() => go(i)} />
            ))}
          </div>
          <div className="carousel__arrows">
            <button type="button" onClick={() => go(index - 1)} aria-label="Previous slide">
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M10 2 4 8l6 6" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
            </button>
            <button type="button" onClick={() => go(index + 1)} aria-label="Next slide">
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="m6 2 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
