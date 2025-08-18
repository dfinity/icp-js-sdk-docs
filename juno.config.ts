import { defineConfig } from "@junobuild/config";

export default defineConfig({
  satellite: {
    ids: {
      production: "tdg7b-baaaa-aaaal-asj3a-cai",
      development: "jx5yt-yyaaa-aaaal-abzbq-cai",
    },
    predeploy: ["deno task docs:build", "deno task predeploy"],
    source: "dist",
    storage: {
      redirects: [
        {
          source: "/",
          location: "/core/latest",
          code: 302,
        },
      ],
    },
  },
  emulator: {
    satellite: {},
  },
});
