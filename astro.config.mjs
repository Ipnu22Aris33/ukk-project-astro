// @ts-check
import { defineConfig } from "astro/config";
import { webcore } from "webcoreui/integration";
import node from "@astrojs/node";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "server",
  server: {
    port: 8080,
    host: true,
  },
  integrations: [webcore(), react()],

  adapter: node({
    mode: "standalone",
  }),
});
