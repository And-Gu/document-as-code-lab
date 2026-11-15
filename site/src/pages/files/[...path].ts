import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { repositoryFiles, repositoryRoot } from '../../lib/repository';
import { fingerprintPaths } from '../../lib/incremental-build.mjs';

export async function getStaticPaths() {
  const files = await repositoryFiles();
  const routes = [];
  // Bound file reads avoid opening every source and image simultaneously.
  for (let index = 0; index < files.length; index += 16) {
    const batch = await Promise.all(files.slice(index, index + 16).map(async (file) => ({
      params: { path: file },
      cacheKey: await fingerprintPaths(repositoryRoot, [file]),
      props: { file },
    })));
    routes.push(...batch);
  }
  return routes;
}

export const GET: APIRoute = async ({ props }) => {
  const file = props.file as string;
  const types: Record<string, string> = {
    '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
    '.json': 'application/json; charset=utf-8',
  };
  const body = await readFile(path.join(repositoryRoot, file));
  return new Response(new Uint8Array(body), {
    headers: { 'Content-Type': types[path.extname(file)] ?? 'text/plain; charset=utf-8' },
  });
};
