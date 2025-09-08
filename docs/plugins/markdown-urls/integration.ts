import { defineIntegration } from "astro-integration-kit";
import { type AstroIntegrationLogger, type RemarkPlugins } from "astro";
import { visit } from "unist-util-visit";
import path from "path";

const currentDir = import.meta.dirname!;
const docsDir = path.join(currentDir, "../../src/content/docs");

type RemarkPlugin = RemarkPlugins[number];

const markdownUrlsRemarkPlugin: RemarkPlugin = ([logger, site]: [
  AstroIntegrationLogger,
  string,
]) =>
(tree, file) => {
  const currentFileDir = path.dirname(file.path);

  visit(tree, "link", (node) => {
    const url = node.url;

    // take full URLs to the current site and make them relative
    if (url.startsWith(site)) {
      node.url = new URL(url).pathname;
      return;
    }

    // skip any other full URLs
    if (
      url.startsWith("https://") ||
      url.startsWith("/") ||
      url.startsWith("http://") ||
      url.startsWith("mailto:") ||
      url.startsWith("#")
    ) {
      logger.debug(`Skipping URL: ${url}`);
      return;
    }

    const resolvedUrl = path.resolve(currentFileDir, url);
    const relativeToDocs = path.relative(docsDir, resolvedUrl);
    const nodeUrl = `/${
      relativeToDocs
        .replace(/(index)?\.mdx?(#.*)?$/, "$2")
        .toLowerCase()
    }`;
    logger.debug(`Normalizing URL: ${url} -> ${nodeUrl}`);

    node.url = nodeUrl;
  });
};

export const markdownUrlsIntegration = defineIntegration({
  name: "starlight-markdown-urls-integration",
  setup: () => {
    return {
      hooks: {
        "astro:config:setup": ({ updateConfig, config, logger }) => {
          updateConfig({
            markdown: {
              remarkPlugins: [
                ...config.markdown.remarkPlugins,
                [
                  markdownUrlsRemarkPlugin,
                  [
                    logger,
                    config.site,
                  ],
                ],
              ],
            },
          });
        },
      },
    };
  },
});
