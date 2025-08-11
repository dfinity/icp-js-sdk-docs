export const PROJECTS_FILE_NAME = "projects.json";

interface ProjectsConfig {
  projects: Project[];
}

interface Project {
  repository: string;
  subdirectory: string;
}

export async function loadProjectsConfig(
  path: string,
): Promise<ProjectsConfig> {
  const projectsData = await Deno.readFile(path);
  return JSON.parse(new TextDecoder().decode(projectsData));
}
