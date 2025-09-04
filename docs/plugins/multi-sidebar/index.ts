import type { StarlightPlugin } from "@astrojs/starlight/types";
import { multiSidebarIntegration } from "./integration.ts";
import { type MultiSidebarConfig } from "./config.ts";
import { loadSidebars } from "./sidebars.ts";

export function multiSidebarPlugin(
  config: MultiSidebarConfig,
): StarlightPlugin {
  return {
    name: "starlight-multi-sidebar-plugin",
    hooks: {
      "config:setup": (ctx) => {
        ctx.addIntegration(multiSidebarIntegration(config));
        ctx.updateConfig({
          components: {
            ...ctx.config.components,
            Sidebar: "./plugins/multi-sidebar/components/Sidebar.astro",
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
