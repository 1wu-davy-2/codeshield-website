import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    host: "127.0.0.1",
    port: 15222,
    strictPort: true,
    watch: {
      ignored: ["**/.qa/**", "**/legacy-static/**"]
    }
  },
  preview: {
    host: "127.0.0.1",
    port: 4173
  }
});
