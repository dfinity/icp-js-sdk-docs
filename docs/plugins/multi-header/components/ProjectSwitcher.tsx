import * as React from "react";

import { type MultiHeaderConfig } from "../config.ts";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import "./ProjectSwitcher.css";

type Props = {
  headers: MultiHeaderConfig["headers"] | undefined;
  currentHref?: string | undefined;
};

export function ProjectSwitcher({ headers, currentHref }: Props) {
  if (!headers || headers.length === 0) return null;

  const current =
    headers.find((h) => currentHref?.startsWith(h.href)) ?? headers[0];

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
              <span>{current.title}</span>
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
                  const isActive = currentHref?.startsWith(h.href);
                  return (
                    <li key={h.href}>
                      <NavigationMenu.Link
                        className="project-switcher-link"
                        asChild
                      >
                        <a
                          href={h.href}
                          className={isActive ? "active" : undefined}
                          role="menuitem"
                        >
                          <div className="project-switcher-link-title">
                            {h.title}
                          </div>
                          <div className="project-switcher-link-description">
                            {h.description}
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
}
