import * as path from "@std/path";
import * as fs from "@std/fs";
import * as cli from "@std/cli";
import { unzip } from "./utils/unzip.ts";
import { loadProjectsConfig, Project } from "./utils/project.ts";

const SCRIPT_DIR = path.dirname(path.fromFileUrl(import.meta.url));
const ROOT_DIR = path.join(SCRIPT_DIR, "..");

async function downloadAndExtractZip(
  url: string,
  destDir: string,
): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to download: ${response.status} ${response.statusText}`,
    );
  }

  const tempZipPath = await Deno.makeTempFile({ suffix: ".zip" });

  try {
    if (response.body === null) {
      throw new Error("Response body is null");
    }
    await Deno.writeFile(tempZipPath, response.body);

    await fs.ensureDir(destDir);
    await unzip(tempZipPath, destDir);
  } finally {
    try {
      await Deno.remove(tempZipPath);
    } catch {
      // Ignore cleanup errors
    }
  }
}

function findProject(
  projects: Project[],
  projectName: string,
): Project | undefined {
  return projects.find((p) => p.subdirectory === projectName);
}

async function main() {
  const args = cli.parseArgs(Deno.args, { string: ["project"] });

  if (!args.project) {
    throw new Error("Error: --project argument is required");
  }

  const config = await loadProjectsConfig();
  const project = findProject(config.projects, args.project);

  if (!project) {
    throw new Error(
      `Error: Project "${args.project}" not found in projects.json`,
    );
  }

  const downloadUrl =
    `https://github.com/${project.repository}/archive/refs/heads/icp-pages.zip`;

  const destDir = path.join(ROOT_DIR, "public", project.subdirectory);

  await Deno.remove(destDir, { recursive: true });

  await downloadAndExtractZip(downloadUrl, destDir);
}

if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in pull-docs script:", message);

    Deno.exit(1);
  }
}
