import path from "path";
import fs from "fs";
import { type MultiSidebarConfig } from "./config.ts";
import type { StarlightConfig } from "@astrojs/starlight/types";

type Sidebar = NonNullable<StarlightConfig["sidebar"]>;

const currentDir = import.meta.dirname!;
const docsDir = path.join(currentDir, "../../src/content/docs");

export function loadSidebars(config: MultiSidebarConfig): Sidebar {
  const sidebar: Sidebar = [];

  for (const entry of config.sidebars) {
    const directory = entry.basePath.startsWith("/")
      ? entry.basePath.slice(1)
      : entry.basePath;
    const root = path.join(docsDir, directory);

    const subdirs = fs.readdirSync(root, { withFileTypes: true });
    for (const subdir of subdirs) {
      if (subdir.isDirectory()) {
        const sidebarFile = path.join(root, subdir.name, "_sidebar.json");
        const section = `${directory}/${subdir.name}`;
        const sidebarConfig = loadSidebarConfig(sidebarFile);
        if (sidebarConfig) {
          sidebar.push(...transformSidebarConfigItems(sidebarConfig, section));
        }
      }
    }
  }

  return sidebar;
}

function loadSidebarConfig(filePath: string): Sidebar | undefined {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    console.warn(`Sidebar config for ${filePath}: ${error}`);
    return undefined;
  }
}

function transformSidebarConfigItems(
  sidebar: Sidebar,
  sectionPath: string,
): Sidebar {
  return sidebar.map((item) => {
    if ("link" in item) {
      return {
        ...item,
        link: `/${sectionPath}/${removeInitialSlash(item.link)}`,
      };
    } else if ("items" in item) {
      return {
        ...item,
        items: transformSidebarConfigItems(item.items, sectionPath),
      };
    } else if ("autogenerate" in item) {
      return {
        ...item,
        autogenerate: {
          ...item.autogenerate,
          directory: `${sectionPath}/${
            removeInitialSlash(item.autogenerate.directory)
          }`,
        },
      };
    } else {
      return item;
    }
  });
}

function removeInitialSlash(path: string): string {
  return path.startsWith("/") ? path.slice(1) : path;
}
