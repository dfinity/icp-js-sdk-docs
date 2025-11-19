import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import {
  IconCheck,
  IconChevronDown,
  IconClaude,
  IconCopy,
  IconMarkdown,
  IconOpenai,
  IconX,
} from "./icons.tsx";
import "./CopyPage.css";
import { fetchMarkdown, getMarkdownUrl, getPromptUrl } from "./helpers.ts";

enum CopyStatus {
  IDLE = "Copy Markdown",
  COPIED = "Copied!",
  FAILED = "Failed",
}

export function CopyPage() {
  const [copyStatus, setCopyStatus] = React.useState<CopyStatus>(
    CopyStatus.IDLE
  );
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const markdownUrl = React.useMemo(() => getMarkdownUrl(), []);

  const handleCopyMarkdown = async () => {
    // The dev server doesn't serve markdown files,
    // so this is supposed to fail in development.
    try {
      const markdownContent = await fetchMarkdown(markdownUrl);
      if (!markdownContent) {
        throw new Error("Failed to fetch markdown content");
      }

      await navigator.clipboard.writeText(markdownContent);

      setCopyStatus(CopyStatus.COPIED);
      setTimeout(() => {
        setCopyStatus(CopyStatus.IDLE);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      setCopyStatus(CopyStatus.FAILED);
    }
  };

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <div className="copy-page-button-group">
        <button
          className="copy-page-primary-button"
          onClick={handleCopyMarkdown}
          type="button"
          data-slot="button"
        >
          <CopyButtonIcon copyStatus={copyStatus} />
          <span>{copyStatus}</span>
        </button>
        <div className="copy-page-trigger-divider" />
        <DropdownMenuTrigger asChild>
          <button
            className="copy-page-chevron-button"
            onClick={() => setDropdownOpen((val) => !val)}
            type="button"
            data-slot="button"
          >
            <IconChevronDown className="copy-page-chevron" />
          </button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a href={markdownUrl} target="_blank" rel="noopener noreferrer">
            <IconMarkdown className="copy-page-item-icon" />
            <span>View as Markdown</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={getPromptUrl("https://chatgpt.com/", markdownUrl)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconOpenai className="copy-page-item-icon" />
            <span>Open in ChatGPT</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={getPromptUrl("https://claude.ai/new", markdownUrl)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconClaude className="copy-page-item-icon" />
            <span>Open in Claude</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      className={`copy-page-dropdown-trigger ${className || ""}`}
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={`copy-page-dropdown-content ${className || ""}`}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item>) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={`copy-page-dropdown-item ${className || ""}`}
      {...props}
    />
  );
}

function CopyButtonIcon({ copyStatus }: { copyStatus: CopyStatus }) {
  if (copyStatus === CopyStatus.COPIED) {
    return <IconCheck className="copy-page-icon" />;
  }
  if (copyStatus === CopyStatus.FAILED) {
    return <IconX className="copy-page-icon" />;
  }
  return <IconCopy className="copy-page-icon" />;
}
