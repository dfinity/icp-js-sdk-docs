import * as React from "react";
import pluginConfig from "virtual:starlight-multi-sidebar/config";
import "./VersionDropdown.css";
import { getCurrentPathComponents } from "../path.ts";

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

export function VersionDropdown(): React.JSX.Element | null {
  const [options, setOptions] = React.useState<
    Array<{ value: string; label: string }>
  >([]);
  const [selectedValue, setSelectedValue] = React.useState<string>("");

  async function onChange(_e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedVersionPath = _e.currentTarget.value;
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

      const nextHref =
        `${projectPath}/${selectedVersionPath}${_rest}${search}${hash}`;

      const hrefToCheck =
        `${projectPath}/${selectedVersionPath}${_rest}${search}`;
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

  React.useEffect(() => {
    try {
      const { pathname } = globalThis.location;
      const { projectPath, subPath } = getCurrentPathComponents(pathname);

      const project = pluginConfig.sidebars.find(
        (p) => p.basePath === projectPath,
      );

      if (!project) {
        setOptions([]);
        setSelectedValue("");
        return;
      }

      const dropdownOptions = project.versions.map((v) => ({
        value: v.path,
        label: v.label,
      }));

      setOptions(dropdownOptions);
      const selected = dropdownOptions.find(
        ({ value }) => value.toLowerCase() === (subPath || "").toLowerCase(),
      ) ?? dropdownOptions[0];
      setSelectedValue(selected?.value || "");
    } catch {
      // Do nothing, but avoid throwing an error
    }
  }, []);

  return (
    <div>
      <label
        htmlFor="sidebar-version-select"
        className="sidebar-version-select-label"
      >
        Version
      </label>
      <select
        id="sidebar-version-select"
        aria-label="Select documentation version"
        onChange={onChange}
        value={selectedValue}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
