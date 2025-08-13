import * as fs from "@std/fs";
import * as path from "@std/path";

export async function syncFile(
  srcFile: string,
  destFile: string,
): Promise<void> {
  await fs.ensureDir(path.dirname(destFile));
  await sync(srcFile, destFile);
}

export async function syncDir(srcDir: string, destDir: string): Promise<void> {
  await fs.ensureDir(destDir);
  for await (const entry of Deno.readDir(srcDir)) {
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    await sync(src, dest);
  }
}

async function sync(src: string, dest: string): Promise<void> {
  await fs.copy(src, dest, {
    overwrite: true,
    preserveTimestamps: true,
  });
}

export async function topLevelDir(dir: string): Promise<string> {
  const topLevelDirs: string[] = [];
  for await (const entry of Deno.readDir(dir)) {
    if (entry.isDirectory) {
      topLevelDirs.push(entry.name);
    }
  }
  if (topLevelDirs.length === 1) {
    return topLevelDirs[0];
  }
  throw new Error(
    `Expected 1 top-level directory in ${dir}, got ${topLevelDirs.length}`,
  );
}
