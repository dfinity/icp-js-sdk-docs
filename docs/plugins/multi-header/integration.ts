import { addVirtualImports, defineIntegration } from "astro-integration-kit";
import { configSchema } from "./config.ts";

export const multiHeaderIntegration = defineIntegration({
  name: "starlight-multi-header-integration",
  optionsSchema: configSchema,
  setup({ name, options }) {
    return {
      hooks: {
        "astro:config:setup": (params) => {
          addVirtualImports(params, {
            name,
            imports: {
              "virtual:starlight-multi-header/config": `export default ${
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
