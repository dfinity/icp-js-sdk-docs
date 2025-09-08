import type { StarlightPlugin } from "@astrojs/starlight/types";
import { type MultiSidebarConfig } from "./config.ts";
import { loadSidebars } from "./sidebars.ts";
import {
  multiSearchIntegration,
  multiSidebarIntegration,
} from "./integrations.ts";

export function multiSidebarPlugin(
  config: MultiSidebarConfig,
): StarlightPlugin {
  return {
    name: "starlight-multi-sidebar-plugin",
    hooks: {
      "config:setup": (ctx) => {
        ctx.addIntegration(multiSidebarIntegration(config));
        ctx.addIntegration(multiSearchIntegration({
          projects: config.sidebars,
          logger: ctx.logger,
        }));

        ctx.updateConfig({
          components: {
            ...ctx.config.components,
            Sidebar: "./plugins/multi-sidebar/components/Sidebar.astro",
            SiteTitle: "./plugins/multi-sidebar/components/SiteTitle.astro",
            SocialIcons: "./plugins/multi-sidebar/components/SocialIcons.astro",
            Search: "./plugins/multi-sidebar/components/Search.astro",
          },
          sidebar: [
            ...(ctx.config.sidebar || []),
            ...loadSidebars(config),
          ],
        });
      },
    },
  };
}
