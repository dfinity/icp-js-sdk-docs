// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://js.icp.build/",
  integrations: [
    starlight({
      title: "ICP JavaScript SDK Docs",
      logo: {
        src: "./src/assets/icp.svg",
        alt: "Internet Computer Logo",
      },
      customCss: ["./src/assets/theme.css"],
      pagefind: false,
      tableOfContents: false,
      sidebar: [],
    }),
  ],
});
