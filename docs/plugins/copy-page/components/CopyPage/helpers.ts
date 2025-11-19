export function getMarkdownUrl(): string {
  // Handle server-side rendering
  if (!globalThis.location) {
    return "";
  }

  let currentUrl = globalThis.location.href;
  if (currentUrl.endsWith("/")) {
    currentUrl = currentUrl.slice(0, -1);
  }
  return `${currentUrl}/index.md`;
}

export function getPromptUrl(providerUrl: string, url: string): string {
  const prompt = encodeURIComponent(
    "Please read the contents from the following link so that I can ask questions about it: " +
      url,
  );
  return `${providerUrl}?q=${prompt}`;
}

export async function fetchMarkdown(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return response.text();
    }
  } catch (error) {
    console.error("Failed to fetch markdown content:", error);
  }
}
