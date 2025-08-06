import * as fs from "@std/fs";
import * as path from "@std/path";

export async function syncFile(
  srcFile: string,
  destFile: string,
): Promise<void> {
  await fs.ensureDir(path.dirname(destFile));
  await sync(srcFile, destFile);
}

async function sync(src: string, dest: string): Promise<void> {
  await fs.copy(src, dest, {
    overwrite: true,
    preserveTimestamps: true,
  });
}
