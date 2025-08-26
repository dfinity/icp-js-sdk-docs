import { defineConfig } from "@junobuild/config";
import { REDIRECTS } from "./redirects.ts";
import { REWRITES } from "./rewrites.ts";

export default defineConfig({
  satellite: {
    ids: {
      production: "bmsnr-hiaaa-aaaal-ask2q-cai",
      development: "jx5yt-yyaaa-aaaal-abzbq-cai",
    },
    predeploy: ["deno task docs:build", "deno task predeploy"],
    source: "dist",
    storage: {
      redirects: REDIRECTS,
      rewrites: REWRITES,
    },
    precompress: [
      {
        pattern: "**/*.+(js|mjs|css)",
        algorithm: "brotli",
        // only upload the compressed version for these files
        mode: "replace",
      },
      {
        pattern: "**/*.html",
        algorithm: "brotli",
        // upload both the compressed and uncompressed version of HTML files
        // to avoid issues with OpenGraph previews
        mode: "both",
      },
    ],
  },
  emulator: {
    satellite: {},
  },
});
