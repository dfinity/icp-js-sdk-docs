import * as path from "@std/path";

export const PROJECTS_FILE_NAME = "projects.json";

export enum ProjectDocsFileExt {
  zip = ".zip",
  json = ".json",
  html = ".html",
}

export const ALLOWED_PROJECT_DOCS_FILE_EXTS = [
  ProjectDocsFileExt.zip,
  ProjectDocsFileExt.json,
  ProjectDocsFileExt.html,
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

export async function loadProjectsConfig(
  path: string,
): Promise<ProjectsConfig> {
  const projectsData = await Deno.readFile(path);
  return JSON.parse(new TextDecoder().decode(projectsData));
}

export async function loadProjectConfig(
  path: string,
  repository: string,
): Promise<Project | undefined> {
  const projectsConfig = await loadProjectsConfig(path);
  return projectsConfig.projects.find((p) => p.repository === repository);
}
