import { createHash } from 'node:crypto';
import { lstat, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Stable, content-addressed keys for Astro's incremental static builds.
 * Do not include the workflow run, build timestamp, or HEAD SHA: those
 * change even when the rendered page is identical.
 */
export function buildCacheKey(...inputs) {
  return createHash('sha256').update(JSON.stringify(inputs)).digest('hex');
}

/**
 * Fingerprint files that a page reads directly from the repository rather
 * than through Astro's imported module graph or a content collection.
 * File names and bytes are hashed, so additions, deletions, and modifications
 * invalidate the key without relying on checkout timestamps or Git state.
 */
export async function fingerprintPaths(root, relativePaths) {
  const repositoryRoot = path.resolve(root);
  const digest = createHash('sha256');

  async function visit(relative) {
    const absolute = path.resolve(repositoryRoot, relative);
    if (absolute === repositoryRoot || !absolute.startsWith(repositoryRoot + path.sep)) {
      throw new Error(`Source fingerprint path escapes repository: ${relative}`);
    }

    const info = await lstat(absolute);
    if (info.isSymbolicLink()) {
      throw new Error(`Source fingerprint does not follow symlinks: ${relative}`);
    }
    if (info.isDirectory()) {
      digest.update(`directory\\0${relative}\\0`);
      const entries = (await readdir(absolute)).sort();
      for (const name of entries) await visit(path.posix.join(relative, name));
    } else if (info.isFile()) {
      digest.update(`file\\0${relative}\\0`);
      digest.update(await readFile(absolute));
      digest.update('\\0');
    } else {
      throw new Error(`Unsupported source fingerprint entry: ${relative}`);
    }
  }

  for (const relative of [...new Set(relativePaths)].sort()) await visit(relative);
  return digest.digest('hex');
}
