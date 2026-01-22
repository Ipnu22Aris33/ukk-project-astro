// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  output: "server",
  server: {
    port: 8080,
    host: true,
  },

  build: {
    format: "directory",
  },

  vite: {
    ssr: {
      noExternal: ["bootstrap"],
    },
    optimizeDeps: {
      include: ["bootstrap"],
    },
  },

  integrations: [react()],

  adapter: node({
    mode: "standalone",
  }),
});
