import { ASSET_ORIGIN } from "../config/site";

/** Resolve a "/wp-content/…" path against the configured asset origin. Full URLs pass through. */
export function assetUrl(path: string): string {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  return `${ASSET_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Rewrite every root-relative /wp-content/ reference inside an HTML string (src, srcset, href). */
export function resolveHtmlAssets(html: string): string {
  return html.replace(/(^|[\s"',(])\/wp-content\//g, `$1${ASSET_ORIGIN}/wp-content/`);
}
