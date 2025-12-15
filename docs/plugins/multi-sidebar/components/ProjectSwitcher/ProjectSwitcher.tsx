import * as React from "react";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import type { HeaderItem, HeadersByCategory } from "./types.ts";
import "./ProjectSwitcher.css";

type NavigationLinkProps = React.ComponentProps<typeof NavigationMenu.Link> & {
  projectPath: string;
  headerItem: HeaderItem;
};

const NavigationLink: React.FC<NavigationLinkProps> = ({
  projectPath,
  headerItem,
  ...props
}) => {
  const isActive = projectPath.startsWith(headerItem.basePath);

  return (
    <NavigationMenu.Link className="project-switcher-link" asChild {...props}>
      <a
        href={headerItem.basePath}
        className={isActive ? "active" : undefined}
        role="menuitem"
      >
        <div className="project-switcher-link-title">
          {headerItem.header.title}
        </div>
        <div className="project-switcher-link-description">
          {headerItem.header.description}
        </div>
      </a>
    </NavigationMenu.Link>
  );
};

type ProjectSwitcherProps = {
  projectPath: string;
  currentProjectTitle?: string | undefined;
  headersByCategory: HeadersByCategory;
};

export const ProjectSwitcherReact: React.FC<ProjectSwitcherProps> = ({
  projectPath,
  currentProjectTitle,
  headersByCategory,
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
              <span>{currentProjectTitle || "Packages"}</span>
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
              <div className="project-switcher-sections" role="menu">
                {headersByCategory.library.items.length > 0 && (
                  <>
                    <div
                      className="project-switcher-section-title"
                      id="project-switcher-section-title-libraries"
                    >
                      Libraries
                    </div>
                    {headersByCategory.library.items.map((h, i) => (
                      <NavigationLink
                        key={h.basePath}
                        projectPath={projectPath}
                        headerItem={h}
                        style={{ gridColumnStart: "1", gridRowStart: i + 3 }}
                      />
                    ))}
                  </>
                )}
                {headersByCategory.tool.items.length > 0 && (
                  <>
                    <div
                      className="project-switcher-section-title"
                      id="project-switcher-section-title-tools"
                    >
                      Tools
                    </div>
                    {headersByCategory.tool.items.map((h, i) => (
                      <NavigationLink
                        key={h.basePath}
                        projectPath={projectPath}
                        headerItem={h}
                        style={{ gridColumnStart: "2", gridRowStart: i + 3 }}
                      />
                    ))}
                  </>
                )}
              </div>
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
