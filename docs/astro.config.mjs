// @ts-check
import { defineConfig, passthroughImageService } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://js.icp.build/",
  image: {
    service: passthroughImageService(),
  },
  integrations: [
    starlight({
      title: "ICP JavaScript SDK Docs",
      logo: {
        src: "./src/assets/icp.svg",
        alt: "Internet Computer Logo",
        replacesTitle: true,
      },
      customCss: [
        "./src/assets/layers.css",
        "./src/assets/theme.css",
        "./src/assets/overrides.css",
        "./src/assets/elements.css",
      ],
      pagefind: false,
      tableOfContents: false,
      sidebar: [],
    }),
  ],
});
