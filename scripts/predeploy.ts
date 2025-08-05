import * as path from "@std/path";
import * as fs from "@std/fs";
import { syncFile } from "./utils/fs.ts";
import { unzip } from "./utils/unzip.ts";

const PROJECTS = ["core"];

const SCRIPT_DIR = path.dirname(path.fromFileUrl(import.meta.url));
const ROOT_DIR = path.join(SCRIPT_DIR, "..");
const SRC_DIR = path.join(ROOT_DIR, "public");
const DIST_DIR = path.join(ROOT_DIR, "dist");

async function syncProjects(): Promise<void> {
  await Promise.all(
    PROJECTS.map(async (project) => {
      const projectDir = path.join(SRC_DIR, project);
      const projectDistDir = path.join(DIST_DIR, project);

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

async function sync404File(): Promise<void> {
  await syncFile(
    path.join(DIST_DIR, "core", "latest", "404.html"),
    path.join(DIST_DIR, "404.html"),
  );
}

async function main(): Promise<void> {
  await syncProjects();
  // [TODO]: Remove once there is a root project with it's own 404.html
  await sync404File();
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
