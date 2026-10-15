import { existsSync, readFileSync } from "node:fs";
/** Minimal .env reader so scripts see the same VITE_* values as the app. */
export function loadEnv() {
  const env = { ...process.env };
  for (const f of [".env", ".env.production"]) {
    if (!existsSync(f)) continue;
    for (const line of readFileSync(f, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && env[m[1]] === undefined) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
  return env;
}
