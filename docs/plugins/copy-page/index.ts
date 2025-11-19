import type { StarlightPlugin } from "@astrojs/starlight/types";
import { copyPageIntegration } from "./integration.ts";

export function copyPagePlugin(): StarlightPlugin {
  return {
    name: "starlight-copy-page-plugin",
    hooks: {
      "config:setup": (ctx) => {
        ctx.addIntegration(
          copyPageIntegration({
            siteUrl: ctx.astroConfig.site!, // we assume this is always set
            logger: ctx.logger,
          }),
        );

        ctx.updateConfig({
          components: {
            ...ctx.config.components,
            PageTitle: "./plugins/copy-page/components/PageTitle.astro",
          },
        });
      },
    },
  };
}
