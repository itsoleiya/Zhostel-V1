import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// VITE_BASE is "/" for a site on its own domain (zhostel.com, Netlify, Vercel)
// and "/<repo>/" for a GitHub Pages project site, e.g. "/Zhostel-V1/".
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: env.VITE_BASE || "/",
    plugins: [react()],
    build: { chunkSizeWarningLimit: 900 },
  };
});
