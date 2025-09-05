// @ts-check
import { defineConfig, passthroughImageService } from "astro/config";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import { multiSidebarPlugin } from "./plugins/multi-sidebar/index.ts";

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
      title: "ICP JS SDK Docs",
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
              basePath: "/core",
              versions: [
                {
                  path: "latest",
                  label: "Latest (v4.0.2)",
                },
                {
                  path: "v4.0",
                  label: "v4.0",
                },
                {
                  path: "v3.2",
                  label: "v3.2",
                },
              ],
              header: {
                title: "Core",
                description: "Base library for Internet Computer apps.",
                githubRepo: "dfinity/icp-js-core",
              },
            },
            {
              basePath: "/pic-js",
              versions: [
                {
                  path: "latest",
                  label: "Latest (v5)",
                },
                {
                  path: "v5",
                  label: "v5",
                },
              ],
              header: {
                title: "PicJS",
                description: "Testing library for Pocket IC.",
                githubRepo: "dfinity/pic-js",
              },
            },
          ],
        }),
      ],
    }),
  ],
});
