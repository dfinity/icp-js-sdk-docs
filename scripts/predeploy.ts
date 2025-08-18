import * as path from "@std/path";
import * as fs from "@std/fs";
import { unzip } from "./utils/unzip.ts";
import {
  ALLOWED_PROJECT_DOCS_FILE_EXTS,
  loadProjectsConfig,
  ProjectDocsFileExt,
  PROJECTS_FILE_NAME,
} from "./utils/projects.ts";

const SCRIPT_DIR = path.dirname(path.fromFileUrl(import.meta.url));
const ROOT_DIR = path.join(SCRIPT_DIR, "..");
const DOCS_DIR = path.join(ROOT_DIR, "docs");
const DOCS_DIST_DIR = path.join(DOCS_DIR, "dist");
const PUB_DIR = path.join(ROOT_DIR, "public");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const PROJECTS_FILE = path.join(ROOT_DIR, PROJECTS_FILE_NAME);

async function syncProjects(): Promise<void> {
  const projectsConfig = await loadProjectsConfig(PROJECTS_FILE);

  await Promise.all(
    projectsConfig.projects.map(async (project) => {
      console.log(`Syncing project: ${project.repository}...`);
      const projectDir = path.join(PUB_DIR, project.subdirectory);
      const projectDistDir = path.join(DIST_DIR, project.subdirectory);

      await fs.ensureDir(projectDistDir);

      for await (
        const entry of fs.walk(projectDir, {
          exts: ALLOWED_PROJECT_DOCS_FILE_EXTS,
          followSymlinks: true,
          includeSymlinks: true,
          includeFiles: true,
          includeDirs: false,
          canonicalize: true,
        })
      ) {
        console.log(`Syncing file: ${entry.path}...`);
        const ext = path.extname(entry.path);
        const targetDirname = path.basename(entry.path, ext);
        if (ext === ProjectDocsFileExt.zip) {
          const targetDir = path.join(projectDistDir, targetDirname);
          await unzip(entry.path, targetDir);
        } else {
          const targetPath = path.join(projectDistDir, entry.name);
          await fs.copy(entry.path, targetPath, { overwrite: true });
        }
      }
    }),
  );
}

async function main(): Promise<void> {
  console.log("Emptying dist directory...");
  await fs.emptyDir(DIST_DIR);

  console.log("Copying docs dist directory to dist...");
  await fs.copy(DOCS_DIST_DIR, DIST_DIR, { overwrite: true });

  console.log("Syncing projects...");
  await syncProjects();
}

if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    console.error("Error in predeploy script:", error);

    Deno.exit(1);
  }
}
