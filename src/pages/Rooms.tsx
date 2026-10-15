import Hero from "../components/Hero";
import { SectionTitle } from "../components/Media";
import { BookHeading, SplitRow } from "../components/Split";
import { AmenityGrid, ReviewsSlider } from "../components/Sections";
import Carousel from "../components/Carousel";
import { PhotoSlide } from "../components/Media";
import { heroes, pageMeta, roomServices } from "../data/pages";
import { groupBooking, mixedDorms, mixedDormsIntro, privateRooms, roomReviews } from "../data/rooms";
import { site } from "../data/site";
import type { Room } from "../data/types";
import { assetUrl } from "../utils/assets";
import { usePageMeta } from "../utils/meta";
import "./pages.css";

function RoomText({ room }: { room: Room }) {
  return (
    <>
      <BookHeading>{room.name}</BookHeading>
      {room.tagline && <h4>{room.tagline}</h4>}
      {room.description.map((d, i) => <p key={i} className={room.tagline ? "room-lead" : undefined}>{d}</p>)}
      {room.notes.map((n, i) => <p key={i} className="split-row__note">{n}</p>)}
      <h3 className="split-row__price">
        {room.publishedPrice.map((line, i) => <span key={i}>{line}</span>)}
      </h3>
      {room.priceNote && <p className="split-row__note">{room.priceNote}</p>}
    </>
  );
}

export default function Rooms() {
  usePageMeta({ title: pageMeta.rooms.title, path: pageMeta.rooms.slug });
  return (
    <>
      <Hero data={heroes.rooms} />
      <main id="content">
        <section className="section section--grey" id="rooms">
          <div className="container text-center">
            <SectionTitle>Rooms</SectionTitle>
            <h2 className="rooms-intro-title">{mixedDormsIntro.heading}</h2>
            <p className="rooms-intro">{mixedDormsIntro.body}</p>
            {mixedDorms.map((r, i) => (
              <SplitRow key={r.id} images={r.images} imageSide={i % 2 === 0 ? "left" : "right"} label={`${r.name} dorm photos`} tall>
                <RoomText room={r} />
              </SplitRow>
            ))}
          </div>
        </section>

        <section className="section section--grey section--flush-top" id="private-rooms">
          <div className="container text-center">
            {privateRooms.map((r, i) => (
              <SplitRow key={r.id} images={r.images} imageSide={i % 2 === 0 ? "right" : "left"} label={`${r.name} photos`} tall>
                <RoomText room={r} />
              </SplitRow>
            ))}
          </div>
        </section>

        <section className="section section--white" id="services">
          <div className="container text-center">
            <SectionTitle>Services</SectionTitle>
            <AmenityGrid items={roomServices} />
          </div>
        </section>

        <section className="section section--photo section--fixed on-dark" id="group_booking" style={{ backgroundImage: `url(${assetUrl(groupBooking.background)})` }}>
          <div className="overlay" style={{ opacity: 0.4 }} />
          <div className="container text-center">
            <SectionTitle>{groupBooking.title}</SectionTitle>
            <div className="split-row group-row">
              <div className="split-row__media">
                <Carousel items={groupBooking.images} label="Group booking photos" render={(img) => <PhotoSlide img={img} />} />
              </div>
              <div className="split-row__text" style={{ color: "#333" }}>
                <BookHeading>{groupBooking.heading}</BookHeading>
                <h4>{groupBooking.contactLabel}</h4>
                <p><a href={`mailto:${site.groupEmail}`} className="group-email">{site.groupEmail}</a></p>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--grey" id="review_section">
          <div className="container text-center">
            <SectionTitle>Room Reviews</SectionTitle>
            <ReviewsSlider reviews={roomReviews} />
          </div>
        </section>
      </main>
    </>
  );
}
