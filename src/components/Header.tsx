import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navigation, site } from "../data/site";
import { Facebook, Instagram, Youtube } from "./Icons";
import "./Header.css";

/** Top strip (phones + Share), the rotated "Z Hostel" menu tab, and the slide-out menu panel. */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLButtonElement>(null);
  const { pathname, hash } = useLocation();

  useEffect(() => setOpen(false), [pathname, hash]);
  useEffect(() => { if (panelRef.current) panelRef.current.inert = !open; }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const first = panelRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); tabRef.current?.focus(); }
      if (e.key === "Tab" && panelRef.current) {
        const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a, button"));
        const i = items.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i === 0) { e.preventDefault(); items[items.length - 1].focus(); }
        if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  const isCurrent = (to: string) =>
    to === "/" ? pathname === "/" && hash !== "#contact-us" : to === "/#contact-us" ? pathname === "/" && hash === "#contact-us" : pathname.startsWith(to);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="site-header__bar container">
        <div className="site-header__phone">
          <a href={`tel:${site.phones[0].tel}`}>{site.phones[0].label}</a> |{" "}
          <a href={`tel:${site.phones[1].tel}`}>{site.phones[1].label}</a>
        </div>
        <div className="site-header__share">
          <b>Share</b>
          <span className="site-header__share-btns">
            <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Z Hostel on Facebook"><Facebook size={14} /></a>
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Z Hostel on Instagram"><Instagram size={14} /></a>
            <a href={site.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="Z Hostel on YouTube"><Youtube size={14} /></a>
          </span>
        </div>
      </div>

      <button
        ref={tabRef}
        type="button"
        className={`menu-tab${open ? " is-hidden" : ""}`}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen(true)}
      >
        <span className="menu-tab__lines" aria-hidden="true"><span /><span /><span /></span>
        <b>Z Hostel</b>
        <span className="sr-only">Open menu</span>
      </button>

      <div className={`menu-scrim${open ? " is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <div
        id="site-menu"
        ref={panelRef}
        className={`menu-panel${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
      >
        <div className="menu-panel__logo" aria-hidden="true">
          Z Hostel
        </div>
        <button type="button" className="menu-panel__close" onClick={() => { setOpen(false); tabRef.current?.focus(); }}>
          <span aria-hidden="true" /><span aria-hidden="true" />
          <span className="sr-only">Close menu</span>
        </button>
        <nav className="menu-panel__body" aria-label="Main">
          <ul>
            {navigation.map((item) => (
              <li key={item.to} className={"long" in item ? "is-long" : undefined}>
                <Link to={item.to} aria-current={isCurrent(item.to) ? "page" : undefined}>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="menu-panel__social">
            Follow Us
            <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={20} /></a>
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={20} /></a>
            <a href={site.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube size={20} /></a>
          </div>
        </nav>
      </div>
    </header>
  );
}
