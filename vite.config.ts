import { defineConfig } from "vite-plus";

export default defineConfig({
  root: "apps/web",
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:8787",
      "/health": "http://localhost:8787"
    }
  },
  build: {
    outDir: "../../dist",
    emptyOutDir: true
  }
});
