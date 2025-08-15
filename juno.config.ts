import { defineConfig } from "@junobuild/config";
import { REDIRECTS } from "./redirects.ts";

export default defineConfig({
  satellite: {
    ids: {
      production: "tdg7b-baaaa-aaaal-asj3a-cai",
    },
    predeploy: ["deno task predeploy"],
    source: "dist",
    storage: {
      redirects: REDIRECTS,
    },
    precompress: {
      mode: "replace", // only upload the compressed version of the file
      algorithm: "brotli",
    },
  },
});
