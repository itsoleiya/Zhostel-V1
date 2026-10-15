import { useEffect, useRef, useState } from "react";
import type { Hero as HeroData } from "../data/types";
import { site } from "../data/site";
import { assetUrl } from "../utils/assets";
import "./Hero.css";

/** Full-screen cover: photo (or looping cover video), logo, title, scroll cue and the white "Book Now" strip. */
export default function Hero({ data }: { data: HeroData }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fade, setFade] = useState(1);
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const onScroll = () => setFade(Math.max(0, 1 - window.scrollY / 500));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The original always places the cover video on top of the photo; when the photo is blank
  // (Contact, Blog, posts) the video is all you see.
  const style = data.image ? { backgroundImage: `url(${assetUrl(data.image)})` } : undefined;

  return (
    <section className="hero on-dark" style={style} aria-label={data.title ?? "Z Hostel"}>
      {!reduced && (
        <video
          ref={videoRef}
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={data.image ? assetUrl(data.image) : undefined}
          aria-hidden="true"
        >
          <source src={assetUrl(site.coverVideo)} type="video/mp4" />
        </video>
      )}
      <div className="hero__overlay" />
      <div className="container hero__inner">
        {data.copyright && <div className="hero__copyright">{data.copyright}</div>}
        <div className="hero__text" style={{ opacity: fade }}>
          {data.logo && <img className="hero__logo" src={assetUrl(data.logo)} alt="Z Hostel" width={250} height={250} />}
          {data.title && <h1 className="hero__title">{data.title}</h1>}
          {data.subtitle && <p className="hero__subtitle">{data.subtitle}</p>}
          {!data.title && <h1 className="sr-only">Z Hostel</h1>}
        </div>
        <a className="hero__scroll" href="#content">
          <b aria-hidden="true" />
          Scroll
        </a>
      </div>
      <div className="container hero__book-wrap">
        <div className="hero__book">
          <a className="title-bar" href={site.bookingUrl} target="_blank" rel="noopener noreferrer">Book Now</a>
        </div>
      </div>
    </section>
  );
}
