// Builds the site for GitHub Pages (served under /<repo>/) into dist/.
// Publish by pushing dist/ to the gh-pages branch:  npm run build:pages && npx gh-pages -d dist
import { execSync } from "node:child_process";
const repo = process.env.PAGES_REPO || "Zhostel-V1";
const owner = process.env.PAGES_OWNER || "itsoleiya";
execSync("npm run build", {
  stdio: "inherit",
  env: { ...process.env, VITE_BASE: `/${repo}/`, VITE_SITE_URL: `https://${owner}.github.io/${repo}` },
});
