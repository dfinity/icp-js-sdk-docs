import { type AstroIntegration } from "astro";
import { type MatomoConfig } from "./config.ts";
import path from "path";

const currentDir = import.meta.dirname!;

export function matomo(config: MatomoConfig): AstroIntegration {
  let script = "";

  if (config.enabled) {
    script = `import {initMatomo} from '@/integrations/matomo/matomo.ts';
          initMatomo(${
      JSON.stringify(
        config,
      )
    });`;
  }

  return {
    name: "starlight-matomo-integration",
    hooks: {
      "astro:config:setup": ({ injectScript, updateConfig }) => {
        injectScript("page", script);
        updateConfig({
          vite: {
            resolve: {
              alias: {
                "@/integrations/matomo/matomo.ts": path.resolve(
                  currentDir,
                  "./matomo.ts",
                ),
              },
            },
          },
        });
      },
    },
  };
}
