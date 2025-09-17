import * as React from "react";

import { type MultiSidebarConfig } from "../config.ts";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import pluginConfig from "virtual:starlight-multi-sidebar/config";
import "./ProjectSwitcher.css";

type Header = MultiSidebarConfig["sidebars"][number]["header"];

type Props = {
  projectPath: string;
  currentHeader?: Header | undefined;
};

const headers = pluginConfig.sidebars.map((sidebar) => ({
  basePath: sidebar.basePath,
  header: sidebar.header,
}));

export const ProjectSwitcherReact: React.FC<Props> = ({
  projectPath,
  currentHeader,
}) => {
  return (
    <React.Fragment>
      <NavigationMenu.Root
        data-slot="navigation-menu"
        className="project-switcher"
      >
        <NavigationMenu.List
          data-slot="navigation-menu-list"
          className="project-switcher-list"
        >
          <NavigationMenu.Item
            data-slot="navigation-menu-item"
            className="project-switcher-item"
          >
            <NavigationMenu.Trigger
              data-slot="navigation-menu-trigger"
              className="project-switcher-trigger"
            >
              <span>{currentHeader?.title || "Packages"}</span>
              <svg
                className="project-switcher-chevron"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17 9.17a1 1 0 0 0-1.41 0L12 12.71 8.46 9.17a1 1 0 1 0-1.41 1.42l4.24 4.24a1.002 1.002 0 0 0 1.42 0L17 10.59a1.002 1.002 0 0 0 0-1.42Z" />
              </svg>
            </NavigationMenu.Trigger>
            <NavigationMenu.Content
              data-slot="navigation-menu-content"
              className="project-switcher-content"
            >
              <ul>
                {headers.map((h) => {
                  const isActive = projectPath?.startsWith(h.basePath);
                  return (
                    <li key={h.basePath}>
                      <NavigationMenu.Link
                        className="project-switcher-link"
                        asChild
                      >
                        <a
                          href={h.basePath}
                          className={isActive ? "active" : undefined}
                          role="menuitem"
                        >
                          <div className="project-switcher-link-title">
                            {h.header.title}
                          </div>
                          <div className="project-switcher-link-description">
                            {h.header.description}
                          </div>
                        </a>
                      </NavigationMenu.Link>
                    </li>
                  );
                })}
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Indicator
            data-slot="navigation-menu-indicator"
            className="project-switcher-indicator"
          >
            <div className="project-switcher-arrow" />
          </NavigationMenu.Indicator>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </React.Fragment>
  );
};
