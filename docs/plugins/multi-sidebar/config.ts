import { z } from "astro/zod";

const versionSchema = z.object({
  path: z.string(),
  label: z.string(),
  versionInTitle: z.string().optional(),
});

const headerSchema = z.object({
  title: z.string(),
  description: z.string(),
  githubRepo: z.string(),
});

const sidebarSchema = z.object({
  basePath: z.string().refine((path) => path.startsWith("/"), {
    message: "Base path must start with a slash",
  }),
  versions: z.array(versionSchema),
  header: headerSchema,
});

export const configSchema = z.object({
  sidebars: z.array(sidebarSchema),
});

export type MultiSidebarConfig = z.infer<typeof configSchema>;

export function getCurrentSidebar(
  config: MultiSidebarConfig,
  projectPath: string,
): z.infer<typeof sidebarSchema> | undefined {
  return config.sidebars.find((sidebar) =>
    projectPath.startsWith(sidebar.basePath)
  );
}

export function getCurrentVersion(
  config: MultiSidebarConfig,
  projectPath: string,
): z.infer<typeof versionSchema> | undefined {
  return config.sidebars.find((sidebar) =>
    projectPath.startsWith(sidebar.basePath)
  )?.versions.find((version) => projectPath.startsWith(version.path));
}

export function getCurrentHeader(
  config: MultiSidebarConfig,
  projectPath: string,
): z.infer<typeof headerSchema> | undefined {
  return config.sidebars.find((sidebar) =>
    projectPath.startsWith(sidebar.basePath)
  )?.header;
}
