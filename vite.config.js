import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// License portal (license-portal) does not send CORS headers, so the dev server
// proxies /api to it and rewrites Origin/Referer to the portal's own site_url.
const PORTAL_TARGET = process.env.PORTAL_TARGET || "http://127.0.0.1:8192";
const PORTAL_ORIGIN = process.env.PORTAL_ORIGIN || PORTAL_TARGET;

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    host: "127.0.0.1",
    port: 15222,
    strictPort: true,
    proxy: {
      "/api": {
        target: PORTAL_TARGET,
        changeOrigin: true,
        headers: {
          origin: PORTAL_ORIGIN,
          referer: `${PORTAL_ORIGIN}/`
        }
      }
    },
    watch: {
      ignored: ["**/.qa/**", "**/legacy-static/**"]
    }
  },
  preview: {
    host: "127.0.0.1",
    port: 4173
  }
});
