// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  output: "server",

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
});
