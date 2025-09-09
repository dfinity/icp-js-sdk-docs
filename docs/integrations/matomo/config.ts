import { z } from "astro/zod";

export const configSchema = z.object({
  enabled: z.boolean(),
  host: z.string().refine((host) => !host.endsWith("/"), {
    message: "Host must not end with a slash",
  }),
  siteId: z.number(),
  debug: z.boolean(),
});

export type MatomoConfig = z.infer<typeof configSchema>;
