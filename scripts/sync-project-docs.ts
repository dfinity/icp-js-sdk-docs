import * as path from "@std/path";
import { loadProjectsConfig, PROJECTS_FILE_NAME } from "./utils/projects.ts";

// Files and directories to exclude from copying
const EXCLUDED_PATTERNS = [
  ".git",
  ".gitignore",
];

const SCRIPT_DIR = path.dirname(path.fromFileUrl(import.meta.url));
const ROOT_DIR = path.join(SCRIPT_DIR, "..");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const PROJECTS_FILE = path.join(ROOT_DIR, PROJECTS_FILE_NAME);

function shouldExclude(path: string): boolean {
  const pathParts = path.split("/");
  return EXCLUDED_PATTERNS.some((pattern) => {
    if (pattern.startsWith("*")) {
      return path.endsWith(pattern.slice(1));
    }
    return pathParts.includes(pattern);
  });
}

async function copyDirectoryWithExclusions(
  sourcePath: string,
  targetPath: string,
): Promise<void> {
  const entries = Deno.readDir(sourcePath);

  for await (const entry of entries) {
    if (shouldExclude(entry.name)) {
      console.log(`Excluding: ${entry.name}`);
      continue;
    }

    const sourceEntry = `${sourcePath}/${entry.name}`;
    const targetEntry = `${targetPath}/${entry.name}`;

    if (entry.isDirectory) {
      await Deno.mkdir(targetEntry, { recursive: true });
      await copyDirectoryWithExclusions(sourceEntry, targetEntry);
    } else if (entry.isFile) {
      await Deno.copyFile(sourceEntry, targetEntry);
    }
  }
}

async function main() {
  const sourceRepositoryDir = Deno.env.get("SOURCE_REPO_DIR");
  const sourceRepository = Deno.env.get("SOURCE_REPO");
  if (!sourceRepositoryDir) {
    throw new Error(
      "Environment variable SOURCE_REPO_DIR is required (absolute path to checked-out source repository)",
    );
  }
  if (!sourceRepository) {
    throw new Error(
      "Environment variable SOURCE_REPO is required (identifier matching projects.json -> projects[].repository)",
    );
  }

  const projectsConfig = await loadProjectsConfig(PROJECTS_FILE);
  const project = projectsConfig.projects.find((p) =>
    p.repository === sourceRepository
  );
  if (!project) {
    throw new Error(
      `No project configuration found for repository: ${sourceRepository}`,
    );
  }

  const { repository, subdirectory } = project;

  console.log(`Processing ${repository} -> public/${subdirectory}`);

  const targetDir = path.join(PUBLIC_DIR, subdirectory);

  await Deno.stat(sourceRepositoryDir);

  await Deno.remove(targetDir, { recursive: true });
  console.log(`Removed existing public/${subdirectory}`);

  await Deno.mkdir(targetDir, { recursive: true });
  console.log(`Created public/${subdirectory}`);

  console.log(
    `Copying files to public/${subdirectory} (excluding patterns: ${
      EXCLUDED_PATTERNS.join(", ")
    })...`,
  );
  await copyDirectoryWithExclusions(
    sourceRepositoryDir,
    targetDir,
  );

  console.log(`Successfully updated public/${subdirectory}`);
}

if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in sync-project-docs script:", message);

    Deno.exit(1);
  }
}
