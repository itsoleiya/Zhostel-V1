import { useEffect } from "react";
import { SITE_URL } from "../config/site";

function setMeta(attr: "name" | "property", key: string, value: string | null) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!value) { el?.remove(); return; }
  if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.content = value;
}

/** Sets <title>, description, Open Graph and a canonical URL built from VITE_SITE_URL. */
export function usePageMeta({ title, description = null, path, image }: { title: string; description?: string | null; path: string; image?: string }) {
  useEffect(() => {
    document.title = title;
    const url = `${SITE_URL}${path}`;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title.replace(/ \| Z Hostel$/, "") || "Z Hostel");
    setMeta("property", "og:url", url);
    setMeta("property", "og:description", description);
    if (image) setMeta("property", "og:image", image);
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = url;
  }, [title, description, path, image]);
}
