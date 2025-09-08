import * as path from "@std/path";

const SCRIPT_DIR = path.dirname(path.fromFileUrl(import.meta.url));
const ROOT_DIR = path.join(SCRIPT_DIR, "..", "..");
const PROJECTS_FILE_NAME = "projects.json";
const PROJECTS_FILE = path.join(ROOT_DIR, PROJECTS_FILE_NAME);

export enum ProjectDocsFileExt {
  zip = ".zip",
  json = ".json",
  html = ".html",
  md = ".md",
  mdx = ".mdx",
}

export const ALLOWED_PROJECT_DOCS_FILE_EXTS = [
  ProjectDocsFileExt.zip,
  ProjectDocsFileExt.json,
  ProjectDocsFileExt.html,
  ProjectDocsFileExt.md,
  ProjectDocsFileExt.mdx,
];

export function isAllowedFile(fileName: string): boolean {
  const ext = path.extname(fileName).toLowerCase();
  return ALLOWED_PROJECT_DOCS_FILE_EXTS.includes(ext as ProjectDocsFileExt);
}

interface ProjectsConfig {
  projects: Project[];
}

interface Project {
  repository: string;
  branch: string;
  subdirectory: string;
}

export async function loadProjectsConfig(): Promise<ProjectsConfig> {
  const projectsData = await Deno.readFile(PROJECTS_FILE);
  return JSON.parse(new TextDecoder().decode(projectsData));
}

export async function loadProjectConfig(
  repository: string,
): Promise<Project | undefined> {
  const projectsConfig = await loadProjectsConfig();
  return projectsConfig.projects.find((p) => p.repository === repository);
}
