import Hero from "../components/Hero";
import { gettingThere, heroes, pageMeta } from "../data/pages";
import { site } from "../data/site";
import { assetUrl } from "../utils/assets";
import { usePageMeta } from "../utils/meta";
import { LocationSection } from "./Gallery";
import "./pages.css";

export default function Contact() {
  usePageMeta({ title: pageMeta.contact.title, path: pageMeta.contact.slug });
  return (
    <>
      <Hero data={heroes.plain} />
      <main id="content">
        <h1 className="sr-only">Contact Us</h1>
        <section className="section section--white" id="cta_getting_there">
          <div className="container">
            <div className="split-row">
              <a className="pdf-block on-dark" href={assetUrl(site.directionsPdf)} target="_blank" rel="noopener noreferrer">
                <span className="title-bar">{gettingThere.pdfLabel}</span>
                <span className="sr-only"> directions to Z Hostel (PDF)</span>
              </a>
              <div className="split-row__text">
                <h2 className="book-heading">{gettingThere.heading}</h2>
                {gettingThere.body.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          </div>
        </section>
        <LocationSection />
      </main>
    </>
  );
}
