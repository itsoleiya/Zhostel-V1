import Hero from "../components/Hero";
import { SectionTitle } from "../components/Media";
import { BookHeading, SplitRow } from "../components/Split";
import { AmenityGrid, ContactForm, ContactLines, MapEmbed, PhotoCta, ReviewsSlider } from "../components/Sections";
import { exploreZ, heroes, homeAmenities, homeCtas, homeReviews, pageMeta } from "../data/pages";
import { site } from "../data/site";
import { assetUrl } from "../utils/assets";
import { usePageMeta } from "../utils/meta";
import Upcoming from "../components/Upcoming";
import { Link } from "react-router-dom";

export default function Home() {
  usePageMeta({ title: pageMeta.home.title, path: "/" });
  return (
    <>
      <Hero data={heroes.home} />
      <main id="content">
        <Upcoming />
        <section className="section section--grey" id="con_zexplore">
          <div className="container text-center">
            <SectionTitle>Explore Z</SectionTitle>
            {exploreZ.map((f, i) => (
              <SplitRow key={f.id} images={f.images} imageSide={i % 2 === 0 ? "left" : "right"} label={`${f.subheading} photos`}>
                <BookHeading>{f.heading}</BookHeading>
                {f.subheading && <h4>{f.subheading}</h4>}
                {f.body.map((p, j) => <p key={j}>{p}</p>)}
                {f.link && (
                  <p>
                    {f.link.external ? (
                      <a className="text-link" href={assetUrl(f.link.url)} target="_blank" rel="noopener noreferrer">{f.link.label}</a>
                    ) : (
                      <Link className="text-link" to={f.link.url}>{f.link.label}</Link>
                    )}
                  </p>
                )}
              </SplitRow>
            ))}
          </div>
        </section>

        <PhotoCta {...homeCtas.manila} />

        <section className="section section--white" id="services">
          <div className="container text-center">
            <SectionTitle>Amenities &amp; Services</SectionTitle>
            <AmenityGrid items={homeAmenities} />
          </div>
        </section>

        <PhotoCta {...homeCtas.gettingThere} dots={false} fixed={false} />

        <section className="section section--white" id="contact-us">
          <div className="container text-center">
            <SectionTitle>Contact Us</SectionTitle>
            <div className="contact-grid">
              <div>
                <ContactLines phones={`${site.phones[0].label} or ${site.phones[1].label}`} address={site.addressShort} />
                <ContactForm />
              </div>
              <MapEmbed />
            </div>
          </div>
        </section>

        <section className="section section--grey" id="review_section">
          <div className="container text-center">
            <SectionTitle>Reviews</SectionTitle>
            <ReviewsSlider reviews={homeReviews} />
          </div>
        </section>

        {/* The original embedded an Instagram feed here; its access token has expired, so it now shows only the title. */}
        <PhotoCta title={homeCtas.instagram.title} image={homeCtas.instagram.image} button="Follow on Instagram" url={site.social.instagram} external />
      </main>
    </>
  );
}
