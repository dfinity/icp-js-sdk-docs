import * as pagefind from "pagefind";
import { type MultiSidebarConfig } from "./config.ts";
import { type AstroIntegrationLogger } from "astro";
import path from "path";

const currentDir = import.meta.dirname!;
const distDir = path.join(currentDir, "../../dist");

export async function buildPagefindIndex(
  project: MultiSidebarConfig["sidebars"][number],
  logger: AstroIntegrationLogger,
) {
  for (const version of project.versions) {
    const { index } = await pagefind.createIndex();
    if (!index) {
      throw new Error("Failed to create pagefind index");
    }
    const versionDir = path.join(distDir, project.basePath, version.path);
    const pagefindOutputDir = path.join(versionDir, "pagefind");

    logger.info(`Building index in ${versionDir}`);

    await index.addDirectory({
      path: versionDir,
    });

    await index.writeFiles({
      outputPath: pagefindOutputDir,
    });
  }
}
