// Writes dist/sitemap.xml and dist/robots.txt for THIS deployment (VITE_SITE_URL), after `vite build`.
import { readFileSync, writeFileSync, existsSync, copyFileSync } from "node:fs";
import { loadEnv } from "./env.mjs";

const env = loadEnv();
const site = (env.VITE_SITE_URL || "https://zhostel.com").replace(/\/$/, "");
const posts = JSON.parse(readFileSync("src/data/posts.json", "utf8"));
const perPage = 10;

const urls = [
  ["/", null], ["/about-z/", null], ["/rooms-and-services/", null], ["/events-and-activities/", null],
  ["/gallery/", null], ["/contact-us/", null], ["/blog/", posts[0]?.modified],
  ...Array.from({ length: Math.ceil(posts.length / perPage) - 1 }, (_, i) => [`/blog/page/${i + 2}/`, null]),
  ...posts.map((p) => [`/${p.slug}/`, p.modified]),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, mod]) => `  <url><loc>${site}${u}</loc>${mod ? `<lastmod>${mod.slice(0, 10)}</lastmod>` : ""}</url>`).join("\n")}
</urlset>
`;
if (!existsSync("dist")) { console.error("dist/ not found — run vite build first."); process.exit(1); }
writeFileSync("dist/sitemap.xml", xml);
// GitHub Pages has no rewrites: it serves 404.html for unknown paths, so make that the app too.
copyFileSync("dist/index.html", "dist/404.html");
writeFileSync("dist/robots.txt", `User-agent: *\nAllow: /\nDisallow: /events/tabi-tabi-po/admin.html\n\nSitemap: ${site}/sitemap.xml\n`);
console.log(`sitemap.xml: ${urls.length} URLs for ${site}`);
