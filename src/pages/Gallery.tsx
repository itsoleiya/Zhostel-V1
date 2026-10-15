import Hero from "../components/Hero";
import Carousel from "../components/Carousel";
import { SectionTitle } from "../components/Media";
import { ContactLines, MapEmbed } from "../components/Sections";
import { gallery } from "../data/gallery";
import { heroes, locationBlock, pageMeta } from "../data/pages";
import { assetUrl } from "../utils/assets";
import { usePageMeta } from "../utils/meta";
import "./pages.css";

export function LocationSection() {
  return (
    <section className="section section--white">
      <div className="container text-center">
        <SectionTitle>Location</SectionTitle>
        <div className="contact-grid">
          <ContactLines phones={locationBlock.phones} address={locationBlock.address} email={false} />
          <MapEmbed />
        </div>
      </div>
    </section>
  );
}

export default function Gallery() {
  usePageMeta({ title: pageMeta.gallery.title, path: pageMeta.gallery.slug });
  return (
    <>
      <Hero data={heroes.gallery} />
      <main id="content">
        {gallery.map((y) => (
          <section className="section section--white" id={y.year} key={y.year}>
            <div className="container text-center">
              <SectionTitle>{y.year}</SectionTitle>
              <div className="gallery-grid">
                {y.albums.map((a) => (
                  <div className="gallery-album" key={a.title}>
                    <Carousel
                      items={a.images}
                      label={`${a.title} photos`}
                      render={(src, i) => (
                        <img src={assetUrl(src)} alt={`${a.title}, photo ${i + 1} of ${a.images.length}`} loading="lazy" decoding="async" />
                      )}
                    />
                    <div className="gallery-album__title on-dark" aria-hidden="true"><h3>{a.title}</h3></div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
        <LocationSection />
      </main>
    </>
  );
}
