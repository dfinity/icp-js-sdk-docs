import type { AstroIntegrationLogger } from "astro";
import { z } from "astro/zod";
import { defineIntegration } from "astro-integration-kit";
import { htmlToMarkdown } from "./to-markdown.ts";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";
import { type Dirent } from "fs";

const copyPageConfigSchema = z.object({
  siteUrl: z.string(),
  logger: z.custom<AstroIntegrationLogger>(),
});

export const copyPageIntegration = defineIntegration({
  name: "starlight-copy-page-integration",
  optionsSchema: copyPageConfigSchema,
  setup({ options }) {
    const { siteUrl, logger } = options;

    return {
      hooks: {
        "astro:build:done": async ({ dir }) => {
          logger.info("Generating markdown files from HTML pages...");

          try {
            const distPath = fileURLToPath(dir);
            const htmlFiles = await findHtmlFiles(distPath);
            let successCount = 0;
            let errorCount = 0;

            for (const htmlPath of htmlFiles) {
              try {
                // Read the HTML file
                const html = await readFile(htmlPath, "utf-8");

                // Convert to markdown
                const markdown = htmlToMarkdown(html, siteUrl);

                // Create markdown file path (replace index.html with index.md)
                const mdPath = htmlPath.replace(/index\.html$/, "index.md");

                // Write markdown file
                await writeFile(mdPath, markdown, "utf-8");

                // Get relative path for logging
                const relativePath = mdPath.replace(distPath, "");
                logger.debug(`Generated: ${relativePath}`);
                successCount++;
              } catch (error) {
                logger.warn(
                  `Failed to generate markdown for ${htmlPath}: ${error}`,
                );
                errorCount++;
              }
            }

            logger.info(
              `Markdown generation complete: ${successCount} files generated, ${errorCount} errors`,
            );
          } catch (error) {
            logger.error(`Failed to generate markdown files: ${error}`);
          }
        },
      },
    };
  },
});

async function findHtmlFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  async function walk(currentPath: string) {
    const entries = await readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentPath, entry.name);

      if (shouldWalk(entry)) {
        await walk(fullPath);
      } else if (entry.isFile() && entry.name === "index.html") {
        files.push(fullPath);
      }
    }
  }

  // Start by walking subdirectories only, skipping root-level files
  const rootEntries = await readdir(dir, { withFileTypes: true });
  for (const entry of rootEntries) {
    if (shouldWalk(entry)) {
      const subDirPath = join(dir, entry.name);
      await walk(subDirPath);
    }
  }

  return files;
}

function shouldWalk(entry: Dirent): boolean {
  return entry.isDirectory() && !entry.name.startsWith("_") &&
    entry.name !== "pagefind";
}
