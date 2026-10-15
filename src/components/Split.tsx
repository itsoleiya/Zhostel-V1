import type { ReactNode } from "react";
import type { Img } from "../data/types";
import { site } from "../data/site";
import Carousel from "./Carousel";
import { PhotoSlide } from "./Media";
import { Tag } from "./Icons";
import "./Split.css";

/** One row of the theme's alternating "carousel | white text block" layout (.reg_auto_height). */
export function SplitRow({
  images, imageSide = "left", label, children, tall = false,
}: { images: Img[]; imageSide?: "left" | "right"; label: string; children: ReactNode; tall?: boolean }) {
  return (
    <div className={`split-row split-row--img-${imageSide}${tall ? " split-row--tall" : ""}`}>
      <div className="split-row__media">
        <Carousel items={images} label={label} render={(img, i) => <PhotoSlide img={img} eager={i === 0 && false} />} />
      </div>
      <div className="split-row__text">{children}</div>
    </div>
  );
}

/** Heading with the yellow tag icon that reveals "Book Now" on hover (.reg_simple_block h2 a). */
export function BookHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="book-heading">
      {children}{" "}
      <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="book-heading__link">
        <Tag size={40} strokeWidth={1.4} aria-hidden="true" className="book-heading__icon" />
        <b>Book Now</b>
        <span className="sr-only"> (opens booking page)</span>
      </a>
    </h2>
  );
}

/** Image + dark text panel slide, used by Reviews and the About-page RFID slider. */
export function DarkPanelSlide({ image, alt, children }: { image: string; alt: string; children: ReactNode }) {
  return (
    <div className="dark-slide">
      <div className="dark-slide__media"><PhotoSlide img={{ src: image, alt }} /></div>
      <div className="dark-slide__panel on-dark">{children}</div>
    </div>
  );
}
