import type { Img } from "../data/types";
import { assetUrl } from "../utils/assets";

/** Cover-cropped photo slide. Uses a real <img> (not a CSS background) so it lazy-loads and carries alt text. */
export function PhotoSlide({ img, eager = false }: { img: Img; eager?: boolean }) {
  return (
    <div className="photo-slide">
      <img
        src={assetUrl(img.src)}
        alt={img.alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      {img.caption && <div className="photo-slide__caption" aria-hidden="true">{img.caption}</div>}
    </div>
  );
}

export function SectionTitle({ children, as: Tag = "h2", tight = false }: { children: React.ReactNode; as?: "h1" | "h2"; tight?: boolean }) {
  return <Tag className={`title-bar${tight ? " title-bar--tight" : ""}`}>{children}</Tag>;
}
