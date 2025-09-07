// Reimplements functions from https://github.com/withastro/astro/blob/218e07054f4fe7a16e13479861dc162f6d886edc/packages/astro/src/content/utils.ts
// to avoid slugifying the path using github-slugger

import path from "path";
import { fileURLToPath } from "url";
import { docsLoader } from "@astrojs/starlight/loaders";

type GenerateIdOptions = Parameters<
  NonNullable<NonNullable<Parameters<typeof docsLoader>[0]>["generateId"]>
>[0];

export function generateId({ entry, base, data }: GenerateIdOptions): string {
  if (data.slug) {
    return data.slug as string;
  }
  const entryURL = new URL(encodeURI(entry), base);
  const { slug } = getContentEntryIdAndSlug({
    entry: entryURL,
    contentDir: base,
    collection: "",
  });
  return slug;
}

// From https://github.com/withastro/astro/blob/218e07054f4fe7a16e13479861dc162f6d886edc/packages/astro/src/content/utils.ts#L381
function getContentEntryIdAndSlug({
  entry,
  contentDir,
  collection,
}: { entry: URL; contentDir: URL; collection: string }) {
  const relativePath = getRelativeEntryPath(entry, collection, contentDir);
  const withoutFileExt = relativePath.replace(
    new RegExp(path.extname(relativePath) + "$"),
    "",
  );
  const rawSlugSegments = withoutFileExt.split(path.sep);
  // This is the step where we skip slugifying the path using github-slugger
  const slug = rawSlugSegments.join("/")
    .replace(/\/index$/, "");
  const res = {
    id: normalizePath(relativePath),
    slug,
  };
  return res;
}

// From https://github.com/withastro/astro/blob/218e07054f4fe7a16e13479861dc162f6d886edc/packages/astro/src/content/utils.ts#L407
function getRelativeEntryPath(entry: URL, collection: string, contentDir: URL) {
  const relativeToContent = path.relative(
    fileURLToPath(contentDir),
    fileURLToPath(entry),
  );
  const relativeToCollection = path.relative(collection, relativeToContent);
  return relativeToCollection;
}

// From https://github.com/withastro/astro/blob/218e07054f4fe7a16e13479861dc162f6d886edc/packages/astro/src/core/viteUtils.ts#L12
function normalizePath(p: string) {
  return path.posix.normalize(p);
}
