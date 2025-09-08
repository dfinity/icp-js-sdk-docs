// @ts-check
import { defineConfig, passthroughImageService } from "astro/config";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import { multiSidebarPlugin } from "./plugins/multi-sidebar/index.ts";
import { markdownUrlsPlugin } from "./plugins/markdown-urls/index.ts";
import { getProjectsConfig, getSidebarsFromProjects } from "./projects.ts";

const projectsConfig = getProjectsConfig();

// https://astro.build/config
export default defineConfig({
  site: "https://js.icp.build/",
  image: {
    service: passthroughImageService(),
  },
  output: "static",
  vite: {
    server: {
      fs: {
        strict: false,
      },
    },
    ssr: {
      // See https://docs.astro.build/en/guides/troubleshooting/#adding-dependencies-to-astro-in-a-monorepo
      noExternal: ["@astrojs/react"],
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
      favicon: "/favicon.png",
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
          sidebars: getSidebarsFromProjects(projectsConfig),
        }),
        markdownUrlsPlugin(),
      ],
    }),
  ],
});
