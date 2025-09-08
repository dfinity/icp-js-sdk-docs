import * as path from "path";
import { type MultiSidebarConfig } from "./plugins/multi-sidebar/config.ts";
import { type ProjectsSchema } from "../projects-schema.d.ts";

const DOCS_DIR = import.meta.dirname!;
const PROJECTS_FILE = path.join(DOCS_DIR, "..", "projects.json");
const DOCS_FILES_DIR = path.join(DOCS_DIR, "src", "content", "docs");

type ProjectVersions = MultiSidebarConfig["sidebars"][number]["versions"];

export function getSidebarsFromProjects(
  projectsConfig: ProjectsSchema,
): MultiSidebarConfig["sidebars"] {
  const sidebars: MultiSidebarConfig["sidebars"] = [];

  for (const project of projectsConfig.projects) {
    const versionsJsonPath = path.join(
      DOCS_FILES_DIR,
      project.subdirectory,
      "versions.json",
    );
    const versions = loadJson<ProjectVersions>(versionsJsonPath);

    sidebars.push({
      basePath: `/${project.subdirectory}`,
      versions,
      header: {
        title: project.title,
        description: project.description,
        githubRepo: project.repository,
      },
    });
  }

  return sidebars;
}

export function getProjectsConfig(): ProjectsSchema {
  return loadJson(PROJECTS_FILE);
}

function loadJson<T>(filePath: string): T {
  const data = Deno.readFileSync(filePath);
  return JSON.parse(new TextDecoder().decode(data));
}
