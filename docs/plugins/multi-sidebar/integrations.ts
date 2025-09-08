import { addVirtualImports, defineIntegration } from "astro-integration-kit";
import { z } from "astro/zod";
import { type AstroIntegrationLogger } from "astro";
import { configSchema } from "./config.ts";
import { buildPagefindIndex } from "./pagefind.ts";

export const multiSidebarIntegration = defineIntegration({
  name: "starlight-multi-sidebar-integration",
  optionsSchema: configSchema,
  setup({ name, options }) {
    return {
      hooks: {
        "astro:config:setup": (params) => {
          addVirtualImports(params, {
            name,
            imports: {
              "virtual:starlight-multi-sidebar/config": `export default ${
                JSON.stringify(
                  options,
                )
              }`,
            },
          });
        },
      },
    };
  },
});

const multiSearchConfigSchema = z.object({
  projects: configSchema.shape.sidebars,
  logger: z.custom<AstroIntegrationLogger>(),
});

export const multiSearchIntegration = defineIntegration({
  name: "starlight-multi-search-integration",
  optionsSchema: multiSearchConfigSchema,
  setup({ options }) {
    const { projects, logger } = options;

    return {
      hooks: {
        "astro:build:done": async () => {
          for (const project of projects) {
            logger.info(
              `Building pagefind index for project ${project.basePath}`,
            );
            await buildPagefindIndex(project, logger);
          }
          logger.info("Pagefind indexes built");
        },
      },
    };
  },
});
