import type { StarlightPlugin } from "@astrojs/starlight/types";
import { type MultiHeaderConfig } from "./config.ts";
import { multiHeaderIntegration } from "./integration.ts";

export function multiHeaderPlugin(config: MultiHeaderConfig): StarlightPlugin {
  return {
    name: "starlight-multi-header-plugin",
    hooks: {
      "config:setup": (ctx) => {
        ctx.addIntegration(multiHeaderIntegration(config));
        ctx.updateConfig({
          components: {
            ...ctx.config.components,
            SiteTitle: "./plugins/multi-header/components/SiteTitle.astro",
            SocialIcons: "./plugins/multi-header/components/SocialIcons.astro",
          },
        });
      },
    },
  };
}
