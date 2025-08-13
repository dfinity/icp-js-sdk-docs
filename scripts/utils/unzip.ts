import * as path from "@std/path";
import * as fs from "@std/fs";
import { createWriteStream } from "node:fs";
import * as yauzl from "yauzl";

const isDirectoryEntry = (entry: yauzl.Entry) => /\/$/.test(entry.fileName);

export function unzip(
  zipFilePath: string,
  destDir: string,
  whitelistFn?: (fileName: string) => boolean,
): Promise<void> {
  return new Promise((resolve, reject) => {
    yauzl.open(zipFilePath, { lazyEntries: true }, (err, zipFile) => {
      if (err) {
        return reject(err);
      }

      zipFile.on("error", reject);
      zipFile.on("end", resolve);

      zipFile.on("entry", (entry) => {
        console.log(`Processing entry: ${entry.fileName}`);
        if (isDirectoryEntry(entry)) {
          // Directory entry
          zipFile.readEntry();
        } else {
          // File entry
          zipFile.openReadStream(entry, (err, readStream) => {
            if (err) {
              return reject(err);
            }

            if (whitelistFn && !whitelistFn(entry.fileName)) {
              console.log(`Skipping file entry: ${entry.fileName}`);
              zipFile.readEntry();
              return;
            }

            const destPath = path.join(destDir, entry.fileName);
            fs.ensureDir(path.dirname(destPath))
              .then(() =>
                readStream
                  .pipe(createWriteStream(destPath))
                  .on("error", reject)
                  .on("finish", () => zipFile.readEntry())
              )
              .catch(reject);
          });
        }
      });
      zipFile.readEntry();
    });
  });
}
