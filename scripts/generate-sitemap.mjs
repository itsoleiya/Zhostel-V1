// Writes dist/sitemap.xml and dist/robots.txt for THIS deployment (VITE_SITE_URL), after `vite build`.
import { readFileSync, writeFileSync, existsSync, copyFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
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

// ...but 404.html is served with HTTP status 404, which search engines treat as "page missing".
// Write a real index.html for every known route (served with 200), each with its own <title>, description,
// canonical and Open Graph tags, so pages are indexable and link previews are right even before JS runs.
const shell = readFileSync("dist/index.html", "utf8");
const esc = (t) => String(t ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const pageTitles = {
  "/": ["Z Hostel", null], "/about-z/": ["About Z | Z Hostel", null],
  "/rooms-and-services/": ["Rooms and Services | Z Hostel", null], "/events-and-activities/": ["Events and Activities | Z Hostel", null],
  "/gallery/": ["Gallery | Z Hostel", null], "/contact-us/": ["Contact Us | Z Hostel", null], "/blog/": ["Blog | Z Hostel", null],
};
const totalPages = Math.ceil(posts.length / perPage);
for (let i = 2; i <= totalPages; i++) pageTitles[`/blog/page/${i}/`] = [`Blog | Page ${i} of ${totalPages} | Z Hostel`, null];
for (const p of posts) pageTitles[`/${p.slug}/`] = [`${p.title} | Z Hostel`, (p.excerpt || "").slice(0, 160), p.featuredImage?.src];
let written = 0;
for (const [route, [title, desc, image]] of Object.entries(pageTitles)) {
  const url = site + route;
  let html = shell.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  const extra = [
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    desc ? `<meta name="description" content="${esc(desc)}" />` : "",
    desc ? `<meta property="og:description" content="${esc(desc)}" />` : "",
  ].filter(Boolean).join("\n    ");
  html = html.replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(title.replace(/ \| Z Hostel$/, ""))}" />`);
  if (image) html = html.replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${esc(/^https?:/.test(image) ? image : (env.VITE_ASSET_ORIGIN || site) + image)}" />`);
  html = html.replace("</head>", `    ${extra}\n  </head>`);
  const file = route === "/" ? "dist/index.html" : `dist${route}index.html`;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html); written++;
}
console.log(`route pages: ${written} index.html files (HTTP 200 on GitHub Pages)`);
writeFileSync("dist/robots.txt", `User-agent: *\nAllow: /\nDisallow: /events/tabi-tabi-po/admin.html\n\nSitemap: ${site}/sitemap.xml\n`);
console.log(`sitemap.xml: ${urls.length} URLs for ${site}`);
