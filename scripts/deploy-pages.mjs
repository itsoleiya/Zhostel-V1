// Publishes dist/ to the gh-pages branch WITHOUT deleting earlier builds' files in assets/.
// Visitors with a cached older page can then still load the chunks it asks for.
// Usage: npm run build:pages && npm run deploy:pages   (needs push access to origin)
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const sh = (cmd, cwd) => execSync(cmd, { cwd, stdio: "inherit" });
const out = (cmd, cwd) => execSync(cmd, { cwd }).toString().trim();

if (!existsSync("dist/index.html")) { console.error("Run `npm run build:pages` first."); process.exit(1); }
const remote = out("git remote get-url origin");
const src = out("git rev-parse --short HEAD");
const dir = mkdtempSync(join(tmpdir(), "gh-pages-"));
try {
  sh(`git clone --quiet --branch gh-pages --single-branch "${remote}" "${dir}"`);
} catch {
  sh(`git init --quiet -b gh-pages "${dir}"`);
  sh(`git remote add origin "${remote}"`, dir);
}
// Overwrite top-level files with the new build; keep everything already in assets/.
cpSync("dist", dir, { recursive: true, force: true });
writeFileSync(join(dir, ".nojekyll"), "");
sh("git add -A", dir);
try { sh(`git commit --quiet -m "Build of main@${src} for GitHub Pages"`, dir); }
catch { console.log("Nothing changed."); }
sh("git push origin gh-pages", dir);
rmSync(dir, { recursive: true, force: true });
