import pluginConfig from "virtual:starlight-multi-sidebar/config";
import { type MultiSidebarConfig } from "./config.ts";

type CurrentPathComponents = {
  /**
   * In `/core/latest`, the project path is `core`.
   * In `/core`, the project path is `core`.
   */
  projectPath: string;
  /**
   * In `/core/latest`, the sub path is `latest`.
   * In `/core`, the sub path is undefined.
   */
  subPath?: string;
};

/**
 * Get the current path components from the pathname.
 * @param pathname - The pathname to get the current base path from.
 * @returns The current path components.
 *
 * @example
 * ```
 * getCurrentPathComponents("/core/latest");
 * // { projectPath: "/core", subPath: "latest" }
 * getCurrentPathComponents("/core");
 * // { projectPath: "/core", subPath: undefined }
 * getCurrentPathComponents("/");
 * // { projectPath: "/", subPath: undefined }
 * ```
 */
export function getCurrentPathComponents(
  pathname: string,
): CurrentPathComponents {
  const [, projectPath, subPath] = pathname.split("/").slice(0, 3);
  return { projectPath: `/${projectPath}`, subPath };
}

export function getProjectAtCurrentPath(
  path: string,
): MultiSidebarConfig["sidebars"][number] | undefined {
  return pluginConfig.sidebars.find((project) =>
    path.startsWith(project.basePath)
  );
}
