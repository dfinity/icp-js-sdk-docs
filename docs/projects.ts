import * as path from "path";
import { type MultiSidebarConfig } from "./plugins/multi-sidebar/config.ts";
import { type ProjectsSchema } from "../projects-schema.d.ts";

const DOCS_DIR = import.meta.dirname!;
const PROJECTS_FILE = path.join(DOCS_DIR, "..", "projects.json");
const PUBLIC_DIR = path.join(DOCS_DIR, "..", "public");

type ProjectVersions = MultiSidebarConfig["sidebars"][number]["versions"];

export function getSidebarsFromProjects(): MultiSidebarConfig["sidebars"] {
  const projectsConfig = loadJson<ProjectsSchema>(PROJECTS_FILE);

  const sidebars: MultiSidebarConfig["sidebars"] = [];

  for (const project of projectsConfig.projects) {
    const versionsJsonPath = path.join(
      PUBLIC_DIR,
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

function loadJson<T>(filePath: string): T {
  const data = Deno.readFileSync(filePath);
  return JSON.parse(new TextDecoder().decode(data));
}
