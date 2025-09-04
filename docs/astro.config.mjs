// @ts-check
import { defineConfig, passthroughImageService } from "astro/config";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import { multiSidebarPlugin } from "./plugins/multi-sidebar/index.ts";
import { multiHeaderPlugin } from "./plugins/multi-header/index.ts";

// https://astro.build/config
export default defineConfig({
  site: "https://js.icp.build/",
  image: {
    service: passthroughImageService(),
  },
  vite: {
    server: {
      fs: {
        strict: false,
      },
    },
  },
  integrations: [
    react(),
    starlight({
      title: "ICP JavaScript SDK Docs",
      logo: {
        src: "./src/assets/icp.svg",
        alt: "Internet Computer Logo",
      },
      customCss: [
        "./src/assets/layers.css",
        "./src/assets/theme.css",
        "./src/assets/overrides.css",
        "./src/assets/elements.css",
      ],
      pagefind: false,
      sidebar: [],
      plugins: [
        multiSidebarPlugin({
          sidebars: [
            {
              directory: "core",
            },
          ],
        }),
        multiHeaderPlugin({
          headers: [
            {
              title: "Core",
              description: "Base library for Internet Computer apps.",
              href: "/core",
              githubRepo: "dfinity/icp-js-core",
            },
            {
              title: "PicJS",
              description: "Testing library for Pocket IC.",
              href: "/pic-js",
              githubRepo: "dfinity/pic-js",
            },
          ],
        }),
      ],
    }),
  ],
});
