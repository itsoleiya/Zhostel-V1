// Re-imports every blog post from the WordPress REST API into src/data/posts.json.
// Only works while the WordPress site is still online. Usage: npm run import:posts
import { writeFileSync } from "node:fs";

const WP = process.argv[2] || "https://zhostel.com";
const get = async (path) => {
  const res = await fetch(`${WP}${path}`, { headers: { "User-Agent": "zhostel-site-import" } });
  if (!res.ok) throw new Error(`${res.status} for ${path}`);
  return { json: await res.json(), pages: Number(res.headers.get("x-wp-totalpages") || 1) };
};
const decode = (s) => s
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
  .replace(/&hellip;/g, "…");
const rel = (s) => s
  .replace(/https?:\/\/(?:www\.)?zhostel\.com(?=\/wp-content\/)/g, "")
  .replace(/https?:\/\/(?:www\.)?zhostel\.com\/(?!wp-content)/g, "/");

const posts = [];
for (let page = 1, total = 1; page <= total; page++) {
  const r = await get(`/wp-json/wp/v2/posts?per_page=100&page=${page}`);
  total = r.pages; posts.push(...r.json);
}
const cats = Object.fromEntries((await get("/wp-json/wp/v2/categories?per_page=100")).json.map((c) => [c.id, c.name]));
const ids = [...new Set(posts.map((p) => p.featured_media).filter(Boolean))];
const media = {};
for (let i = 0; i < ids.length; i += 100) {
  const r = await get(`/wp-json/wp/v2/media?include=${ids.slice(i, i + 100).join(",")}&per_page=100`);
  for (const m of r.json) media[m.id] = m;
}

const out = posts
  .sort((a, b) => (a.date < b.date ? 1 : -1))
  .map((p) => {
    const m = media[p.featured_media];
    const s = m?.media_details?.sizes ?? {};
    const pick = s["regal-blog-thumb"] || s.large || s.full;
    const excerpt = decode(p.excerpt.rendered.replace(/<[^>]+>/g, "")).trim().replace(/\s*\[…\]\s*$/, "…");
    return {
      id: p.id, slug: p.slug, title: decode(p.title.rendered), date: p.date, modified: p.modified,
      categories: p.categories.map((c) => cats[c] ?? String(c)), excerpt,
      featuredImage: m ? { src: rel(pick?.source_url ?? m.source_url), alt: m.alt_text || "", width: pick?.width ?? null, height: pick?.height ?? null } : null,
      contentHtml: rel(p.content.rendered.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")),
      sourceUrl: p.link,
    };
  });
writeFileSync("src/data/posts.json", JSON.stringify(out));
console.log(`Imported ${out.length} posts.`);
