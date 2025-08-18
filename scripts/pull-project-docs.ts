import * as path from "@std/path";
import * as fs from "@std/fs";
import * as cli from "@std/cli";
import {
  isAllowedFile,
  loadProjectConfig,
  PROJECTS_FILE_NAME,
} from "./utils/projects.ts";
import { unzip } from "./utils/unzip.ts";

const SCRIPT_DIR = path.dirname(path.fromFileUrl(import.meta.url));
const ROOT_DIR = path.join(SCRIPT_DIR, "..");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const PROJECTS_FILE = path.join(ROOT_DIR, PROJECTS_FILE_NAME);

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
    await unzip(tempZipPath, destDir, isAllowedFile);
  } finally {
    try {
      await Deno.remove(tempZipPath);
    } catch {
      // Ignore cleanup errors
    }
  }
}

async function main() {
  const args = cli.parseArgs(Deno.args, {
    string: ["project"],
  });
  if (!args.project) {
    throw new Error("Error: --project argument is required");
  }

  const project = await loadProjectConfig(PROJECTS_FILE, args.project);
  if (!project) {
    throw new Error(
      `Error: Project "${args.project}" not found in projects.json`,
    );
  }

  const downloadUrl =
    `https://github.com/${project.repository}/archive/refs/heads/${project.branch}.zip`;

  console.log(`Downloading and extracting project docs from ${downloadUrl}...`);

  const destDir = path.join(PUBLIC_DIR, project.subdirectory);

  console.log(`Emptying existing public/${project.subdirectory}...`);
  await fs.emptyDir(destDir);

  await downloadAndExtractZip(downloadUrl, destDir);

  console.log(`Done!`);
}

if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    console.error("Error in sync-project-docs script:", error);

    Deno.exit(1);
  }
}
