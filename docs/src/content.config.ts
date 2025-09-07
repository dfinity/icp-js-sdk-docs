import { defineCollection } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { generateId } from "./generateId.ts";

export const collections = {
  docs: defineCollection({
    loader: docsLoader({ generateId }),
    schema: docsSchema(),
  }),
};
