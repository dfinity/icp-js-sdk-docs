import * as React from "react";

import { type MultiSidebarConfig } from "../../config.ts";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import pluginConfig from "virtual:starlight-multi-sidebar/config";
import "./ProjectSwitcher.css";

type Header = MultiSidebarConfig["sidebars"][number]["header"];
type HeaderItem = {
  basePath: MultiSidebarConfig["sidebars"][number]["basePath"];
  header: Header;
};
type HeadersByCategory = Record<
  Header["category"],
  {
    items: Array<HeaderItem>;
  }
>;

const headersByCategory = pluginConfig.sidebars.reduce<HeadersByCategory>(
  (acc, sidebar) => {
    acc[sidebar.header.category].items.push({
      basePath: sidebar.basePath,
      header: sidebar.header,
    });
    return acc;
  },
  { library: { items: [] }, tool: { items: [] } }
);

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
  currentHeader?: Header | undefined;
};

export const ProjectSwitcherReact: React.FC<ProjectSwitcherProps> = ({
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
