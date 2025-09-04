import { z } from "astro/zod";

const sidebarsSchema = z.array(z.object({
  directory: z.string(),
}));

export const configSchema = z.object({
  sidebars: sidebarsSchema,
});

export type MultiSidebarConfig = z.infer<typeof configSchema>;
