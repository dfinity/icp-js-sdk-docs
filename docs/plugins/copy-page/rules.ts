import TurndownService from "turndown";

export const HTML_TAGS_TO_REMOVE: Array<keyof HTMLElementTagNameMap> = [
  "script",
  "style",
  "starlight-toc" as keyof HTMLElementTagNameMap, // Mobile table of contents
  "mobile-starlight-toc" as keyof HTMLElementTagNameMap, // Mobile TOC variant
];

const CLASSES_TO_REMOVE = [
  "sidebar",
  "pagination-links",
  "tablist-wrapper",
  "sr-only",
  "copy-page-button-group",
];

/**
 * Converts card titles to h4 headings
 */
export const cardTitlesRule: TurndownService.Rule = {
  filter: (node) => {
    return (
      node.nodeName === "P" &&
      node.classList.contains("title")
    );
  },
  replacement: (content) => {
    // Clean up content and convert to h4
    const cleanContent = content.replace(/\s+/g, " ").trim();
    return "\n\n#### " + cleanContent + "\n\n";
  },
};

/**
 * Cleans up link text to remove extra whitespace and newlines
 */
export const cleanLinksRule: TurndownService.Rule = {
  filter: "a",
  replacement: (content, node) => {
    const href = node.getAttribute("href");
    if (!href) {
      return content;
    }

    // Remove extra whitespace and newlines
    const cleanContent = content.replace(/\s+/g, " ").trim();
    const title = node.title ? ` "${node.title}"` : "";

    return `[${cleanContent}](${href}${title})`;
  },
};

/**
 * Parse Fenced Code Blocks with language from data-language or class attribute
 */
export const fencedCodeBlockRule: TurndownService.Rule = {
  filter: (node, options) => {
    return (
      options.codeBlockStyle === "fenced" &&
      node.nodeName === "PRE" &&
      Boolean(node.firstChild) &&
      (node.firstChild as HTMLElement).nodeName === "CODE"
    );
  },
  replacement: (
    _content,
    node,
    options,
  ) => {
    const codeNode = node.firstChild as HTMLElement;

    // Try to get language from data-language attribute first, then from class
    const language = node.getAttribute("data-language") ||
      codeNode.getAttribute("data-language") || "";

    // Extract code preserving line structure
    // Some syntax highlighters wrap each line in divs (e.g., expressive-code)
    let code = "";
    const lines = codeNode.querySelectorAll(".ec-line, .line");

    if (lines.length > 0) {
      // If we found line elements, extract text from each
      code = Array.from(lines)
        .map((line) => line.textContent || "")
        .join("\n");
    } else {
      // Fall back to plain textContent
      code = codeNode.textContent || "";
    }

    // Trim trailing whitespace but preserve the code structure
    code = code.trimEnd();

    return (
      "\n\n" + options.fence + language + "\n" +
      code +
      "\n" + options.fence + "\n\n"
    );
  },
};

export function shouldRemoveElement(node: HTMLElement): boolean {
  if (!node.classList) {
    return false;
  }

  return CLASSES_TO_REMOVE.some((className) =>
    node.classList.contains(className)
  );
}
