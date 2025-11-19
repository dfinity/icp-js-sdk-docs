/**
 * Extracts the main content from Starlight HTML page
 */
export function htmlToContent(html: string): string {
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  if (mainMatch && mainMatch[1]) {
    let content = mainMatch[1];

    // Remove all img tags - they should not be in the markdown output
    content = content.replace(/<img[^>]*>/g, "");

    // Remove heading anchor links (sl-anchor-link) - these cause empty links in output
    content = content.replace(
      /<a[^>]*class="[^"]*sl-anchor-link[^"]*"[^>]*>[\s\S]*?<\/a>/g,
      "",
    );

    // Remove "hidden" attribute from tab panels so all content is shown
    content = content.replace(
      /(<div[^>]*role="tabpanel"[^>]*)hidden([^>]*>)/g,
      "$1$2",
    );

    return content;
  }

  return html;
}

/**
 * Transforms internal links to absolute URLs pointing to markdown files
 */
export function transformLinks(markdown: string, siteUrl: string): string {
  // Ensure siteUrl doesn't end with a slash to avoid double slashes
  const baseUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;

  // Match markdown links: [text](url)
  return markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    // Only transform internal links (starting with /)
    if (url.startsWith("/")) {
      // Remove any hash fragments
      const [path, hash] = url.split("#");

      // Construct the full URL with .md extension
      let fullUrl: string;
      if (path.endsWith(".md")) {
        fullUrl = `${baseUrl}${path}`;
      } else {
        // Add /index.md to directory paths
        fullUrl = `${baseUrl}${path}${path.endsWith("/") ? "" : "/"}index.md`;
      }

      // Re-add hash if it existed
      if (hash) {
        fullUrl += `#${hash}`;
      }

      return `[${text}](${fullUrl})`;
    }

    // Return external links unchanged
    return match;
  });
}
