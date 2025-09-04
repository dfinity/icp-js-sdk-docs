import { z } from "astro/zod";

const headersSchema = z.array(z.object({
  title: z.string(),
  description: z.string(),
  href: z.string(),
  githubRepo: z.string(),
}));

export const configSchema = z.object({
  headers: headersSchema,
});

export type MultiHeaderConfig = z.infer<typeof configSchema>;

export function getCurrentHeader(
  config: MultiHeaderConfig,
  projectPath: string,
): MultiHeaderConfig["headers"][number] | undefined {
  return config.headers.find((header) => projectPath.startsWith(header.href));
}
