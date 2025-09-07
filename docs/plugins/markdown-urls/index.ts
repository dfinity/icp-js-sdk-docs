import { type StarlightPlugin } from "@astrojs/starlight/types";
import { markdownUrlsIntegration } from "./integration.ts";

export function markdownUrlsPlugin(): StarlightPlugin {
  return {
    name: "starlight-markdown-urls-plugin",
    hooks: {
      "config:setup": (ctx) => {
        ctx.addIntegration(markdownUrlsIntegration());
      },
    },
  };
}
