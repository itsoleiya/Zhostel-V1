/**
 * Content model. Every value here was copied from the live site (zhostel.com, audited Oct 2026).
 * `null` means the original site does not publish that value.
 */

/** A path like "/wp-content/uploads/…" (resolved through assetUrl) or a full URL. */
export type AssetPath = string;

export interface Img {
  src: AssetPath;
  alt: string;
  /** Vertical caption shown on carousel slides, as on the original. */
  caption?: string;
}

export interface Hero {
  /** Background photo. When null the looping cover video plays instead (as on Contact/Blog). */
  image: AssetPath | null;
  logo: AssetPath | null;
  title: string | null;
  subtitle: string | null;
  /** Small rotated credit at the right edge, e.g. "@ ZHostel 2018". */
  copyright: string | null;
}

export interface PageMeta {
  slug: string;
  title: string;
  metaDescription: string | null;
  navigationLabel: string | null;
  sourceUrl: string;
}

export interface Feature {
  id: string;
  heading: string;
  subheading: string | null;
  body: string[];
  images: Img[];
  link: { label: string; url: string; external?: boolean } | null;
  showBookNow: boolean;
}

export interface Room {
  id: string;
  name: string;
  tagline: string | null;
  description: string[];
  notes: string[];
  /** Price text exactly as published, e.g. "PHP 1350 / bed with breakfast". */
  publishedPrice: string[];
  priceNote: string | null;
  images: Img[];
  bookingUrl: string;
}

export interface Amenity { label: string; icon: string; }

export interface Review {
  stars: number;
  /** Star glyphs exactly as printed (the home page shows "★★★★☆", the rooms page "★★★★"). */
  glyphs?: string;
  title: string;
  text: string;
  image: AssetPath;
  platform: { name: string; logo: AssetPath; width: number; height: number };
}

export interface GalleryAlbum { title: string; images: AssetPath[]; }
export interface GalleryYear { year: string; albums: GalleryAlbum[]; }

export interface Venue {
  name: string;
  kind: string | null;
  description: string[];
  image: AssetPath;
  url: string | null;
  linkLabel: string | null;
}

export interface Post {
  id: number;
  slug: string;
  title: string;
  date: string;
  modified: string;
  categories: string[];
  excerpt: string;
  featuredImage: { src: AssetPath; alt: string; width: number | null; height: number | null } | null;
  contentHtml: string;
  sourceUrl: string;
}
