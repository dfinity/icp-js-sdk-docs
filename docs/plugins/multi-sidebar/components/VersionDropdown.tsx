import * as React from "react";
import pluginConfig from "virtual:starlight-multi-sidebar/config";
import "./VersionDropdown.css";
import { getCurrentPathComponents } from "../path.ts";

type VersionOptions = (typeof pluginConfig)["sidebars"][number]["versions"];

type Props = {
  dropdownOptions: VersionOptions;
  initialSelectedValue: string;
};

export const VersionDropdown: React.FC<Props> = ({
  dropdownOptions,
  initialSelectedValue,
}) => {
  const [selectedValue, setSelectedValue] =
    React.useState<string>(initialSelectedValue);

  async function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedVersionPath = e.currentTarget.value;
    setSelectedValue(selectedVersionPath);

    if (!selectedVersionPath) {
      return;
    }

    const { pathname, search, hash } = globalThis.location;
    const { projectPath, subPath } = getCurrentPathComponents(pathname);

    try {
      const currentPrefix = subPath
        ? `${projectPath}/${subPath}`
        : `${projectPath}`;
      const _rest = pathname.startsWith(currentPrefix)
        ? pathname.slice(currentPrefix.length)
        : "";

      const nextHref = `${projectPath}/${selectedVersionPath}${_rest}${search}${hash}`;

      const hrefToCheck = `${projectPath}/${selectedVersionPath}${_rest}${search}`;
      const exists = await doesUrlExist(hrefToCheck);
      if (exists) {
        globalThis.location.href = nextHref;
        return;
      }
    } catch {
      // Do nothing, but avoid throwing an error
    }

    // Fallback to project/version base if any error occurs
    const baseHref = `${projectPath}/${selectedVersionPath}`;
    globalThis.location.href = baseHref;
  }

  return (
    <div>
      <label
        htmlFor="sidebar-version-select"
        className="sidebar-version-select-label"
      >
        Version
        {dropdownOptions.find((v) => v.path === selectedValue)?.versionInTitle
          ? ` (${
              dropdownOptions.find((v) => v.path === selectedValue)!
                .versionInTitle
            })`
          : ""}
      </label>
      <select
        id="sidebar-version-select"
        aria-label="Select documentation version"
        onChange={onChange}
        value={selectedValue}
      >
        {dropdownOptions.map((opt) => (
          <option key={opt.path} value={opt.path}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

async function doesUrlExist(url: string): Promise<boolean> {
  try {
    const headResponse = await globalThis.fetch(url, {
      method: "HEAD",
      redirect: "follow",
    });
    if (headResponse.status && headResponse.status < 400) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
