import TurndownService from "turndown";
import { gfm } from "@joplin/turndown-plugin-gfm";
import { htmlToContent, transformLinks } from "./transforms.ts";
import {
  cardTitlesRule,
  cleanLinksRule,
  fencedCodeBlockRule,
  HTML_TAGS_TO_REMOVE,
  shouldRemoveElement,
} from "./rules.ts";

export function htmlToMarkdown(html: string, siteUrl: string): string {
  const mainContent = htmlToContent(html);

  const turndownService = new TurndownService({
    codeBlockStyle: "fenced",
    headingStyle: "atx",
    hr: "---",
  });

  turndownService.remove(HTML_TAGS_TO_REMOVE);
  turndownService.remove(shouldRemoveElement);

  turndownService.addRule("cardTitles", cardTitlesRule);
  turndownService.addRule("cleanLinks", cleanLinksRule);
  turndownService.addRule("fencedCodeBlock", fencedCodeBlockRule);

  // Use Github flavored markdown
  turndownService.use(gfm);

  let markdown = turndownService.turndown(mainContent);
  markdown = transformLinks(markdown, siteUrl);

  return markdown;
}
