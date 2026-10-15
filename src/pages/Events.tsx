import Hero from "../components/Hero";
import { SectionTitle } from "../components/Media";
import { FlipGrid } from "../components/Sections";
import { activities, tours, zStreet } from "../data/events";
import { heroes, pageMeta } from "../data/pages";
import { assetUrl } from "../utils/assets";
import { usePageMeta } from "../utils/meta";
import "./pages.css";

export default function Events() {
  usePageMeta({ title: pageMeta.events.title, path: pageMeta.events.slug });
  return (
    <>
      <Hero data={heroes.events} />
      <main id="content">
        <section className="section section--grey" id="activities">
          <div className="container text-center">
            <SectionTitle>Activities</SectionTitle>
            <ul className="activity-cards">
              {activities.cards.map((c) => (
                <li key={c.title} className="activity-card">
                  <div className="activity-card__photo"><img src={assetUrl(c.image)} alt="" width={390} height={400} loading="lazy" /></div>
                  <h3><b>{c.title}</b> {c.detail}</h3>
                </li>
              ))}
            </ul>
            <ul className="activity-details">
              {activities.details.map((d) => (
                <li key={d.label}><strong>{d.label}</strong>: {d.text}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section section--grey" id="z-street">
          <div className="container text-center">
            <SectionTitle>Z Street</SectionTitle>
            <FlipGrid items={zStreet} variant="logo" />
          </div>
        </section>

        <section className="section section--white" id="tours">
          <div className="container text-center">
            <SectionTitle>Tours (Coming Soon)</SectionTitle>
            <FlipGrid items={tours} variant="photo" />
          </div>
        </section>
      </main>
    </>
  );
}
