// Downloads every /wp-content/ file the site references into public/wp-content/, so the site no longer
// depends on the WordPress server. Afterwards set VITE_ASSET_ORIGIN= (empty) and rebuild.
// Usage: npm run mirror:assets            (all files)
//        npm run mirror:assets -- --limit 5 (try a few first)
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ORIGIN = "https://zhostel.com";
const limitArg = process.argv.indexOf("--limit");
const limit = limitArg > -1 ? Number(process.argv[limitArg + 1]) : Infinity;

const texts = readdirSync("src/data").map((f) => readFileSync(join("src/data", f), "utf8"));
const found = new Set();
for (const t of texts) for (const m of t.matchAll(/\/wp-content\/[^\s"'`)<>,\\]+/g)) found.add(m[0]);
// Template-literal paths in the .ts data files are written as `${U}/2019/03/x.jpg` with U = "/wp-content/uploads".
for (const t of texts) for (const m of t.matchAll(/\$\{U\}\/([^\s"'`)]+)/g)) found.add(`/wp-content/uploads/${m[1]}`);
for (const t of texts) for (const m of t.matchAll(/img\("([^"]+)"/g)) found.add(`/wp-content/uploads/${m[1]}`);
for (const t of texts) for (const m of t.matchAll(/"(gb\d-1000x1000\.jpg)"/g)) found.add(`/wp-content/uploads/2018/08/${m[1]}`);

const list = [...found].map((p) => decodeURI(p).replace(/&amp;/g, "&")).filter((p) => /\.[a-z0-9]{2,5}$/i.test(p)).sort();
console.log(`${list.length} referenced files.`);
let ok = 0, skipped = 0, failed = [];
for (const p of list.slice(0, limit)) {
  const dest = join("public", p);
  if (existsSync(dest)) { skipped++; continue; }
  try {
    const res = await fetch(ORIGIN + encodeURI(p));
    if (!res.ok) throw new Error(String(res.status));
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    ok++;
    await new Promise((r) => setTimeout(r, 150)); // be gentle with the origin server
  } catch (e) { failed.push(`${p} (${e.message})`); }
}
console.log(`Downloaded ${ok}, already present ${skipped}, failed ${failed.length}.`);
if (failed.length) { writeFileSync("mirror-failures.txt", failed.join("\n")); console.log("See mirror-failures.txt"); }
