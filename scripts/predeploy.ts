import * as path from "@std/path";
import * as fs from "@std/fs";
import { unzip } from "./utils/unzip.ts";
import { loadProjectsConfig, PROJECTS_FILE_NAME } from "./utils/projects.ts";

const SCRIPT_DIR = path.dirname(path.fromFileUrl(import.meta.url));
const ROOT_DIR = path.join(SCRIPT_DIR, "..");
const SRC_DIR = path.join(ROOT_DIR, "public");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const PROJECTS_FILE = path.join(ROOT_DIR, PROJECTS_FILE_NAME);

async function syncProjects(): Promise<void> {
  const projectsConfig = await loadProjectsConfig(PROJECTS_FILE);

  await Promise.all(
    projectsConfig.projects.map(async (project) => {
      const projectDir = path.join(SRC_DIR, project.subdirectory);
      const projectDistDir = path.join(DIST_DIR, project.subdirectory);

      for await (
        const entry of fs.walk(projectDir, {
          exts: [".zip"],
          followSymlinks: true,
          includeSymlinks: true,
          includeFiles: true,
          includeDirs: false,
          canonicalize: true,
        })
      ) {
        const targetDirname = entry.name.slice(0, -4); // Remove .zip extension
        const targetDir = path.join(projectDistDir, targetDirname);
        await unzip(entry.path, targetDir);
      }
    }),
  );
}

async function syncRootFiles(): Promise<void> {
  for await (
    const entry of fs.walk(SRC_DIR, {
      followSymlinks: true,
      includeSymlinks: true,
      includeFiles: true,
      includeDirs: false,
      maxDepth: 1, // we only want the root files
    })
  ) {
    const targetPath = path.join(DIST_DIR, entry.path.slice(SRC_DIR.length));
    await fs.ensureDir(path.dirname(targetPath));
    await fs.copy(entry.path, targetPath, { overwrite: true });
  }
}

async function main(): Promise<void> {
  await syncRootFiles();
  await syncProjects();
}

if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in predeploy script:", message);

    Deno.exit(1);
  }
}
