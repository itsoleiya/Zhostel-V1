import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { BackToTop, BookFloat } from "../components/Chrome";

/** Shared chrome for every page. Handles scroll position on navigation and #hash targets. */
export default function SiteLayout() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      // Wait a frame so the target page has rendered.
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <>
      <a className="skip-link" href="#content">Skip to content</a>
      <Header />
      <Outlet />
      <BookFloat />
      <BackToTop />
      <Footer />
    </>
  );
}
