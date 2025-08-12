import * as path from "@std/path";

const SCRIPT_DIR = path.dirname(path.fromFileUrl(import.meta.url));
const ROOT_DIR = path.join(SCRIPT_DIR, "..", "..");
const PROJECTS_FILE = path.join(ROOT_DIR, "projects.json");

export interface ProjectsConfig {
  projects: Project[];
}

export interface Project {
  repository: string;
  subdirectory: string;
}

export async function loadProjectsConfig(): Promise<ProjectsConfig> {
  const content = await Deno.readTextFile(PROJECTS_FILE);
  return JSON.parse(content) as ProjectsConfig;
}
