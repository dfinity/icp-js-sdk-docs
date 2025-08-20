import { defineConfig } from "@junobuild/config";
import { REDIRECTS } from "./redirects.ts";
import { REWRITES } from "./rewrites.ts";

export default defineConfig({
  satellite: {
    ids: {
      production: "tdg7b-baaaa-aaaal-asj3a-cai",
      development: "jx5yt-yyaaa-aaaal-abzbq-cai",
    },
    predeploy: ["deno task docs:build", "deno task predeploy"],
    source: "dist",
    storage: {
      redirects: REDIRECTS,
      rewrites: REWRITES,
    },
    precompress: {
      mode: "replace", // only upload the compressed version of the file
      algorithm: "brotli",
    },
  },
  emulator: {
    satellite: {},
  },
});
