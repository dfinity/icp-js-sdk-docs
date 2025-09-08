import * as path from "@std/path";
import * as fs from "@std/fs";
import { unzip } from "./utils/unzip.ts";
import {
  ALLOWED_PROJECT_DOCS_FILE_EXTS,
  loadProjectsConfig,
  ProjectDocsFileExt,
} from "./utils/projects.ts";

const SCRIPT_DIR = path.dirname(path.fromFileUrl(import.meta.url));
const ROOT_DIR = path.join(SCRIPT_DIR, "..");
const DOCS_DIR = path.join(ROOT_DIR, "docs");
const DOCS_FILES_DIR = path.join(DOCS_DIR, "src", "content", "docs");
const DOCS_PAGES_DIR = path.join(DOCS_DIR, "src", "pages");
const PUB_DIR = path.join(ROOT_DIR, "public");

async function syncProjects(): Promise<void> {
  const projectsConfig = await loadProjectsConfig();

  await Promise.all(
    projectsConfig.projects.map(async (project) => {
      console.log(`Syncing project: ${project.repository}...`);
      const projectPubDir = path.join(PUB_DIR, project.subdirectory);
      const projectDocsDir = path.join(DOCS_FILES_DIR, project.subdirectory);
      const projectDocsPagesDir = path.join(
        DOCS_PAGES_DIR,
        project.subdirectory,
      );

      await fs.ensureDir(projectDocsDir);
      await fs.ensureDir(projectDocsPagesDir);
      await fs.emptyDir(projectDocsDir);
      await fs.emptyDir(projectDocsPagesDir);

      for await (
        const entry of fs.walk(projectPubDir, {
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
          const targetDir = path.join(projectDocsDir, targetDirname);
          const targetPagesDir = path.join(projectDocsPagesDir, targetDirname);
          await unzip(entry.path, targetDir, {
            overrideDestDir: (fileName) => {
              if (path.extname(fileName) === ProjectDocsFileExt.html) {
                return path.join(targetPagesDir, fileName);
              }
              return path.join(targetDir, fileName);
            },
          });
        } else if (ext === ProjectDocsFileExt.html) {
          const targetPath = path.join(projectDocsPagesDir, entry.name);
          await fs.copy(entry.path, targetPath, { overwrite: true });
        } else {
          const targetPath = path.join(projectDocsDir, entry.name);
          await fs.copy(entry.path, targetPath, { overwrite: true });
        }
      }
    }),
  );
}

async function main(): Promise<void> {
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
