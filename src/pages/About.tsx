import { useState } from "react";
import Hero from "../components/Hero";
import Carousel from "../components/Carousel";
import { SectionTitle } from "../components/Media";
import { DarkPanelSlide } from "../components/Split";
import { about, heroes, pageMeta } from "../data/pages";
import { assetUrl } from "../utils/assets";
import { usePageMeta } from "../utils/meta";
import "./pages.css";

export default function About() {
  usePageMeta({ title: pageMeta.about.title, path: pageMeta.about.slug });
  const [playing, setPlaying] = useState(false);
  return (
    <>
      <Hero data={heroes.about} />
      <main id="content">
        <section className="section section--white" id="about">
          <div className="container text-center">
            <SectionTitle>{about.hey}</SectionTitle>
            <div className="about-split">
              <div className="about-video on-dark">
                {playing ? (
                  <iframe src={about.video.embed} title="Z Hostel in 1 minute" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
                ) : (
                  <button type="button" onClick={() => setPlaying(true)} style={{ backgroundImage: `url(${assetUrl(about.video.image)})` }}>
                    <span className="about-video__label">{about.video.lines.map((l) => <span key={l} className="about-video__line">{l}</span>)}</span>
                    <span className="sr-only"> — play video</span>
                  </button>
                )}
              </div>
              <div className="about-text">
                <h2>{about.basicTitle}</h2>
                <h3>{about.heading}</h3>
                {about.body.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          </div>
        </section>

        <section className="section section--photo section--fixed on-dark" id="con_rfid" style={{ backgroundImage: `url(${assetUrl(about.rfid.background)})` }}>
          <div className="overlay" style={{ opacity: 0.5 }} />
          <div className="container text-center">
            <h2 className="rfid-title">{about.rfid.title}</h2>
            <h3 className="rfid-sub title-bar">{about.rfid.subtitle}</h3>
            <Carousel
              items={about.rfid.blocks}
              controls="below"
              label="About RFID at Z"
              className="rfid-slider"
              render={(b) => (
                <DarkPanelSlide image={b.image} alt="Z Hostel RFID wristbands">
                  <div className="text-left">
                    <h2>{b.heading}</h2>
                    <p>{b.body}</p>
                  </div>
                </DarkPanelSlide>
              )}
            />
          </div>
        </section>
      </main>
    </>
  );
}
